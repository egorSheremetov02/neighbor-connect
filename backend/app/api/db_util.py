from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.db_models.chats import Tag, User, Chat, _chats_to_users_assoc_table
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


def get_or_create_dm_chat(session, user1: User, user2: User) -> Chat:
    """Retrieve an existing DM chat between two users or create a new one."""
    # Query for existing chat between the two users
    existing_chat = (
        session.query(Chat)
        .join(_chats_to_users_assoc_table, Chat.id == _chats_to_users_assoc_table.c.chat_id)
        .filter(_chats_to_users_assoc_table.c.user_id.in_([user1.id, user2.id]))
        .group_by(Chat.id)
        .having(func.count(func.distinct(_chats_to_users_assoc_table.c.user_id)) == 2)
        .first()
    )

    if existing_chat:
        return existing_chat
    else:
        # Create a new chat
        chat = Chat(
            name=f"Chat between {user1.name} and {user2.name}",
            users=[user1, user2],
            admins=[user1, user2],
            messages=[],
        )
        session.add(chat)
        session.flush()  # Ensure the chat ID is generated
        return chat
