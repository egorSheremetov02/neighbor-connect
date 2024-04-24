from typing import Union

from fastapi import FastAPI
from .models import (CreateChatRequest, CreateChatResponse,
                    EditChatDataRequest, EditChatDataResponse,
                    DeleteChatRequest, DeleteChatResponse,
                    SendMessageRequest, SendMessageResponse,
                    ListMessagesRequest, ListMessagesResponse)

app = FastAPI()


@app.post("/chats")
def create_chat(request: CreateChatRequest) -> CreateChatResponse:
    return


@app.put("/chats")
def edit_chat_data(request: EditChatDataRequest) -> EditChatDataResponse:
    return


@app.delete("/chats")
def delete_chat(request: DeleteChatRequest) -> DeleteChatResponse:
    return


@app.post("/chats/{chat_id}")
def send_message(chat_id: int, request: SendMessageRequest) -> SendMessageResponse:
    return


@app.get("/chats/{chat_id}")
def list_messages(chat_id: int, request: ListMessagesRequest) -> ListMessagesResponse:
    return