from fastapi import Request, Query

from app.api_models.profile import ModifyProfileRequest, ModifyProfileResponse, ChangePasswordRequest, ChangePasswordResponse
from app.api_models.auth import UserResponse
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from datetime import datetime
from app.api.util import jwt_token_required, hidden_user_payload, get_password_hash, verify_password
from app.api_models.users import (GetUsersResponse, UserShortInfo)
import logging

from app.db_models.chats import User
from app.core.db import SessionLocal
from fastapi import HTTPException
from sqlalchemy import or_

from app.services.email_service import send_on_sensitive_data_changed

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
users_router = APIRouter()
logger = logging.getLogger(__name__)


@users_router.get("/users/{user_id}")
def get_user(request: Request, user_id: int, user_payload=Depends(hidden_user_payload)) -> UserResponse:
    """
    :param request: The current request being processed.
    :param user_id: The unique identifier of the user to be retrieved.
    :param user_payload: The payload containing information about the user, typically extracted from the JWT token.
    :return: A UserResponse object containing the user's details if found, otherwise raises an HTTPException if the user is not found.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise HTTPException(404, f"User with id {user_id} does not exist")
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
async def my_profile(request: Request, user_payload=Depends(hidden_user_payload)) -> UserResponse:
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


@users_router.post("/modify_my_profile/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def modify_profile(
    request: Request, profile_request: ModifyProfileRequest, user_payload=Depends(hidden_user_payload)
) -> ModifyProfileResponse:
    sender_id = user_payload.get("user_id")

    with SessionLocal() as session:
        with session.begin():

            user = session.query(User).filter_by(id=sender_id).first()
            sensetive_data_changed = False
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            if profile_request.email and profile_request.email != user.email:
                existing_user = (
                    session.query(User).filter_by(email=profile_request.email).first()
                )
                if existing_user:
                    raise HTTPException(status_code=409, detail="Email already in use")

                sensetive_data_changed |= True
                user.email = profile_request.email

            if profile_request.login and profile_request.login != user.login:
                existing_user = (
                    session.query(User).filter_by(login=profile_request.login).first()
                )
                if existing_user:
                    raise HTTPException(status_code=409, detail="Login already in use")
                
                sensetive_data_changed |= True
                user.login = profile_request.login


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
                
                sensetive_data_changed |= True
                user.phone_number = profile_request.phone_number

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

        if sensetive_data_changed:
            send_on_sensitive_data_changed(user.email, user.name)

        return ModifyProfileResponse()


@users_router.post("/change_password/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def change_password(
    request: Request, profile_request: ChangePasswordRequest, user_payload=Depends(hidden_user_payload)
) -> ChangePasswordResponse:
    """
    Change the password of the authenticated user.

    :param request: The current request being processed.
    :param profile_request: A ChangePasswordRequest object containing the new password.
    :return: A ChangePasswordResponse indicating that the profile was updated successfully.
    :raises HTTPException: If the user does not exist or there is an error during password change.
    """
    sender_id = user_payload.get("user_id")

    with SessionLocal() as session:
        with session.begin():

            user = session.query(User).filter_by(id=sender_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            if not verify_password(user.password_hashed, profile_request.old_password):
                raise HTTPException(status_code=400, detail="Incorrect password")
            user.password_hashed = get_password_hash(profile_request.new_password)

        return ChangePasswordResponse()


@users_router.get("/users", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_users(
    request: Request,
    ids: list[int] | None = Query(None),
    location_filter: str | None = Query(None),
    name_filter: str | None = Query(None),
    user_payload=Depends(hidden_user_payload)
) -> GetUsersResponse:

    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        query = session.query(User)

        # Filter by user ids if provided
        if ids:
            query = query.filter(User.id.in_(ids))

        # Apply location filter if provided
        if location_filter:
            query = query.filter(
                or_(
                User.current_address.ilike(f"%{location_filter}%"),
                User.permanent_address.ilike(f"%{location_filter}%")
                )
            )

        if name_filter:
            query = query.filter(User.name.ilike(f"%{name_filter}%"))

        users = query.all()

        # Convert the results into a list of `UserShortInfo`
        users_info = [
            UserShortInfo(
                id=user.id,
                name=user.name,
                image_id=user.image_id
            ) for user in users
        ]

        return GetUsersResponse(users_info=users_info)