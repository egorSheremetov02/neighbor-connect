from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import asc, and_, or_
from typing import List, Optional

from app.api_models.offer import (Offer as API_Offer, ListOffersResponse,
                                  CreateOfferRequest, CreateOfferResponse,
                                  DeleteOfferRequest, DeleteOfferResponse,
                                  EditOfferDataRequest, EditOfferDataResponse)

import logging, sqlalchemy
from sqlalchemy import select

from app.db_models.offer import Offer, OfferTag
from app.core.db import SessionLocal
from app.api.util import jwt_token_required
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
offers_router = APIRouter()
logger = logging.getLogger(__name__)


@offers_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def create_offer(request: Request, create_offer_request: CreateOfferRequest, user_payload=None) -> CreateOfferResponse:
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
            all_tags = validate_and_get_offers_tags(create_offer_request.tags, session)

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
                tags: Optional[List[str]] = Query(None, alias='tag'), user_payload=None) -> ListOffersResponse:
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
                    user_payload=None) -> EditOfferDataResponse:
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
async def delete_offer(request: Request, delete_offer_request: DeleteOfferRequest, user_payload=None) -> DeleteOfferResponse:
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
