from pydantic import BaseModel
from datetime import datetime


class Message(BaseModel):
    content: str
    image_id: int | None
    author_id: int
    author_name: str
    created_at: datetime


class CreateChatRequest(BaseModel):
    name: str
    description: str
    tags: list[str]
    # image_id: int | None = None TODO
    # users: list[int]


class CreateChatResponse(BaseModel):
    chat_id: int


class EditChatDataRequest(BaseModel):
    chat_id: int
    name: str
    description: int
    tags: list[str]
    image_id: int | None = None
    users: list[int]
    admin_users: list[int]


class EditChatDataResponse(BaseModel):
    pass


class DeleteChatRequest(BaseModel):
    chat_id: int


class DeleteChatResponse(BaseModel):
    pass


class SendMessageRequest(BaseModel):
    content: str
    image_id: int | None = None


class SendMessageResponse(BaseModel):
    pass


class ListMessagesRequest(BaseModel):
    page_id: int | None = None


class ListMessagesResponse(BaseModel):
    messages: list[Message]
    next_page_id: int | None = None
