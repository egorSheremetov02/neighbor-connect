from fastapi import APIRouter, Depends, HTTPException
from app.api_models.chats import (CreateChatRequest, CreateChatResponse,
                                  EditChatDataRequest, EditChatDataResponse,
                                  DeleteChatRequest, DeleteChatResponse,
                                  SendMessageRequest, SendMessageResponse,
                                  ListMessagesRequest, ListMessagesResponse)
from app.db_models.chats import Chat, Tag, User
from app.core.db import SessionLocal
from app.api.util import get_current_user_id, validate_tags, check_user_permission, check_image_exists
from fastapi import HTTPException

chats_router = APIRouter()

MAX_CHAT_NAME_LENGTH = 64
MAX_CHAT_DESCRIPTION_LENGTH = 258
MAX_TAGS_AMOUNT = 7
MAX_INVITED_USERS = 1000

@chats_router.post("/")
def create_chat(request: CreateChatRequest) -> CreateChatResponse:
    sender_id = get_current_user_id()

    check_user_permission(sender_id)

    if len(request.name) == 0 or len(request.name) > MAX_CHAT_NAME_LENGTH:
        raise HTTPException(400, f'Name length of chat should be in range [1 .. {MAX_CHAT_NAME_LENGTH}]')
    if len(request.description) == 0 or len(request.description) > MAX_CHAT_DESCRIPTION_LENGTH:
        raise HTTPException(400, f'Description length of chat should be in range [1 .. {MAX_CHAT_DESCRIPTION_LENGTH}]')
    if len(request.tags) >= MAX_TAGS_AMOUNT:
        raise HTTPException(400, f'Amount of tags should not exceed {MAX_TAGS_AMOUNT}')

    validate_tags(request.tags)

    if sender_id not in request.users:
        raise HTTPException(400, f"List of users does not contain creator's id")

    if len(request.users) > MAX_INVITED_USERS:
        raise HTTPException(400, f"Amount of invited users should not exceed {MAX_INVITED_USERS}")

    if request.image_id is not None:
        check_image_exists(request.image_id)


    with SessionLocal() as session:
        with session.begin():
            tags = []
            for tag in request.tags:
                tag_object = session.query(Tag).filter_by(name=tag).first()
                if not tag_object:
                    tag_object = Tag(name=tag)
                    session.add(tag_object)
                tags.append(tag_object)

            chat = Chat(name=request.name,
                        description=request.description,
                        tags=tags,
                        image_id=request.image_id
                        )

            users = session.query(User).filter(User.id.in_(request.users)).all()

            if len(users) != request.users:
                fake_users = list(set(request.users) - set(map(lambda u: u.id, users)))
                print(f'Users with ids: {fake_users} do not exist')

            chat.users = [user for user in users]
            session.add(chat)
        return CreateChatResponse(chat_id=chat.id)


@chats_router.put("/")
def edit_chat_data(request: EditChatDataRequest) -> EditChatDataResponse:
    return


@chats_router.delete("/")
def delete_chat(request: DeleteChatRequest) -> DeleteChatResponse:
    return


@chats_router.post("/{chat_id}")
def send_message(chat_id: int, request: SendMessageRequest) -> SendMessageResponse:
    return


@chats_router.get("/{chat_id}")
def list_messages(chat_id: int, request: ListMessagesRequest) -> ListMessagesResponse:
    return
