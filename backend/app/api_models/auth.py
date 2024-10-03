from pydantic import BaseModel
from datetime import datetime


class RegisterRequest(BaseModel):
    """
    Class representing a user registration request.

    Attributes:
        fullName (str): The full name of the user.
        email (str): The email address of the user.
        login (str): The login username of the user.
        password (str): The login password of the user.
        address (str): The physical address of the user.
        birthday (datetime | None, optional): The birthday of the user. Defaults to None.
        additionalInfo (str | None, optional): Any additional information provided by the user. Defaults to None.
    """
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
    """
        Class representing a user response object.

        Attributes
        ----------
        id : int
            Unique identifier for the user.
        fullName : str
            Full name of the user.
        email : str
            Email address of the user.
        address : str
            Home address of the user.
    """
    id: int
    fullName: str
    email: str
    address: str
