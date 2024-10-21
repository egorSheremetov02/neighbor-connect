from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.constants import MAX_INVITED_USERS, MAX_MESSAGE_CONTENT_LENGTH, PAGE_SIZE
from app.api_models.chats import (
    Message as APIMessage,
    CreateChatRequest,
    CreateChatResponse,
    EditChatDataRequest,
    EditChatDataResponse,
    GetChatDataRequest,
    GetChatDataResponse,
    DeleteChatRequest,
    DeleteChatResponse,
    SendMessageRequest,
    SendMessageResponse,
    ListMessagesRequest,
    ListMessagesResponse,
    GetOwnChatsRequest,
    GetOwnChatsResponse,
)

from app.api_models.users import UserShortInfo as APIUserInfo
import logging, sqlalchemy
from sqlalchemy import func, select

from app.db_models.chats import Chat, Tag, User, Message
from app.core.db import SessionLocal
from app.api.util import (
    validate_tags,
    check_image_exists,
    validate_chat_request,
    jwt_token_required,
    hidden_user_payload
)
import app.api.db_util as db_util
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

chats_router = APIRouter()
logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")



@chats_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def create_chat(
    request: Request, create_chat_request: CreateChatRequest, user_payload=Depends(hidden_user_payload)
) -> CreateChatResponse:
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
        tags = [
            db_util.get_or_create_tag(session=session, tag_name=tag_name)
            for tag_name in create_chat_request.tags
        ]
        users = [
            db_util.get_user(session=session, user_id=user_id)
            for user_id in create_chat_request.users
        ]
        sender = session.get(User, sender_id)

        chat = Chat(
            name=create_chat_request.name,
            description=create_chat_request.description,
            tags=tags,
            image_id=create_chat_request.image_id,
            users=users,
            admins=[sender],
            messages=[],
        )

        session.add(chat)
        session.flush()  # this should execute the query and generate chat id
        return CreateChatResponse(chat_id=chat.id)


@chats_router.put("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def edit_chat_data(
    request: Request, edit_chat_data_request: EditChatDataRequest, user_payload=Depends(hidden_user_payload)
) -> EditChatDataResponse:
    """Edit the info of the chat, add/remove users, change admins. Access: chat admins."""

    sender_id = user_payload["user_id"]

    validate_chat_request(edit_chat_data_request)
    validate_tags(edit_chat_data_request.tags)

    if not edit_chat_data_request.admin_users:
        raise HTTPException(400, f"Chat must have at least one admin")
    if edit_chat_data_request.image_id is not None:
        check_image_exists(edit_chat_data_request.image_id)
    for new_admin in edit_chat_data_request.admin_users:
        if new_admin not in edit_chat_data_request.users:
            raise HTTPException(
                400,
                f"User {new_admin} would not a member of this chat and cannot be an admin",
            )

    with SessionLocal.begin() as session:
        chat = session.get(Chat, edit_chat_data_request.chat_id)
        if not chat:
            raise HTTPException(
                404, f"Chat with id {edit_chat_data_request.chat_id} does not exist"
            )
        sender = session.get(User, sender_id)
        if sender not in chat.admins:
            raise HTTPException(
                403, f"Sender does not have permission to edit this chat"
            )

        tags = [
            db_util.get_or_create_tag(session=session, tag_name=tag_name)
            for tag_name in edit_chat_data_request.tags
        ]
        users = [
            db_util.get_user(session=session, user_id=user_id)
            for user_id in edit_chat_data_request.users
        ]
        admins = [
            db_util.get_user(session=session, user_id=admin_id)
            for admin_id in edit_chat_data_request.admin_users
        ]

        chat.name = edit_chat_data_request.name
        chat.description = edit_chat_data_request.description
        chat.tags = tags
        chat.image_id = edit_chat_data_request.image_id
        chat.users = users
        chat.admins = admins

        return EditChatDataResponse()


@chats_router.get("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_chat_data(
    request: Request, chat_id: int, user_payload=Depends(hidden_user_payload)
) -> GetChatDataResponse:
    """Get the data of the chat, including member users and admins. Access: chat members."""

    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        chat = session.get(Chat, chat_id)
        if not chat:
            raise HTTPException(404, f"Chat with id={chat_id} does not exist")
        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(403, f"Sender is not a member of this chat")

        tags = [tag.name for tag in chat.tags]
        users_infos = [APIUserInfo(id=user.id, name=user.name, image_id=user.image_id) for user in chat.users]
        admins_ids = [admin.id for admin in chat.admins]

        return GetChatDataResponse(
            chat_id=chat.id,
            name=chat.name,
            description=chat.description,
            tags=tags,
            image_id=chat.image_id,
            users_infos=users_infos,
            admin_users=admins_ids,
        )


@chats_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def delete_chat(
    request: Request, delete_chat_request: DeleteChatRequest, user_payload=Depends(hidden_user_payload)
) -> DeleteChatResponse:
    """Delete the chat, including all its messages. Access: chat admins."""

    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        chat = session.get(Chat, delete_chat_request.chat_id)
        if not chat:
            raise HTTPException(
                404, f"Chat with id {delete_chat_request.chat_id} does not exist"
            )
        sender = session.get(User, sender_id)
        if sender not in chat.admins:
            raise HTTPException(
                403, f"Sender does not have permission to delete this chat"
            )

        session.delete(chat)
        return DeleteChatResponse()


@chats_router.post("/{chat_id}/messages", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def send_message(
    request: Request,
    chat_id: int,
    send_message_request: SendMessageRequest,
    user_payload=Depends(hidden_user_payload),
) -> SendMessageResponse:
    """Send a new message to a chat. Access: chat member."""

    sender_id = user_payload["user_id"]

    if (
        len(send_message_request.content) == 0
        or len(send_message_request.content) > MAX_MESSAGE_CONTENT_LENGTH
    ):
        raise HTTPException(
            400,
            f"Length of message content should be in range [1 .. {MAX_MESSAGE_CONTENT_LENGTH}]",
        )
    if send_message_request.image_id is not None:
        check_image_exists(send_message_request.image_id)

    with SessionLocal.begin() as session:
        chat = session.query(Chat).filter_by(id=chat_id).first()
        if chat is None:
            raise HTTPException(404, f"Chat with id {chat_id} does not exist")

        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(403, f"Sender is not member of chat {chat.id}")

        message = Message(
            content=send_message_request.content,
            image_id=send_message_request.image_id,
            author=sender,
            chat_id=chat_id,
        )
        session.add(message)

        return SendMessageResponse()


@chats_router.get("/{chat_id}/messages", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def list_messages(
    request: Request, chat_id: int, page_id: int | None = None, user_payload=Depends(hidden_user_payload)
) -> ListMessagesResponse:
    """List all messages in the chat, or its portion if pagination is used. Access: chat member."""

    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        chat = session.get(Chat, chat_id)
        if chat is None:
            raise HTTPException(404, f"Chat with id {chat_id} does not exist")

        sender = session.get(User, sender_id)
        if sender not in chat.users:
            raise HTTPException(
                403, f"User {sender_id} does not have access to this chat"
            )

        # 0 => first page, next_page_id ...

        if page_id is None:
            # simply return all messages
            next_page_id = None
            messages = chat.messages
        else:
            chat_len = (
                session.query(func.count(Message.id))
                .filter(Message.chat_id == chat.id)
                .scalar()
            )

            def ceildiv(a, b):
                return -(a // -b)

            total_pages = ceildiv(chat_len, PAGE_SIZE)
            max_page_id = total_pages - 1

            if total_pages == 0 and page_id == 0:
                return ListMessagesResponse(messages=[], next_page_id=None)

            if page_id < 0 or page_id > max_page_id:
                raise HTTPException(
                    400,
                    f"Page id {page_id} should be in range {0} <= ... <= {max_page_id}",
                )

            offset = PAGE_SIZE * page_id
            messages = (
                session.query(Message)
                .filter(Message.chat_id == chat.id)
                .order_by(Message.created_at.desc())
                .offset(offset)
                .limit(PAGE_SIZE)
                .all()
            )
            next_page_id = None if page_id == max_page_id else page_id + 1

        def to_api_message(message: Message) -> APIMessage:
            return APIMessage(
                content=message.content,
                image_id=message.image_id,
                author_id=message.author_id,
                author_name=message.author.name,
                created_at=message.created_at,
            )

        messages = [to_api_message(m) for m in messages]

        return ListMessagesResponse(messages=messages, next_page_id=next_page_id)


@chats_router.get("/own", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_own_chats(request: Request, user_payload=Depends(hidden_user_payload)) -> GetOwnChatsResponse:
    """Get all chats the sender is a member of."""

    sender_id = user_payload["user_id"]
    with SessionLocal.begin() as session:
        stmt = select(Chat.id).filter(User.id == sender_id)
        result = session.execute(stmt).all()
        chats_ids = [r[0] for r in result]
        return GetOwnChatsResponse(chats_ids=chats_ids)
