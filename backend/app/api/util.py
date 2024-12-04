import re
from fastapi import HTTPException, Request

from app.api.constants import (
    MAX_CHAT_NAME_LENGTH,
    MAX_INVITED_USERS,
    MAX_TAGS_AMOUNT,
    MAX_CHAT_DESCRIPTION_LENGTH,
)
from app.core.db import SessionLocal
from app.db_models.chats import User
from app.db_models.image_storage import Image
from app.db_models.auth_2fa import Auth2FactorSecret, Auth2FactorSecretState


import bcrypt
import jwt
import datetime
import string
import secrets
from functools import wraps
from typing import Callable
from pydantic import BaseModel
from starlette.types import ASGIApp
import pyotp

MAX_TAG_LENGTH = 64
SECRET = "e8b7e8b7e8b7e8b7e8b7e8b7e8b7e8b7"


# TODO: move to .env


def validate_chat_request(request):
    """
    :param request: The chat creation request object containing name, description, and tags of the chat.
    :return: None
    :raises HTTPException: If the name length exceeds the allowed range, the description length exceeds the allowed range, or the amount of tags exceeds the maximum limit.
    """
    if len(request.name) == 0 or len(request.name) > MAX_CHAT_NAME_LENGTH:
        raise HTTPException(
            400, f"Name length of chat should be in range [1 .. {MAX_CHAT_NAME_LENGTH}]"
        )
    if (
        len(request.description) == 0
        or len(request.description) > MAX_CHAT_DESCRIPTION_LENGTH
    ):
        raise HTTPException(
            400,
            f"Description length of chat should be in range [1 .. {MAX_CHAT_DESCRIPTION_LENGTH}]",
        )
    if len(request.tags) >= MAX_TAGS_AMOUNT:
        raise HTTPException(400, f"Amount of tags should not exceed {MAX_TAGS_AMOUNT}")
    if len(request.users) == 0 or len(request.users) > MAX_INVITED_USERS:
        raise HTTPException(
            400,
            f"Number of users in chat should be in range [1 .. {MAX_INVITED_USERS}]",
        )


def validate_tags(tags: list[str]) -> None:
    """
    :param tags: List of tags to be validated. Each tag should be a non-empty string with a length not exceeding MAX_TAG_LENGTH. Tags must follow the format specified by the regular expression '[a-zA-Z][a-zA-Z0-9\\-]*[a-zA-Z0-9]'.
    :return: None. Raises HTTPException if any tag is invalid.
    """
    for tag in tags:
        if len(tag) == 0 or len(tag) > MAX_TAG_LENGTH:
            raise HTTPException(
                400, f"Length of tag '{tag}' should be in range [1 .. {MAX_TAG_LENGTH}]"
            )
        if re.fullmatch("[a-zA-Z][a-zA-Z0-9\\-]*[a-zA-Z0-9]", tag) is None:
            raise HTTPException(400, f"Tag '{tag}' does not match the format")


def check_image_exists(image_id: int) -> None:
    """
    :param image_id: The unique identifier of the image to check in the database.
    :return: Raises an HTTPException if the image does not exist in the database.
    """
    with SessionLocal() as session:
        with session.begin():
            image = session.query(Image).filter_by(id=image_id).first()
            if image is None:
                raise HTTPException(400, f"Image is not uploaded to images storage")


def create_jwt(user_id):
    """
    :param user_id: Unique identifier of the user for whom the JWT is being created
    :return: A JWT token encoded with the user's information, time of issuance, and expiration date set to 7 days from issuance.
    """
    current_time = datetime.datetime.now(datetime.timezone.utc)

    payload = {
        "user_id": user_id,
        "iat": current_time,
        "exp": current_time + datetime.timedelta(days=7),
    }

    token = jwt.encode(payload, SECRET, algorithm="HS256")
    return token


def get_password_hash(password: str) -> str:
    """
    :param password: The plain text password that needs to be hashed.
    :return: A hashed version of the provided password encoded in utf-8.
    """
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode("utf-8")


def verify_password(stored_hash: str, provided_password: str) -> bool:
    """
    :param stored_hash: The hashed password stored in the database.
    :param provided_password: The plaintext password provided by the user.
    :return: True if the provided password matches the stored hash, False otherwise.
    """
    return bcrypt.checkpw(provided_password.encode(), stored_hash.encode())


# HACK HOW TO HIDE userpayload
def hidden_user_payload():
    return None


def jwt_token_required(f):
    """
    :param f: Function to be decorated.
    :return: Decorated function which checks for a valid JWT token in cookies or headers, decodes it,
             reads user information and appends it to keyword arguments. If the token is invalid
             or the user does not exist, raises an HTTPException.
    """

    @wraps(f)
    async def decorated_function(*args, **kwargs):
        request: Request = kwargs.get("request")
        if not request:
            raise HTTPException(status_code=401, detail="Request object not found.")

        token = request.cookies.get("access_token")
        if not token:
            try:
                authorization = request.headers["Authorization"]
                # print(authorization)
                # HERE MUST BE 1 (!!!)
                token = authorization.split()[1]
            except KeyError:
                raise HTTPException(
                    status_code=401, detail="Authorization header not found"
                )

        try:
            payload = jwt.decode(token, SECRET, algorithms=["HS256"])
            kwargs["user_payload"] = payload
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as _:
            raise HTTPException(status_code=403, detail="Invalid token")

        # Check that user with such id exists
        user_id = payload["user_id"]
        with SessionLocal() as session:
            with session.begin():
                user = session.query(User).filter_by(id=user_id).first()
                if user is None:
                    raise HTTPException(403, f"User is not logged in / does not exist")

        return await f(*args, **kwargs)

    return decorated_function

def generate_email_code(length=8):
    characters = string.ascii_letters + string.digits
    email_code = ''.join(secrets.choice(characters) for i in range(length))
    return email_code

def get_2fa_totp(secret_key: str) -> pyotp.totp.TOTP:
    return pyotp.totp.TOTP(secret_key, interval=60)


def verify_2fa_auth_code(user_id: int, session, code: str | None = None) -> bool | None:
        auth_2fa_secret = session.query(Auth2FactorSecret).filter_by(user_id=user_id, state=Auth2FactorSecretState.CONFIRMED).first()
        if auth_2fa_secret is None:
            return None

        if code is None:
            return False

        code = code.strip()
        if len(code) != 6 or not code.isdigit():
            return False

        totp = get_2fa_totp(auth_2fa_secret.secret_key)
        return totp.verify(code)
