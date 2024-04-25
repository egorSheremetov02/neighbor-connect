from typing import Union

from fastapi import APIRouter, Depends, HTTPException
from app.api_models.chats import (CreateChatRequest, CreateChatResponse,
                                  EditChatDataRequest, EditChatDataResponse,
                                  DeleteChatRequest, DeleteChatResponse,
                                  SendMessageRequest, SendMessageResponse,
                                  ListMessagesRequest, ListMessagesResponse)
from app.db_models.chats import Chat, Tag
from app.core.db import SessionLocal

chats_router = APIRouter()


@chats_router.post("/")
def create_chat(request: CreateChatRequest) -> CreateChatResponse:
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
                        tags=tags
                        # image_url=request.image_url TODO
                        )
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
