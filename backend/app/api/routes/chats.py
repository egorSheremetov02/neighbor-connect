from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.constants import MAX_INVITED_USERS
from app.api_models.chats import (
    Message as APIMessage, UserInfo as APIUserInfo,
    GetAllUsersRequest, GetAllUsersResponse,
    CreateChatRequest, CreateChatResponse,
    EditChatDataRequest, EditChatDataResponse,
    GetChatDataRequest, GetChatDataResponse,
    DeleteChatRequest, DeleteChatResponse,
    SendMessageRequest, SendMessageResponse,
    ListMessagesRequest, ListMessagesResponse
)
import logging, sqlalchemy

from app.db_models.chats import Chat, Tag, User, Message
from app.core.db import SessionLocal
from app.api.util import validate_tags, check_image_exists, \
    validate_chat_request, jwt_token_required
from fastapi import HTTPException
from fastapi.security import APIKeyHeader

chats_router = APIRouter()
logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")


@chats_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def create_chat(create_chat_request: CreateChatRequest, user_payload) -> CreateChatResponse:
    """
    :param create_chat_request: Object containing the chat creation details.
    :param user_payload: Decoded JWT token payload containing user information.
    :return: Response object containing the created chat's ID.
    """
    sender_id = user_payload['user_id']

    validate_chat_request(create_chat_request)
    validate_tags(create_chat_request.tags)

    if sender_id not in create_chat_request.users:
        raise HTTPException(400, f"List of users does not contain creator's id")

    if len(create_chat_request.users) > MAX_INVITED_USERS:
        raise HTTPException(400, f"Amount of invited users should not exceed {MAX_INVITED_USERS}")

    if create_chat_request.image_id is not None:
        check_image_exists(create_chat_request.image_id)

    with SessionLocal() as session:
        with session.begin():
            sender = session.query(User).filter_by(id=sender_id).first()

            tags = []
            for tag in set(create_chat_request.tags):
                tag_object = session.query(Tag).filter_by(name=tag).first()
                if not tag_object:
                    tag_object = Tag(name=tag)
                    session.add(tag_object)
                tags.append(tag_object)

            chat = Chat(name=create_chat_request.name,
                        description=create_chat_request.description,
                        tags=tags,
                        image_id=create_chat_request.image_id,
                        admins=[sender])

            users = session.query(User).filter(User.id.in_(create_chat_request.users)).all()
            chat.users = [user for user in users]
            session.add(chat)

        if len(users) != len(create_chat_request.users):
            fake_users = list(set(create_chat_request.users) - set(map(lambda u: u.id, users)))
            logger.warning(
                f'User {sender_id} tried create chat with non-existing users {fake_users}, chat_id: {chat.id}')

        return CreateChatResponse(chat_id=chat.id)


@chats_router.put("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def edit_chat_data(request: Request, edit_chat_request: EditChatDataRequest, user_payload=None) -> EditChatDataResponse:
    """
    :param request: The HTTP request object containing metadata about the request.
    :param edit_chat_request: The edit chat data request object containing the details to update the chat.
    :param user_payload: Optional; The user information payload generally extracted from the authorization token.
    :return: Returns an EditChatDataResponse object that contains the updated chat data.
    """
    sender_id = user_payload['user_id']

    validate_chat_request(edit_chat_request)
    validate_tags(edit_chat_request.tags)

    if edit_chat_request.image_id is not None:
        check_image_exists(edit_chat_request.image_id)

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=edit_chat_request.chat_id).first()

            if not chat:
                raise HTTPException(400, f'Chat with id {edit_chat_request.chat_id} does not exist')

            if sender_id not in [admin.id for admin in chat.admins]:
                raise HTTPException(403, f'User {sender_id} does not have permission to edit this chat')

            tags = []
            for tag in set(edit_chat_request.tags):
                tag_object = session.query(Tag).filter_by(name=tag).first()
                if not tag_object:
                    tag_object = Tag(name=tag)
                    session.add(tag_object)
                tags.append(tag_object)

            chat.name = edit_chat_request.name
            chat.description = edit_chat_request.description
            chat.tags = tags
            chat.image_id = edit_chat_request.image_id

            users = session.query(User).filter(User.id.in_(edit_chat_request.users)).all()
            chat.users = [user for user in users]

            admins = session.query(User).filter(User.id.in_(edit_chat_request.admin_users)).all()
            chat.admins = [user for user in admins]

        if len(users) != len(edit_chat_request.users):
            fake_users = list(set(edit_chat_request.users) - set(map(lambda u: u.id, users)))
            logger.warning(
                f'User {sender_id} tried edit chat with non-existing users {fake_users}, chat_id: {chat.id}'
            )

        return EditChatDataResponse(chat_id=chat.id)


@chats_router.delete("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def delete_chat(request: Request, delet_chat_request: DeleteChatRequest, user_payload=None) -> DeleteChatResponse:
    """
    :param request: The request object that contains metadata about the request
    :param delet_chat_request: The request payload containing the chat ID to be deleted
    :type delet_chat_request: DeleteChatRequest
    :param user_payload: The payload containing user information extracted from the JWT token, defaults to None
    :type user_payload: dict, optional
    :return: Response indicating the result of the delete chat operation
    :rtype: DeleteChatResponse
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=delet_chat_request.chat_id).first()

            if not chat:
                raise HTTPException(400, f'Chat with id {delet_chat_request.chat_id} does not exist')

            if sender_id not in [admin.id for admin in chat.admins]:
                raise HTTPException(403, f'User {sender_id} does not have permission to delete this chat')

            session.delete(chat)

        return DeleteChatResponse(deleted_chat_id=delet_chat_request.chat_id)


MAX_MESSAGE_CONTENT_LENGTH = 5000


@chats_router.post("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def send_message(request: Request, chat_id: int, send_msg_request: SendMessageRequest, user_payload=None) -> SendMessageResponse:
    """
    :param request: The HTTP request object.
    :param chat_id: The ID of the chat to which the message is being sent.
    :param send_msg_request: The request body containing the message content and optional image ID.
    :param user_payload: The payload of the authenticated user, containing user details.
    :return: An instance of SendMessageResponse indicating the outcome of the message sending operation.
    """
    sender_id = user_payload['user_id']

    if len(send_msg_request.content) == 0 or len(send_msg_request.content) > MAX_MESSAGE_CONTENT_LENGTH:
        raise HTTPException(400, f'Length of message content should be in range [1 .. {MAX_MESSAGE_CONTENT_LENGTH}]')

    if send_msg_request.image_id is not None:
        check_image_exists(send_msg_request.image_id)

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=chat_id).first()
            if chat is None:
                raise HTTPException(404, f'Chat with id {chat_id} does not exist')

            sender = session.query(User).filter_by(id=sender_id).first()

            if sender not in chat.users:
                raise HTTPException(403, f'User {sender_id} is not member of chat {chat.id}')

            message = Message(
                content=send_msg_request.content,
                image_id=send_msg_request.image_id,
                author_id=sender_id,
                chat_id=chat_id,
                author=sender
            )

            session.add(message)

    return SendMessageResponse()


PAGE_SIZE = 5


@chats_router.get("/{chat_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def list_messages(request: Request, chat_id: int, page_id: int | None = None, user_payload=None) -> ListMessagesResponse:
    """
    :param request: The HTTP request object
    :param chat_id: The ID of the chat to retrieve messages from
    :param page_id: The page number for paginated messages, optional, defaults to the latest page
    :param user_payload: User authentication payload containing user details
    :return: ListMessagesResponse object containing the list of messages and the next page ID, if available
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=chat_id).first()
            if chat is None:
                raise HTTPException(404, f'Chat with id {chat_id} does not exist')

            sender = session.query(User).filter_by(id=sender_id).first()

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
    """
    :param chat_id: Unique identifier of the chat.
    :return: A response object containing a list of users in the specified chat.
    """
    with SessionLocal() as session:
        with session.begin():
            chat = session.query(Chat).filter_by(id=chat_id).first()
            if chat is None:
                raise HTTPException(404, f'Chat with id {chat_id} does not exist')

            users = [UserInfo(id=user.id, fullname=user.name) for user in chat.users]
            return ListChatUsersResponse(users=users)