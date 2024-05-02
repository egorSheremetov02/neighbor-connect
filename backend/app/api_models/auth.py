from pydantic import BaseModel
from datetime import datetime


class RegisterRequest(BaseModel):
    fullName: str
    email: str
    login: str
    password: str
    address: str
    birthday: datetime | None = None
    additionalInfo: str | None = None


class RegisterResponse(BaseModel):
    pass


class LoginRequest(BaseModel):
    login: str
    password: str


class LoginResponse(BaseModel):
    token: str


class UserResponse(BaseModel):
    id: int
    fullName: str
    email: str
    address: str
