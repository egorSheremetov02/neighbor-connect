import re
from fastapi import HTTPException, Request

from app.api.constants import MAX_CHAT_NAME_LENGTH, MAX_TAGS_AMOUNT, MAX_CHAT_DESCRIPTION_LENGTH
from app.core.db import SessionLocal
from app.db_models.chats import User, Image
import bcrypt
import jwt
import datetime
from functools import wraps
from typing import Callable
from starlette.types import ASGIApp


MAX_TAG_LENGTH = 64
SECRET = 'e8b7e8b7e8b7e8b7e8b7e8b7e8b7e8b7'


# TODO: move to .env

def validate_chat_request(request):
    if len(request.name) == 0 or len(request.name) > MAX_CHAT_NAME_LENGTH:
        raise HTTPException(400, f'Name length of chat should be in range [1 .. {MAX_CHAT_NAME_LENGTH}]')
    if len(request.description) == 0 or len(request.description) > MAX_CHAT_DESCRIPTION_LENGTH:
        raise HTTPException(400, f'Description length of chat should be in range [1 .. {MAX_CHAT_DESCRIPTION_LENGTH}]')
    if len(request.tags) >= MAX_TAGS_AMOUNT:
        raise HTTPException(400, f'Amount of tags should not exceed {MAX_TAGS_AMOUNT}')


def validate_tags(tags: list[str]) -> None:
    for tag in tags:
        if len(tag) == 0 or len(tag) > MAX_TAG_LENGTH:
            raise HTTPException(400, f'Length of tag \'{tag}\' should be in range [1 .. {MAX_TAG_LENGTH}]')
        if re.fullmatch('[a-zA-Z][a-zA-Z0-9\\-]*[a-zA-Z0-9]', tag) is None:
            raise HTTPException(400, f'Tag \'{tag}\' does not match the format')


def check_image_exists(image_id: int) -> None:
    with SessionLocal() as session:
        with session.begin():
            image = session.query(Image).filter_by(id=image_id).first()
            if image is None:
                raise HTTPException(400, f'Image is not uploaded to images storage')


def create_jwt(user_id):
    current_time = datetime.datetime.now(datetime.timezone.utc)

    payload = {
        'user_id': user_id,
        'iat': current_time,
        'exp': current_time + datetime.timedelta(days=7)
    }

    token = jwt.encode(payload, SECRET, algorithm='HS256')
    return token


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode('utf-8')


def verify_password(stored_hash: str, provided_password: str) -> bool:
    return bcrypt.checkpw(provided_password.encode(), stored_hash.encode())


def jwt_token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        request: Request = kwargs.get('request')
        if not request:
            raise HTTPException(status_code=401, detail="Request object not found.")

        token = request.cookies.get("access_token")
        if not token:
            try:
                authorization = request.headers['Authorization']
                token = authorization.split()[0]
            except KeyError:
                raise HTTPException(status_code=401, detail="Authorization header not found")

        try:
            payload = jwt.decode(token, SECRET, algorithms=["HS256"])
            kwargs['user_payload'] = payload
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as _:
            raise HTTPException(status_code=403, detail="Invalid token")

        # Check that user with such id exists
        user_id = payload['user_id']
        with SessionLocal() as session:
            with session.begin():
                user = session.query(User).filter_by(id=user_id).first()
                if user is None:
                    raise HTTPException(403, f'User is not logged in / does not exist')

        return f(*args, **kwargs)

    return decorated_function
