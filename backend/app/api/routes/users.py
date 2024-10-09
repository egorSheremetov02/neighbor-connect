from fastapi import Request

from app.api_models.profile import ModifyProfileRequest, ModifyProfileResponse
from app.api_models.auth import UserResponse
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from datetime import datetime
from app.api.util import jwt_token_required

import logging

from app.db_models.chats import User
from app.core.db import SessionLocal
from fastapi import HTTPException

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
users_router = APIRouter()
logger = logging.getLogger(__name__)


@users_router.get("/users/{username}")
def get_user(request: Request, username: str, user_payload=None) -> UserResponse:
    """
    :param request: The current request being processed.
    :param user_id: The unique identifier of the user to be retrieved.
    :param user_payload: The payload containing information about the user, typically extracted from the JWT token.
    :return: A UserResponse object containing the user's details if found, otherwise raises an HTTPException if the user is not found.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(login=username).first()
            if not user:
                raise HTTPException(404, f"User with login {username} does not exist")
            return UserResponse(
                id=user.id,
                fullName=user.name,
                gender=user.gender,
                phone_number=user.phone_number,
                current_address=user.current_address,
                permanent_address=user.permanent_address,
                email=user.email,
                login=user.login,
                member_since=user.member_since,
                is_active=user.is_active,
                bio_header=user.bio_header,
                bio_description=user.bio_description,
                interests=user.interests,
                birthday=user.birthday,
            )


@users_router.get("/my_profile/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def my_profile(request: Request, user_payload=None) -> UserResponse:
    with SessionLocal() as session:
        with session.begin():
            current_user_id = user_payload.get("user_id")
            user = session.query(User).filter_by(id=current_user_id).first()
            return UserResponse(
                id=user.id,
                fullName=user.name,
                gender=user.gender,
                phone_number=user.phone_number,
                current_address=user.current_address,
                permanent_address=user.permanent_address,
                email=user.email,
                login=user.login,
                member_since=user.member_since,
                is_active=user.is_active,
                bio_header=user.bio_header,
                bio_description=user.bio_description,
                interests=user.interests,
                birthday=user.birthday,
            )


@users_router.post("/modify_profile/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def modify_profile(
    request: Request, profile_request: ModifyProfileRequest, user_payload=None
) -> ModifyProfileResponse:
    with SessionLocal() as session:
        with session.begin():
            current_user_id = user_payload.get("user_id")
            print(current_user_id)

            user = session.query(User).filter_by(id=current_user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            if profile_request.email and profile_request.email != user.email:
                existing_user = (
                    session.query(User).filter_by(email=profile_request.email).first()
                )
                if existing_user:
                    raise HTTPException(status_code=409, detail="Email already in use")

            if profile_request.login and profile_request.login != user.login:
                existing_user = (
                    session.query(User).filter_by(login=profile_request.login).first()
                )
                if existing_user:
                    raise HTTPException(status_code=409, detail="Login already in use")

            if (
                profile_request.phone_number
                and profile_request.phone_number != user.phone_number
            ):
                existing_user = (
                    session.query(User)
                    .filter_by(phone_number=profile_request.phone_number)
                    .first()
                )
                if existing_user:
                    raise HTTPException(
                        status_code=409, detail="Phone number already in use"
                    )

            user.name = profile_request.fullName or user.name
            user.email = profile_request.email or user.email
            user.login = profile_request.login or user.login
            user.permanent_address = (
                profile_request.permanent_address or user.permanent_address
            )
            user.current_address = (
                profile_request.current_address or user.current_address
            )
            user.gender = profile_request.gender or user.gender
            user.phone_number = profile_request.phone_number or user.phone_number
            user.birthday = profile_request.birthday or user.birthday
            user.bio_header = profile_request.bio_header or user.bio_header
            user.bio_description = (
                profile_request.bio_description or user.bio_description
            )
            user.interests = profile_request.interests or user.interests

            session.commit()

            return ModifyProfileResponse()
