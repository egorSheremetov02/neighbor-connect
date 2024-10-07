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
from app.api.util import validate_tags, check_image_exists, \
    validate_chat_request, jwt_token_required
import app.api.db_util as db_util
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

chats_router = APIRouter()
logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")


# note: declaring `request` and `user_payload` params is necessary for JWT, even if not using it. 


@chats_router.get("/allusers", dependencies=[Depends(security_scheme)])
@jwt_token_required
def get_all_users(request: Request, user_payload = None) -> GetAllUsersResponse:
    """Get all users that can be added to a new chat."""

    with SessionLocal.begin() as session:
        # will automatically commit and close, thanks to sessionmaker
        stmt = select(User.id)
        result = session.execute(stmt)
        users_ids = [r[0] for r in result]
        return GetAllUsersResponse(users_ids=users_ids)


@chats_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def create_chat(request: Request, create_chat_request: CreateChatRequest, user_payload = None) -> CreateChatResponse:
    """Create a new chat and add some users to it. The sender must be one of the invited users.
    They will also be chat's admin."""

    sender_id = user_payload["user_id"]

    validate_chat_request(create_chat_request)
    validate_tags(create_chat_request.tags)

    if sender_id not in create_chat_request.users:
        raise HTTPException(400, f"List of users does not contain creator's id")
    if create_chat_request.image_id is not None:
        check_image_exists(create_chat_request.image_id)

    with SessionLocal.begin() as session:
        tags = [db_util.get_or_create_tag(session=session, tag_name=tag_name) for tag_name in create_chat_request.tags]
        users = [db_util.get_user(session=session, user_id=user_id) for user_id in create_chat_request.users]
        sender = session.get(User, sender_id)

        chat = Chat(name=create_chat_request.name,
                    description=create_chat_request.description,
                    tags=tags,
                    image_id=create_chat_request.image_id,
                    users=users,
                    admins=[sender],
                    messages=[])

        session.add(chat)
        session.flush()  # this should execute the query and generate chat id
        return CreateChatResponse(chat_id=chat.id)


@chats_router.put("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def edit_chat_data(request: Request, edit_chat_data_request: EditChatDataRequest, user_payload = None) -> EditChatDataResponse:
    """Edit the info of the chat, add/remove users, change admins. Access: chat admins."""
    
    sender_id = user_payload["user_id"]

    validate_chat_request(edit_chat_data_request)
    validate_tags(edit_chat_data_request.tags)

    if not edit_chat_data_request.admin_users:
        raise HTTPException(400, f'Chat must have at least one admin')
    if edit_chat_data_request.image_id is not None:
        check_image_exists(edit_chat_data_request.image_id)
    for new_admin in edit_chat_data_request.admin_users:
        if new_admin not in edit_chat_data_request.users:
            raise HTTPException(400, f'User {new_admin} would not a member of this chat and cannot be an admin')

    with SessionLocal.begin() as session:
        chat = session.get(Chat, edit_chat_data_request.chat_id)
        if not chat:
            raise HTTPException(404, f'Chat with id {edit_chat_data_request.chat_id} does not exist')
        sender = session.get(User, sender_id)
        if sender not in chat.admins:
            raise HTTPException(403, f'Sender does not have permission to edit this chat')
        
        tags = [db_util.get_or_create_tag(session=session, tag_name=tag_name) for tag_name in edit_chat_data_request.tags]
        users = [db_util.get_user(session=session, user_id=user_id) for user_id in edit_chat_data_request.users]
        admins = [db_util.get_user(session=session, user_id=admin_id) for admin_id in edit_chat_data_request.admin_users]

        chat.name = edit_chat_data_request.name
        chat.description = edit_chat_data_request.description
        chat.tags = tags
        chat.image_id = edit_chat_data_request.image_id
        chat.users = users
        chat.admins = admins

        return EditChatDataResponse()
        

# todo: GET requests cannot have body???
@chats_router.get("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def get_chat_data(request: Request, get_chat_data_request: GetChatDataRequest, user_payload = None) -> GetChatDataResponse:
    """Get the data of the chat, including member users and admins. Access: chat members."""
    
    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        chat = session.get(Chat, get_chat_data_request.chat_id)
        if not chat:
            raise HTTPException(404, f'Chat with id={get_chat_data_request.chat_id} does not exist')
        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(403, f'Sender is not a member of this chat')

        tags = [tag.name for tag in chat.tags]
        users_infos = [APIUserInfo(id=user.id, name=user.name) for user in chat.users]
        admins_ids = [admin.id for admin in chat.admins]

        return GetChatDataResponse(
            chat_id=chat.id,
            name=chat.name,
            description=chat.description,
            tags=tags,
            image_id=chat.image_id,
            users_infos=users_infos,
            admin_users=admins_ids
        )


@chats_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def delete_chat(request: Request, delete_chat_request: DeleteChatRequest, user_payload = None) -> DeleteChatResponse:
    """Delete the chat, including all its messages. Access: chat admins."""
    
    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        chat = session.get(Chat, delete_chat_request.chat_id)
        if not chat:
            raise HTTPException(404, f'Chat with id {delete_chat_request.chat_id} does not exist')
        sender = session.get(User, sender_id)
        if sender_id not in chat.admins:
            raise HTTPException(403, f'Sender does not have permission to delete this chat')

        session.delete(chat)
        return DeleteChatResponse()
    

@chats_router.post("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def send_message(request: Request, chat_id: int, send_message_request: SendMessageRequest, user_payload = None) -> SendMessageResponse:
    """Send a new message to a chat. Access: chat member."""
    
    sender_id = user_payload["user_id"]

    if len(send_message_request.content) == 0 or len(send_message_request.content) > MAX_MESSAGE_CONTENT_LENGTH:
        raise HTTPException(400, f'Length of message content should be in range [1 .. {MAX_MESSAGE_CONTENT_LENGTH}]')
    if send_message_request.image_id is not None:
        check_image_exists(send_message_request.image_id)

    with SessionLocal.begin() as session:
        chat = session.query(Chat).filter_by(id=chat_id).first()
        if chat is None:
            raise HTTPException(404, f'Chat with id {chat_id} does not exist')

        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(403, f'Sender is not member of chat {chat.id}')

        message = Message(
            content=send_message_request.content,
            image_id=send_message_request.image_id,
            author=sender,
            chat_id=chat_id,
        )
        session.add(message)

        return SendMessageResponse()


@chats_router.get("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def list_messages(request: Request, chat_id: int, page_id: int | None = None, user_payload = None) -> ListMessagesResponse:
    """List all messages in the chat, or its portion if pagination is used (currently not working). Access: chat member."""
    
    sender_id = user_payload["user_id"]

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
def get_own_chats(request: Request, user_payload = None) -> GetOwnChatsResponse:
    """Get all chats the sender is a member of."""
    
    sender_id = user_payload["user_id"]
    with SessionLocal.begin() as session:
        stmt = select(Chat.id).filter(User.id == sender_id)
        result = session.execute(stmt).all()
        chats_ids = [r[0] for r in result]
        return GetOwnChatsResponse(chats_ids=chats_ids)
