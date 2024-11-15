from fastapi import APIRouter, Depends, HTTPException, Request

import logging, sqlalchemy
from sqlalchemy import func, select, and_
import pyotp
from app.core.db import SessionLocal
from app.api.util import (
    jwt_token_required,
    hidden_user_payload,
    get_2fa_totp
)

from app.api_models.auth_2fa import Generate2FaRequest, Generate2FaResponse, Confirm2FaGenerationRequest, \
    Confirm2FaGenerationResponse, Gen2FaStatus, Get2FaStateResponse, Gen2FaState
from app.db_models.auth_2fa import Auth2FactorSecret, Auth2FactorSecretState
from app.db_models.chats import User

import app.api.db_util as db_util
from fastapi import HTTPException
from fastapi.security import APIKeyHeader
from enum import Enum

auth_2fa_router = APIRouter()
logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")


@auth_2fa_router.post("/state",
                      dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_state_2fa(request: Request,
                            user_payload=Depends(hidden_user_payload)) -> Get2FaStateResponse:

    sender_id = user_payload["user_id"]
    with (SessionLocal() as session):
        with session.begin():
            auth_2fa_secret = session.query(Auth2FactorSecret).filter_by(
                user_id=sender_id,
                state=Auth2FactorSecretState.CONFIRMED
            ).first()

            if auth_2fa_secret is None:
                return Get2FaStateResponse(state=Gen2FaState.EMPTY)

        return Get2FaStateResponse(state=Gen2FaState.CREATED)


@auth_2fa_router.post("/generate", summary="Generate 2-Factor Authentication Code",
                      dependencies=[Depends(security_scheme)])
@jwt_token_required
async def generate_2fa_code(request: Request, generate_2fa_request: Generate2FaRequest = None,
                            user_payload=Depends(hidden_user_payload)) -> Generate2FaResponse:
    """
    :param request: The current HTTP request object.
    :param generate_2fa_request: Request containing information required to generate a 2FA code, validated from the incoming request body.
    :param user_payload: Dependency injected information about the authenticated user.
    :return: A response object containing the provisioning URI for setting up 2FA.
    """
    sender_id = user_payload["user_id"]
    with (SessionLocal() as session):
        with session.begin():
            auth_2fa_secret = session.query(Auth2FactorSecret).filter_by(
                user_id=sender_id).first()

            if auth_2fa_secret is not None and auth_2fa_secret.state == Auth2FactorSecretState.CONFIRMED:
                raise HTTPException(status_code=409, detail="2Fa Auth Secret is already created and confirmed")

            auth_2fa_secret = auth_2fa_secret or Auth2FactorSecret(
                secret_key=pyotp.random_base32(),
                user_id=sender_id,
                state=Auth2FactorSecretState.PENDING)
            session.add(auth_2fa_secret)
            user = session.query(User).filter_by(id=sender_id).first()

            uri = get_2fa_totp(auth_2fa_secret.secret_key).provisioning_uri(
                name=user.email,
                issuer_name='Neighbor Connect',
            )

        return Generate2FaResponse(provisioning_uri=uri)


@auth_2fa_router.post("/confirm_2fa_generation", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def confirm_2fa_gen(request: Request, confirm_2fa_generation_request: Confirm2FaGenerationRequest,
                          user_payload=Depends(hidden_user_payload)) -> Confirm2FaGenerationResponse:
    """
    :param request: The request object containing HTTP request information.
    :param confirm_2fa_generation_request: Instance of Confirm2FaGenerationRequest containing the 2FA confirmation code.
    :param user_payload: Dictionary containing user's payload data. This is injected via dependency.
    :return: Instance of Confirm2FaGenerationResponse indicating the status of the 2FA confirmation process.
    """
    sender_id = user_payload["user_id"]

    with SessionLocal() as session:
        with session.begin():
            auth_2fa_secret = session.query(Auth2FactorSecret).filter_by(user_id=sender_id).first()
            if auth_2fa_secret is None:
                raise HTTPException(status_code=409, detail="2Fa Auth Secret is not exist")

            if auth_2fa_secret.state == Auth2FactorSecretState.CONFIRMED:
                raise HTTPException(status_code=409, detail="2Fa Auth Secret is already confirmed")

            code = confirm_2fa_generation_request.code.strip()
            if len(code) != 6 or not code.isdigit():
                raise HTTPException(status_code=400, detail="Code must be 6 digits in length")

            totp = get_2fa_totp(auth_2fa_secret.secret_key)
            result = totp.verify(code)

            if result is False:
                return Confirm2FaGenerationResponse(status=Gen2FaStatus.OUTDATED)
            else:
                auth_2fa_secret.state = Auth2FactorSecretState.CONFIRMED
                return Confirm2FaGenerationResponse(status=Gen2FaStatus.SUCCESS)



@auth_2fa_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def delete_2fa_auth(request: Request, user_payload=Depends(hidden_user_payload)):
    """
    :param request: The HTTP request object.
    :param user_payload: The payload retrieved from the JWT token, containing user-specific information.
    :return: None
    """
    sender_id = user_payload["user_id"]

    with SessionLocal() as session:
        with session.begin():
            auth_2fa_secret = session.query(Auth2FactorSecret).filter_by(user_id=sender_id).first()
            if auth_2fa_secret is None:
                raise HTTPException(status_code=409, detail="2Fa Auth Secret does not exist")

            session.delete(auth_2fa_secret)
