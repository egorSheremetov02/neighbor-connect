from pydantic import BaseModel, Field
from datetime import datetime

from app.api_models.users import UserShortInfo

# ---- data models ----


class Message(BaseModel):
    content: str
    image_id: int | None = Field(None)
    author_id: int
    author_name: str
    created_at: datetime


# ---- request / response models ----



class CreateChatRequest(BaseModel):
    """Create a new chat with users. Creator is the initial admin."""
    name: str
    description: str | None = Field(None)
    tags: list[str]
    image_id: int | None = Field(None)
    users: list[int]


class CreateChatResponse(BaseModel):
    chat_id: int


class EditChatDataRequest(BaseModel):
    """Edit chat data. Can only be done by chat admin."""
    chat_id: int
    name: str
    description: str
    tags: list[str]
    image_id: int | None = Field(None)
    users: list[int]
    admin_users: list[int]


class EditChatDataResponse(BaseModel):
    pass


class GetChatDataRequest(BaseModel):
    """Get chat data, including its users. Must be a member to request."""
    chat_id: int


class GetChatDataResponse(BaseModel):
    chat_id: int
    name: str
    description: str | None = Field(None)
    tags: list[str]
    image_id: int | None = Field(None)
    users_infos: list[UserShortInfo]
    admin_users: list[int]


class DeleteChatRequest(BaseModel):
    """Delete a chat, including all its messages."""
    chat_id: int


class DeleteChatResponse(BaseModel):
    pass


class SendMessageRequest(BaseModel):
    """Send a message to a chat. Author is implied from auth token."""
    content: str
    image_id: int | None = Field(None)


class SendMessageResponse(BaseModel):
    pass


# unused: GET requests cannot have body. kept for consistency
class ListMessagesRequest(BaseModel):
    """List all messages in a chat, sorted by creation time. Pagination is currently unused."""
    pass


class ListMessagesResponse(BaseModel):
    messages: list[Message]
    next_page_id: int | None = Field(None)


class GetOwnChatsRequest(BaseModel):
    """Get the chats the token bearer is a member of."""
    pass


class GetOwnChatsResponse(BaseModel):
    chats_ids: list[int]
