from typing import Union

from fastapi import APIRouter, Depends, HTTPException
from app.api_models.chats import (CreateChatRequest, CreateChatResponse,
                                  EditChatDataRequest, EditChatDataResponse,
                                  DeleteChatRequest, DeleteChatResponse,
                                  SendMessageRequest, SendMessageResponse,
                                  ListMessagesRequest, ListMessagesResponse)

chats_router = APIRouter()


@chats_router.post("/")
def create_chat(request: CreateChatRequest) -> CreateChatResponse:
    return


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