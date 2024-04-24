from typing import Union

from fastapi import APIRouter, Depends, HTTPException
from app.models.chats import (CreateChatRequest, CreateChatResponse,
                           EditChatDataRequest, EditChatDataResponse,
                           DeleteChatRequest, DeleteChatResponse,
                           SendMessageRequest, SendMessageResponse,
                           ListMessagesRequest, ListMessagesResponse)

router = APIRouter()


@router.post("/chats")
def create_chat(request: CreateChatRequest) -> CreateChatResponse:
    return


@router.put("/chats")
def edit_chat_data(request: EditChatDataRequest) -> EditChatDataResponse:
    return


@router.delete("/chats")
def delete_chat(request: DeleteChatRequest) -> DeleteChatResponse:
    return


@router.post("/chats/{chat_id}")
def send_message(chat_id: int, request: SendMessageRequest) -> SendMessageResponse:
    return


@router.get("/chats/{chat_id}")
def list_messages(chat_id: int, request: ListMessagesRequest) -> ListMessagesResponse:
    return