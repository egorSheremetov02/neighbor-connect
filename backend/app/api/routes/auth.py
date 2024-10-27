from dataclasses import Field

from fastapi import Query, Request

from app.api_models.auth import (
    RegisterRequest,
    RegisterResponse,
    UserResponse,
    UsersResponse, LoginSuccessResponse, Auth2Fa, LoginRequired2FaCodeResponse
    UsersResponse, LoginResponse,
    ForgetPasswordRequest, ForgetPasswordResponse,
    ChangePasswordWithCodeRequest, ChangePasswordWithCodeResponse
)
from fastapi import APIRouter, Response, Depends

from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    APIKeyHeader,
)
import datetime

from app.api.util import generate_email_code


import logging

from app.db_models.chats import User
from app.core.db import SessionLocal
from fastapi import HTTPException

from app.services.email_service import send_on_login_email, send_on_registration_email, send_reset_code_to_email
from app.api.util import (
    get_password_hash,
    verify_password,
    create_jwt,
    jwt_token_required,
    hidden_user_payload,
    verify_2fa_auth_code
)
from sqlalchemy import select

logger = logging.getLogger(__name__)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
auth_router = APIRouter()


@auth_router.post("/register")
async def register(request: RegisterRequest) -> RegisterResponse:
    """
    :param request: The registration request object containing user details such as email, login, full name, password, address, birthday, and additional information.
    :return: The response object indicating successful registration or raises an HTTPException with appropriate error messages if registration fails.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(email=request.email).first()
            if user:
                raise HTTPException(
                    409, f"User with email {request.email} already exists"
                )
            user = session.query(User).filter_by(login=request.login).first()
            if user:
                raise HTTPException(
                    409, f"User with login {request.login} already exists"
                )

            if len(request.fullName) > 255:
                raise HTTPException(400, f"Full name is too long")

            if len(request.password) < 6:
                raise HTTPException(400, f"Password is too short")

            user = User(
                name=request.fullName,
                email=request.email,
                login=request.login,
                permanent_address=request.permanent_address,
                password_hashed=get_password_hash(request.password),
                birthday=None,
                bio_header=None,
                bio_description=None,
                interests=[],
                is_active=True,
                member_since=datetime.datetime.now(),
            )
            session.add(user)

        send_on_registration_email(user.email, user.name)

        return RegisterResponse(user_id=user.id)


@auth_router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_2fa_code: str | None = Query(None),
    response: Response = None
) -> LoginSuccessResponse | LoginRequired2FaCodeResponse:
    """
    :param form_data: OAuth2 password request form containing the username and password.
    :param response: Optional response object for setting cookies.
    :return: LoginResponse object containing the access token, token type, and user ID.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(email=form_data.username).first()
            if not user:
                raise HTTPException(404, "User with credentials does not exist")

            if not verify_password(user.password_hashed, form_data.password):
                raise HTTPException(400, "Incorrect password")


            code = auth_2fa_code
            result = verify_2fa_auth_code(user.id, session, code)

            if result is False: # need valid code
                return LoginRequired2FaCodeResponse()
            elif result is True or result is None: # success
                send_on_login_email(user.email, user.name)

                jwt_token = create_jwt(user.id)
                response.set_cookie(key="access_token", value=jwt_token, httponly=True)
                return LoginSuccessResponse(access_token=jwt_token, token_type="bearer", user_id=user.id)



@auth_router.get("/users/{user_id}")
@jwt_token_required
async def get_user(request: Request, user_id: int, user_payload=Depends(hidden_user_payload)) -> UserResponse:
    """
    :param request: The current request being processed.
    :param user_id: The unique identifier of the user to be retrieved.
    :param user_payload: The payload containing information about the user, typically extracted from the JWT token.
    :return: A UserResponse object containing the user's details if found, otherwise raises an HTTPException if the user is not found.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.get(User, user_id)
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


@auth_router.get("/users", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_many_users(
    request: Request, ids: list[int] = Query(...), user_payload=Depends(hidden_user_payload)
) -> UsersResponse:
    with SessionLocal.begin() as session:
        result = session.scalars(select(User).where(User.id.in_(ids))).all()
        users = [
            UserResponse(
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
            for user in result
        ]
        return UsersResponse(users=users)

@auth_router.post("/forget_password")
async def forget_password(request: ForgetPasswordRequest) -> ForgetPasswordResponse:
    """
    Send a password reset code to the user's registered email.

    :param request: The ForgetPasswordRequest object containing the user's login information.
    :return: A ForgetPasswordResponse indicating the email was successfully sent.
    :raises HTTPException: If the user does not exist or if an error occurs while generating or sending the code.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(login=request.login).first()
            if not user:
                raise HTTPException(404, f"User with login {request.login} does not exist")
            email_code = generate_email_code()

            user.email_code = email_code
            user.email_code_expiry = datetime.datetime.now() + datetime.timedelta(hours=1)

            send_reset_code_to_email(user.email, user.name, user.email_code)

        return ForgetPasswordResponse()


@auth_router.post("/change_password_with_code")
async def change_password_with_code(request: ChangePasswordWithCodeRequest) -> ChangePasswordWithCodeResponse:
    """
    :param request: The change password with code request object containing user login, code, sent to user's email and new password.
    :return: The response object indicating successful password change or raises an HTTPException with appropriate error messages if password change fails.
    """
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(login=request.login).first()
            if not user:
                raise HTTPException(404, "User with credentials does not exist")

            if not user.email_code == request.code:
                raise HTTPException(400, "Incorrect code")

            if user.email_code_expiry < datetime.datetime.now():
                raise HTTPException(400, "Code is expired")

            user.password_hashed = get_password_hash(request.new_password)

        return ChangePasswordWithCodeResponse()