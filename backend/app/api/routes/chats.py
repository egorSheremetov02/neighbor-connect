from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.constants import MAX_INVITED_USERS, MAX_MESSAGE_CONTENT_LENGTH
from app.api_models.chats import (
    Message as APIMessage, UserShortInfo as APIUserInfo,
    GetAllUsersRequest, GetAllUsersResponse,
    CreateChatRequest, CreateChatResponse,
    EditChatDataRequest, EditChatDataResponse,
    GetChatDataRequest, GetChatDataResponse,
    DeleteChatRequest, DeleteChatResponse,
    SendMessageRequest, SendMessageResponse,
    ListMessagesRequest, ListMessagesResponse,
    GetOwnChatsRequest, GetOwnChatsResponse,
)
import logging, sqlalchemy
from sqlalchemy import select

from app.db_models.chats import Chat, Tag, User, Message
from app.core.db import SessionLocal
from app.api.util import JWTPayload, validate_tags, check_image_exists, \
    validate_chat_request, jwt_token_required
import app.api.db_util as db_util
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

chats_router = APIRouter()
logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")


@chats_router.get("/allusers", dependencies=[Depends(security_scheme)])
@jwt_token_required
def get_all_users(request: GetAllUsersRequest) -> GetAllUsersResponse:
    """Get all users that can be added to a new chat."""

    with SessionLocal.begin() as session:
        # will automatically commit and close, thanks to sessionmaker
        stmt = select(User.id)
        result = session.execute(stmt)
        users_ids = [r["user_id"] for r in result]
        return GetAllUsersResponse(users_ids=users_ids)


@chats_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def create_chat(request: CreateChatRequest, user_payload: JWTPayload) -> CreateChatResponse:
    """Create a new chat and add some users to it. The sender must be one of the invited users.
    They will also be chat's admin."""

    sender_id = user_payload.user_id

    validate_chat_request(request)
    validate_tags(request.tags)

    if sender_id not in request.users:
        raise HTTPException(400, f"List of users does not contain creator's id")
    if request.image_id is not None:
        check_image_exists(request.image_id)

    with SessionLocal.begin() as session:
        tags = [db_util.get_or_create_tag(tag_name) for tag_name in request.tags]
        users = [db_util.get_user(user_id) for user_id in request.users]

        chat = Chat(name=request.name,
                    description=request.description,
                    tags=tags,
                    image_id=request.image_id,
                    users_ids=users,
                    admins_ids=[sender_id],
                    messages=[])

        session.add(chat)
        session.flush()  # this should execute the query and generate chat id
        return CreateChatResponse(chat_id=chat.id)


@chats_router.put("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def edit_chat_data(request: EditChatDataRequest, user_payload: JWTPayload) -> EditChatDataResponse:
    """Edit the info of the chat, add/remove users, change admins. Access: chat admins."""
    
    sender_id = user_payload.user_id

    validate_chat_request(request)
    validate_tags(request.tags)

    if not request.admin_users:
        raise HTTPException(400, f'Chat must have at least one admin')
    if request.image_id is not None:
        check_image_exists(request.image_id)
    for new_admin in request.admin_users:
        if new_admin not in request.users:
            raise HTTPException(400, f'User {new_admin} would not a member of this chat and cannot be an admin')

    with SessionLocal.begin() as session:
        chat = session.get(Chat, request.chat_id)
        if not chat:
            raise HTTPException(404, f'Chat with id {request.chat_id} does not exist')
        if sender_id not in chat.admins_ids:
            raise HTTPException(403, f'Sender does not have permission to edit this chat')
        
        tags = [db_util.get_or_create_tag(tag_name) for tag_name in request.tags]
        users = [db_util.get_user(user_id) for user_id in request.users]
        
        chat.name = request.name
        chat.description = request.description
        chat.tags = tags
        chat.image_id = request.image_id
        chat.users = users
        chat.admins_ids = request.admin_users

        return EditChatDataResponse()
        

@chats_router.get("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def get_chat_data(request: GetChatDataRequest, user_payload: JWTPayload) -> GetChatDataResponse:
    """Get the data of the chat, including member users and admins. Access: chat members."""
    
    sender_id = user_payload.user_id

    with SessionLocal.begin() as session:
        chat = session.get(Chat, request.chat_id)
        if not chat:
            raise HTTPException(404, f'Chat with id={request.chat_id} does not exist')
        if sender_id not in chat.users_ids:
            raise HTTPException(403, f'Sender is not a member of this chat')

        tags = [tag.name for tag in chat.tags]
        users_infos = [APIUserInfo(id=user.id, name=user.name) for user in chat.users]

        return GetChatDataResponse(
            chat_id=chat.id,
            name=chat.name,
            description=chat.description,
            tags=tags,
            image_id=chat.image_id,
            users_infos=users_infos,
            admin_users=chat.admins_ids
        )


@chats_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def delete_chat(request: DeleteChatRequest, user_payload: JWTPayload) -> DeleteChatResponse:
    """Delete the chat, including all its messages. Access: chat admins."""
    
    sender_id = user_payload.user_id

    with SessionLocal.begin() as session:
        chat = session.get(Chat, request.chat_id)
        if not chat:
            raise HTTPException(404, f'Chat with id {request.chat_id} does not exist')
        if sender_id not in chat.admins_ids:
            raise HTTPException(403, f'Sender does not have permission to delete this chat')

        session.delete(chat)

        return DeleteChatResponse(deleted_chat_id=request.chat_id)
    

@chats_router.post("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def send_message(chat_id: int, request: SendMessageRequest, user_payload: JWTPayload) -> SendMessageResponse:
    """Send a new message to a chat. Access: chat member."""
    
    sender_id = user_payload.user_id

    if len(request.content) == 0 or len(request.content) > MAX_MESSAGE_CONTENT_LENGTH:
        raise HTTPException(400, f'Length of message content should be in range [1 .. {MAX_MESSAGE_CONTENT_LENGTH}]')
    if request.image_id is not None:
        check_image_exists(request.image_id)

    with SessionLocal.begin() as session:
        chat = session.query(Chat).filter_by(id=chat_id).first()
        if chat is None:
            raise HTTPException(404, f'Chat with id {chat_id} does not exist')

        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(403, f'Sender is not member of chat {chat.id}')

        message = Message(
            content=request.content,
            image_id=request.image_id,
            author=sender,
            chat_id=chat_id,
        )
        session.add(message)

        return SendMessageResponse()


@chats_router.get("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def list_messages(request: ListMessagesRequest, chat_id: int, user_payload: JWTPayload) -> ListMessagesResponse:
    """List all messages in the chat, or its portion if pagination is used (currently not working). Access: chat member."""
    
    sender_id = user_payload.user_id

    with SessionLocal.begin() as session:
        chat = session.get(Chat, chat_id)
        if chat is None:
            raise HTTPException(404, f'Chat with id {chat_id} does not exist')

        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(403, f'User {sender_id} does not have access to this chat')

        # todo: pagination

        # n = len(chat.messages)
        # if n <= 0:
        #     return ListMessagesResponse(messages=[], next_page_id=None)
        # pages_amount = (n + PAGE_SIZE - 1) // PAGE_SIZE
        # if page_id is None:
        #     page_id = max(pages_amount - 1, 0)
        # messages = session.query(Message).filter(Message.chat_id == chat.id).order_by(
        #     sqlalchemy.asc(Message.created_at)).offset(page_id * PAGE_SIZE).limit(PAGE_SIZE).all()
        # next_page_id = None if page_id + 1 >= pages_amount else page_id + 1

        def to_api_message(message: Message) -> APIMessage:
            return APIMessage(
                content=message.content,
                image_id=message.image_id,
                author_id=message.author_id,
                author_name=message.author.name,
                created_at=message.created_at
            )
        messages = [to_api_message(m) for m in chat.messages]

        return ListMessagesResponse(messages=messages, next_page_id=None)


@chats_router.get("/own", dependencies=[Depends(security_scheme)])
@jwt_token_required
def get_own_chats(request: GetOwnChatsRequest, user_payload: JWTPayload) -> GetOwnChatsResponse:
    """Get all chats the sender is a member of."""
    
    sender_id = user_payload.user_id
    with SessionLocal.begin() as session:
        stmt = select(Chat.id).filter(User.id == sender_id)
        result = session.execute(stmt).all()
        chats_ids = [r["id"] for r in result]
        return GetOwnChatsResponse(chats_ids=chats_ids)
