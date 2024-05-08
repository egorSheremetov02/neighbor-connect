# from fastapi import APIRouter, Depends, HTTPException
# from app.api_models.offer import (Offer as APIOffer, ListOffersResponse,
#                                     CreateOfferRequest, CreateOfferResponse,
#                                     DeleteOfferRequest, DeleteOfferResponse,
#                                     EditOfferDataRequest, EditOfferDataResponse)
#
# import logging, sqlalchemy
#
# from app.db_models.chats import User
# from app.db_models.incidents import Incident
# from app.core.db import SessionLocal
# from app.api.util import get_current_user_id, validate_tags, check_user_account_status, jwt_token_required
# from fastapi import HTTPException
#
# offers_router = APIRouter()
# logger = logging.getLogger(__name__)
#
# @offers_router.post("/")
# @jwt_token_required
# def create_offer(request: CreateOfferRequest) -> CreateOfferResponse:
#     sender_id = get_current_user_id()
#
#