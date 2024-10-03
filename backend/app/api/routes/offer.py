from fastapi import APIRouter, Depends, HTTPException, Request
from app.api_models.offer import (Offer as APIOffer, ListOffersResponse,
                                  CreateOfferRequest, CreateOfferResponse,
                                  DeleteOfferRequest, DeleteOfferResponse,
                                  EditOfferDataRequest, EditOfferDataResponse)

import logging, sqlalchemy

from app.db_models.chats import User
from app.db_models.offer import Offer
from app.core.db import SessionLocal
from app.api.util import validate_tags, jwt_token_required
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
offers_router = APIRouter()
logger = logging.getLogger(__name__)


@offers_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def create_offer(request: Request, create_offer_request: CreateOfferRequest, user_payload=None) -> CreateOfferResponse:
    """
    :param request: The request object representing the current API request.
    :type request: Request
    :param create_offer_request: The request body containing offer creation details such as title, description, price, product, and date.
    :type create_offer_request: CreateOfferRequest
    :param user_payload: User payload containing user-specific information extracted from the JWT. Defaults to None.
    :type user_payload: dict, optional
    :return: The response containing the ID of the newly created offer.
    :rtype: CreateOfferResponse
    """
    sender_id = user_payload['user_id']

    if len(create_offer_request.title) == 0:
        raise HTTPException(400, f'Offer title is missing')
    if len(create_offer_request.description) == 0:
        raise HTTPException(400, f'Offer description is missing')
    if create_offer_request.price <= 0:
        raise HTTPException(400, f'Offer price should be positive')

    with SessionLocal() as session:
        with session.begin():
            offer = Offer(title=create_offer_request.title, description=create_offer_request.description,
                          author_id=sender_id, price=create_offer_request.price, product=create_offer_request.product,
                          date=create_offer_request.date)
            session.add(offer)

        return CreateOfferResponse(offer_id=offer.id)


@offers_router.get("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def list_offers(request: Request, user_payload=None) -> ListOffersResponse:
    """
    :param request: The request object.
    :param user_payload: The payload containing user-specific data, typically decoded from a JWT token.
    :return: A ListOffersResponse object containing a list of offers.
    """
    sender_id = user_payload['user_id']
    print("SENDER ID: ", sender_id)
    with SessionLocal() as session:
        with session.begin():
            offers = session.query(Offer).all()

            def to_pydantic(offer: Offer) -> APIOffer:
                return APIOffer(
                    id=offer.id,
                    title=offer.title,
                    description=offer.description,
                    author_id=offer.author_id,
                    price=offer.price,
                    product=offer.product,
                    date=offer.date,
                    image_id=offer.image_id
                )

            return ListOffersResponse(offers=[to_pydantic(offer) for offer in offers], next_page_id=None)


@offers_router.put("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def edit_offer_data(request: Request, edit_offer_data_request: EditOfferDataRequest,
                    user_payload=None) -> EditOfferDataResponse:
    """
    :param request: The current request instance containing request data.
    :param edit_offer_data_request: An instance of EditOfferDataRequest containing the offer details to be edited.
    :param user_payload: The payload extracted from the user's JWT token, containing user-specific information.
    :return: An instance of EditOfferDataResponse indicating the result of the offer edit operation.
    """
    sender_id = user_payload['user_id']

    if len(edit_offer_data_request.title) == 0:
        raise HTTPException(400, f'Offer title is missing')
    if len(edit_offer_data_request.description) == 0:
        raise HTTPException(400, f'Offer description is missing')
    if edit_offer_data_request.price <= 0:
        raise HTTPException(400, f'Offer price should be positive')

    with SessionLocal() as session:
        with session.begin():
            offer = session.query(Offer).filter_by(id=edit_offer_data_request.offer_id).first()
            if offer is None:
                raise HTTPException(400, f'Offer with id {edit_offer_data_request.offer_id} does not exist')

            if offer.author_id != sender_id:
                raise HTTPException(400, f'Offer can be edited only by its author')

            offer.title = edit_offer_data_request.title
            offer.description = edit_offer_data_request.description
            offer.price = edit_offer_data_request.price
            offer.product = edit_offer_data_request.product
            offer.date = edit_offer_data_request.date

        return EditOfferDataResponse()


@offers_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def delete_offer(request: Request, delete_offer_request: DeleteOfferRequest, user_payload=None) -> DeleteOfferResponse:
    """
    :param request: The incoming HTTP request.
    :param delete_offer_request: The request object containing information necessary to delete an offer, such as offer_id.
    :param user_payload: The payload object from the JWT token containing user-specific information, such as user_id.
    :return: A response object indicating the successful deletion of the offer.
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
