from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import asc, or_
from typing import List, Optional


from app.clients.open_ai import open_ai_client


from app.api_models.offer import (Offer as API_Offer, ListOffersResponse,
                                  CreateOfferRequest, CreateOfferResponse,
                                  DeleteOfferRequest, DeleteOfferResponse,
                                  EditOfferDataRequest, EditOfferDataResponse, OfferVoteRequest, AuthorizeOfferResponse,
                                  OfferIsLiked)




import logging, sqlalchemy
from sqlalchemy import select

from app.db_models.offer import Offer, OfferTag, OfferVote as OfferVoteDB
from app.core.db import SessionLocal
from app.api.util import jwt_token_required, hidden_user_payload
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
offers_router = APIRouter()
logger = logging.getLogger(__name__)


from pydantic import BaseModel


class TagsList(BaseModel):
    tags: list[str]

def generate_tags(title: str, description: str, existing_tags: list[str]) -> list[str]:
    try:
        if not open_ai_client:
            return existing_tags

        completion = open_ai_client.with_options(max_retries=3).beta.chat.completions.parse(

            messages=[
                {
                    "role": "system",
                    "content": "You are administrator of university social network, and help to extract tags from user offers. "
                },
                {
                    "role": "user",
                    "content":
f"""
Please stretch the tags for the offer in student social network.
Additionaly, please, correct and return already typed tags by user (If it makes sense): {existing_tags}

Examples of tags: 'furniture,' 'sell,' 'buy,' 'event,' 'party,' 'clubs,' etc. 
Please keep tags concise, ideally with a maximum of 2 words per tag.
Maximum amount of tags 4, all tags MUST be from different topics. 

Offer title:
{title}

Offer Text:
{description}
"""[:2000]
}],
            model="gpt-4o",
            response_format=TagsList
        )
        event: TagsList = completion.choices[0].message.parsed

        return event.tags
    except:
        return existing_tags



@offers_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def create_offer(request: Request, create_offer_request: CreateOfferRequest, user_payload=Depends(hidden_user_payload)) -> CreateOfferResponse:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    create_offer_request : CreateOfferRequest
        The request data for creating an offer, which includes title, description, image_id, tags, and date.
    user_payload : dict, optional
        The payload containing user-specific information extracted from JWT token; it includes user_id.

    Returns
    -------
    CreateOfferResponse
        The response containing the ID of the newly created offer.
    """

    sender_id = user_payload['user_id']

    if len(create_offer_request.title) == 0:
        raise HTTPException(400, f'Offer title is missing')
    if len(create_offer_request.description) == 0:
        raise HTTPException(400, f'Offer description is missing')

    with SessionLocal() as session:
        with session.begin():
            # TODO: Maybe throw exception on empty tag

            generated_tags = generate_tags(create_offer_request.title,
                    create_offer_request.description, create_offer_request.tags)

            generated_tags = [" ".join(word.capitalize() for word in item.split()) for item in generated_tags]

            all_tags = validate_and_get_offers_tags(generated_tags, session)

            offer = Offer(title=create_offer_request.title,
                          description=create_offer_request.description,
                          author_id=sender_id,
                          image_id=create_offer_request.image_id,
                          tags=all_tags,
                          date=create_offer_request.date)
            session.add(offer)

        return CreateOfferResponse(offer_id=offer.id)


@offers_router.get("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def list_offers(request: Request, query_text: Optional[str] = Query(None),
                tags: Optional[List[str]] = Query(None, alias='tag'), user_payload=Depends(hidden_user_payload)) -> ListOffersResponse:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    tags : Optional[List[str]], default None
        List of tags to filter the offers.
    user_payload : dict, optional
        Payload information obtained from the JWT token.
    """
    # sender_id = user_payload['user_id']
    with SessionLocal() as session:
        with session.begin():
            def to_pydantic(offer: Offer) -> API_Offer:
                return API_Offer(
                    id=offer.id,
                    title=offer.title,
                    description=offer.description,
                    author_id=offer.author_id,
                    date=offer.date,
                    image_id=offer.image_id,
                    tags=list(map(lambda tag: tag.name, offer.tags))
                )

            command = session.query(Offer).options(sqlalchemy.orm.joinedload(Offer.tags)).order_by(asc(Offer.date))
            if tags:
                tags = list(filter(lambda x: len(x) > 0, map(lambda x: x.strip(), tags)))
                for tag in tags:
                    command = command.filter(Offer.tags.any(OfferTag.name == tag))

            if query_text:
                query_text = query_text.strip()
                if query_text:
                    command = command.filter(
                        or_(
                            Offer.title.ilike(f'%{query_text}%'),
                            Offer.description.ilike(f'%{query_text}%')
                        )
                    )
            offers_with_tags = command.all()
            return ListOffersResponse(offers=[to_pydantic(offer) for offer in offers_with_tags])


def validate_and_get_offers_tags(tags: list[str], session: Session) -> list[OfferTag]:
    """
    Parameters
    ----------
    tags : list[str]
        List of tag names to be validated and processed.

    session : Session
        Database session object to facilitate database operations.

    Returns
    -------
    list[OfferTag]
        List of validated and processed OfferTag objects, including both existing and new tags.
    """
    valid_tag_names = list(filter(lambda x: len(x) > 0, map(lambda x: x.strip(), tags)))

    existing_tags = list(session.scalars(
        select(OfferTag).where(OfferTag.name.in_(valid_tag_names))
    ).all())

    existing_tag_names = {tag.name for tag in existing_tags}
    new_tag_names = set(valid_tag_names) - existing_tag_names
    new_tags = [OfferTag(name=name) for name in new_tag_names]
    session.add_all(new_tags)

    all_tags = existing_tags + new_tags

    return all_tags


@offers_router.put("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def edit_offer_data(request: Request, edit_request: EditOfferDataRequest,
                    user_payload=Depends(hidden_user_payload)) -> EditOfferDataResponse:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    edit_request : EditOfferDataRequest
        The request object containing the new offer data to be edited.
    user_payload : dict, optional
        A dictionary containing the payload data extracted from the JWT token, default is None.

    Returns
    -------
    EditOfferDataResponse
        The response object indicating the result of the edit operation.

    Raises
    ------
    HTTPException
        If the offer title is missing.
        If the offer description is missing.
        If the offer with the specified ID does not exist.
        If the offer is not authored by the sender (user making the request).

    Notes
    -----
    This function requires a valid JWT token to be provided in the request.
    It checks the authorization and validates the input data before updating an offer.
    The offer can only be edited by its author.
    The tags associated with the offer are validated and updated.
    """
    sender_id = user_payload['user_id']

    if len(edit_request.title) == 0:
        raise HTTPException(400, f'Offer title is missing')
    if len(edit_request.description) == 0:
        raise HTTPException(400, f'Offer description is missing')

    with SessionLocal() as session:
        with session.begin():
            offer = session.query(Offer).filter_by(id=edit_request.offer_id).first()
            if offer is None:
                raise HTTPException(400, f'Offer with id {edit_request.offer_id} does not exist')

            if offer.author_id != sender_id:
                raise HTTPException(400, f'Offer can be edited only by its author')

            tags = validate_and_get_offers_tags(edit_request.tags, session)

            offer.title = edit_request.title
            offer.description = edit_request.description
            offer.image_id = edit_request.image_id
            offer.date = edit_request.date
            offer.tags = tags

    return EditOfferDataResponse()


@offers_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def delete_offer(request: Request, delete_offer_request: DeleteOfferRequest, user_payload=Depends(hidden_user_payload)) -> DeleteOfferResponse:
    """
    Parameters
    ----------
    request : Request
        The request object that contains metadata about the request.
    delete_offer_request : DeleteOfferRequest
        The request payload containing details about the offer to be deleted.
    user_payload : dict, optional
        Contains user-related information extracted from the JWT token, including the user_id.

    Returns
    -------
    DeleteOfferResponse
        An object indicating the outcome of the delete operation.
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            offer = session.query(Offer).filter_by(id=delete_offer_request.offer_id).first()

            if offer is None:
                raise HTTPException(400, f'Offer with id {delete_offer_request.offer_id} does not exist')

            if offer.author_id != sender_id:
                raise HTTPException(400, f'Offer can be deleted only by its author')

            session.delete(offer)

        return DeleteOfferResponse()


@offers_router.put("/{offer_id}/vote", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def offer_vote(request: Request, offer_id: int, vote_request: OfferVoteRequest,
                        user_payload=Depends(hidden_user_payload)) -> AuthorizeOfferResponse:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    offer : int
        The unique identifier of the offer to vote on.
    vote_request : OfferVoteRequest
        The request body containing the user's vote.
    user_payload : dict, optional
        The payload containing user information extracted from the JWT token (default is None).

    Returns
    -------
    AuthorizeOfferResponse
        Response indicating the result of the voting action.

    Raises
    ------
    HTTPException
        If the incident with the specified ID does not exist.
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            offer = session.query(Offer).filter_by(id=offer_id).first()

            if offer is None:
                raise HTTPException(404, f'Offer with id {offer_id} does not exist')

            user_vote = session.query(OfferVoteDB).filter_by(offer_id=offer_id, user_id=sender_id).first()
            if user_vote is None:
                if vote_request.vote:
                    user_vote = OfferVoteDB(user_id=sender_id, offer_id=offer_id, vote=vote_request.vote)
                    session.add(user_vote)
            else:
                if vote_request.vote is None:
                    session.delete(user_vote)
                else:
                    user_vote.vote = vote_request.vote

        return AuthorizeOfferResponse()


@offers_router.get("/{offer_id}/vote", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_offer_vote(request: Request, offer_id: int, user_payload=Depends(hidden_user_payload)
                            ) -> OfferIsLiked:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    offer_id : int
        The unique identifier of the offer to vote on.
    user_payload : dict, optional
        The payload containing user information extracted from the JWT token (default is None).

    Returns
    -------
    AuthorizeOfferResponse
        Response indicating the result whether the offer is liked.

    Raises
    ------
    HTTPException
        If the offer with the specified ID does not exist.
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            offer = session.query(Offer).filter_by(id=offer_id).first()

            if offer is None:
                raise HTTPException(404, f'Offer with id {offer_id} does not exist')

            user_vote = session.query(OfferVoteDB).filter_by(offer_id=offer_id, user_id=sender_id).first()

            if user_vote is None:
                OfferIsLiked(is_liked=False)

            return OfferIsLiked(is_liked=user_vote.vote == 'like')
