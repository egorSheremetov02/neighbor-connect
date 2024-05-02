from fastapi import APIRouter

from app.api_models.auth import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, UserResponse

import logging

from app.db_models.chats import User
from app.core.db import SessionLocal
from fastapi import HTTPException

from app.api.util import get_password_hash, verify_password, create_jwt

auth_router = APIRouter()
logger = logging.getLogger(__name__)


@auth_router.post("/register")
def register(request: RegisterRequest) -> RegisterResponse:
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(email=request.email).first()
            if user:
                raise HTTPException(409, f'User with email {request.email} already exists')
            user = session.query(User).filter_by(login=request.login).first()
            if user:
                raise HTTPException(409, f'User with login {request.login} already exists')

            if len(request.fullName) > 255:
                raise HTTPException(400, f'Full name is too long')

            if len(request.password) < 8:
                raise HTTPException(400, f'Password is too short')

            user = User(name=request.fullName, email=request.email, password_hashed=get_password_hash(request.password),
                        login=request.login, address=request.address, birthday=request.birthday,
                        additional_info=request.additionalInfo)
            session.add(user)
            session.commit()

            return RegisterResponse()


@auth_router.post("/login")
def login(request: LoginRequest) -> LoginResponse:
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(login=request.login).first()
            if not user:
                raise HTTPException(404, f'User with credentials does not exist')

            if not verify_password(user.password_hashed, request.password):
                raise HTTPException(400, f'Incorrect password')

            token = create_jwt(user.id)

            return LoginResponse(token=token)


@auth_router.get("/users/{user_id}")
def get_user(user_id: int) -> UserResponse:
    with SessionLocal() as session:
        with session.begin():
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise HTTPException(404, f'User with id {user_id} does not exist')

            return UserResponse(id=user.id, fullName=user.name, email=user.email, address=user.address)
