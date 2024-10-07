

from app.db_models.chats import Tag, User, Chat
from fastapi import HTTPException


def get_or_create_tag(session, tag_name: str) -> Tag:
    tag_object = session.query(Tag).filter_by(name=tag_name).first()
    if not tag_object:
        tag_object = Tag(name=tag_name)
        session.add(tag_object)
    return tag_object
        

def get_user(session, user_id: int) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(404, f"User with id {user_id} not found")
    return user
