from fastapi import APIRouter, Depends, HTTPException

from app.api.constants import MAX_INVITED_USERS
from app.api_models.chats import (CreateChatRequest, CreateChatResponse,
                                  EditChatDataRequest, EditChatDataResponse,
                                  DeleteChatRequest, DeleteChatResponse,
                                  SendMessageRequest, SendMessageResponse,
                                  Message as APIMessage, ListMessagesResponse)
import logging, sqlalchemy

from app.db_models.chats import Chat, Tag, User, Message
from app.core.db import SessionLocal
from app.api.util import get_current_user_id, validate_tags, check_user_account_status, check_image_exists, \
    validate_chat_request, jwt_token_required
from fastapi import HTTPException

chats_router = APIRouter()
logger = logging.getLogger(__name__)


@chats_router.post("/")
@jwt_token_required
def create_chat(request: CreateChatRequest) -> CreateChatResponse:
    sender_id = get_current_user_id()

    check_user_account_status(sender_id)
    validate_chat_request(request)
    validate_tags(request.tags)

    if sender_id not in request.users:
        raise HTTPException(400, f"List of users does not contain creator's id")

    if len(request.users) > MAX_INVITED_USERS:
        raise HTTPException(400, f"Amount of invited users should not exceed {MAX_INVITED_USERS}")

    if request.image_id is not None:
        check_image_exists(request.image_id)

    with SessionLocal() as session:
        with session.begin():
            sender = session.query(User).filter_by(id=sender_id).first()

            if sender is None:
                raise HTTPException(400, f'User with id {sender_id} does not exist')

            tags = []
            for tag in set(request.tags):
                tag_object = session.query(Tag).filter_by(name=tag).first()
                if not tag_object:
                    tag_object = Tag(name=tag)
                    session.add(tag_object)
                tags.append(tag_object)

            chat = Chat(name=request.name,
                        description=request.description,
                        tags=tags,
                        image_id=request.image_id,
                        admins=[sender])

            users = session.query(User).filter(User.id.in_(request.users)).all()
            chat.users = [user for user in users]
            session.add(chat)

        if len(users) != len(request.users):
            fake_users = list(set(request.users) - set(map(lambda u: u.id, users)))
            logger.warning(
                f'User {sender_id} tried create chat with non-existing users {fake_users}, chat_id: {chat.id}')

        return CreateChatResponse(chat_id=chat.id)


@chats_router.put("/")
@jwt_token_required
def edit_chat_data(request: EditChatDataRequest) -> EditChatDataResponse:
    sender_id = get_current_user_id()

    check_user_account_status(sender_id)
    validate_chat_request(request)
    validate_tags(request.tags)

    if request.image_id is not None:
        check_image_exists(request.image_id)

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=request.chat_id).first()

            if not chat:
                raise HTTPException(400, f'Chat with id {request.chat_id} does not exist')

            if sender_id not in [admin.id for admin in chat.admins]:
                raise HTTPException(403, f'User {sender_id} does not have permission to edit this chat')

            tags = []
            for tag in set(request.tags):
                tag_object = session.query(Tag).filter_by(name=tag).first()
                if not tag_object:
                    tag_object = Tag(name=tag)
                    session.add(tag_object)
                tags.append(tag_object)

            chat.name = request.name
            chat.description = request.description
            chat.tags = tags
            chat.image_id = request.image_id

            users = session.query(User).filter(User.id.in_(request.users)).all()
            chat.users = [user for user in users]

            admins = session.query(User).filter(User.id.in_(request.admin_users)).all()
            chat.admins = [user for user in admins]

        if len(users) != len(request.users):
            fake_users = list(set(request.users) - set(map(lambda u: u.id, users)))
            logger.warning(
                f'User {sender_id} tried edit chat with non-existing users {fake_users}, chat_id: {chat.id}'
            )

        return EditChatDataResponse(chat_id=chat.id)


@chats_router.delete("/")
@jwt_token_required
def delete_chat(request: DeleteChatRequest) -> DeleteChatResponse:
    sender_id = get_current_user_id()

    check_user_account_status(sender_id)

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=request.chat_id).first()

            if not chat:
                raise HTTPException(400, f'Chat with id {request.chat_id} does not exist')

            if sender_id not in [admin.id for admin in chat.admins]:
                raise HTTPException(403, f'User {sender_id} does not have permission to delete this chat')

            session.delete(chat)

        return DeleteChatResponse(deleted_chat_id=request.chat_id)


MAX_MESSAGE_CONTENT_LENGTH = 5000


@chats_router.post("/{chat_id}")
@jwt_token_required
def send_message(chat_id: int, request: SendMessageRequest) -> SendMessageResponse:
    sender_id = get_current_user_id()
    check_user_account_status(sender_id)

    if len(request.content) == 0 or len(request.content) > MAX_MESSAGE_CONTENT_LENGTH:
        raise HTTPException(400, f'Length of message content should be in range [1 .. {MAX_MESSAGE_CONTENT_LENGTH}]')

    if request.image_id is not None:
        check_image_exists(request.image_id)

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=chat_id).first()
            if chat is None:
                raise HTTPException(404, f'Chat with id {chat_id} does not exist')

            sender = session.query(User).filter_by(id=sender_id).first()

            if sender is None:
                raise HTTPException(400, f'User with id {sender_id} does not exist')

            if sender not in chat.users:
                raise HTTPException(403, f'User {sender_id} is not member of chat {chat.id}')

            message = Message(
                content=request.content,
                image_id=request.image_id,
                author_id=sender_id,
                chat_id=chat_id,
                author=sender
            )

            session.add(message)

    return SendMessageResponse()


PAGE_SIZE = 5


@chats_router.get("/{chat_id}")
@jwt_token_required
def list_messages(chat_id: int, page_id: int | None = None) -> ListMessagesResponse:
    sender_id = get_current_user_id()
    check_user_account_status(sender_id)

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=chat_id).first()
            if chat is None:
                raise HTTPException(404, f'Chat with id {chat_id} does not exist')

            sender = session.query(User).filter_by(id=sender_id).first()

            if sender is None:
                raise HTTPException(400, f'User with id {sender_id} does not exist')

            if sender not in chat.users:
                raise HTTPException(403, f'User {sender_id} does not have access to this chat')

            n = len(chat.messages)

            if n <= 0:
                return ListMessagesResponse(messages=[], next_page_id=None)

            pages_amount = (n + PAGE_SIZE - 1) // PAGE_SIZE
            if page_id is None:
                page_id = max(pages_amount - 1, 0)

            messages = session.query(Message).filter(Message.chat_id == chat.id).order_by(
                sqlalchemy.asc(Message.created_at)).offset(page_id * PAGE_SIZE).limit(PAGE_SIZE).all()
            next_page_id = None if page_id + 1 >= pages_amount else page_id + 1

            def to_pydantic(message: Message) -> APIMessage:
                return APIMessage(
                    content=message.content,
                    image_id=message.image_id,
                    author_id=message.author_id,
                    author_name=message.author.name,
                    created_at=message.created_at
                )

            return ListMessagesResponse(messages=list(map(lambda m: to_pydantic(m), messages)),
                                        next_page_id=next_page_id)


@chats_router.get("/{chat_id}")
@jwt_token_required
def list_users(chat_id: int) -> ListChatUsersResponse:
    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=chat_id).first()
            if chat is None:
                raise HTTPException(404, f'Chat with id {chat_id} does not exist')

            users = [UserInfo(id=user.id, fullname=user.name) for user in chat.users]
            return ListChatUsersResponse(users=users)