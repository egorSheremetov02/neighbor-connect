from pydantic import BaseModel, Field
from datetime import datetime


class RegisterRequest(BaseModel):
    """
    Class representing a user registration request.

    Attributes:
        fullName (str): The full name of the user.
        email (str): The email address of the user.
        login (str): The login username of the user.
        password (str): The login password of the user.
        permanent_address (str): The physical address of the user.
    """

    fullName: str
    email: str
    login: str
    password: str
    permanent_address: str


class RegisterResponse(BaseModel):
    user_id: int


class LoginRequest(BaseModel):
    """
    A class representing a login request.

    Attributes
    ----------
    login : str
        The username or email used for login.
    password : str
        The password associated with the login.
    """

    login: str
    password: str


class LoginResponse(BaseModel):
    """
    Class representing the response obtained after a successful login process.

    Attributes:
        token (str): A string containing the authentication token.
    """

    token: str


class UserResponse(BaseModel):
    id: int

    fullName: str
    permanent_address: str
    email: str
    login: str
    member_since: datetime
    is_active: bool

    gender: str | None = Field(None)
    phone_number: str | None = Field(None)
    current_address: str | None = Field(None)
    birthday: datetime | None = Field(None)
    bio_header: str | None = Field(None)
    bio_description: str | None = Field(None)
    interests: list[str]


class UsersResponse(BaseModel):
    users: list[UserResponse]
