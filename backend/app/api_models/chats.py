from pydantic import BaseModel
from datetime import datetime


class Message(BaseModel):
    """
        The Message class represents a message object with various attributes.

        Attributes
        ----------
        content : str
            The textual content of the message.
        image_id : int or None
            The identifier of the attached image, if any.
        author_id : int
            The identifier of the author of the message.
        author_name : str
            The name of the author of the message.
        created_at : datetime
            The timestamp when the message was created.
    """
    content: str
    image_id: int | None
    author_id: int
    author_name: str
    created_at: datetime


class CreateChatRequest(BaseModel):
    """
        The CreateChatRequest class represents a data model for creating a new chat request.

        Attributes:
            name (str): The name of the chat.
            description (str): A description of the chat.
            tags (list[str]): A list of tags associated with the chat.
            image_id (Optional[int]): An optional ID of an image associated with the chat. Defaults to None.
            users (list[int]): A list of user IDs who are part of the chat.
    """
    name: str
    description: str
    tags: list[str]
    image_id: int | None = None
    users: list[int]


class CreateChatResponse(BaseModel):
    """
    CreateChatResponse is a response model that represents the result of a chat creation request.
    It contains the unique identifier for the created chat.

    Attributes:
        chat_id (int): The unique identifier of the created chat.
    """
    chat_id: int


class EditChatDataRequest(BaseModel):
    """
    Represents a request to edit chat data, including basic chat information and user management.

    Attributes:
        chat_id (int): The identifier for the chat.
        name (str): The name of the chat.
        description (str): A textual description of the chat.
        tags (list[str]): A list of tags associated with the chat.
        image_id (int | None): An optional identifier for the chat's image.
        users (list[int]): A list of user identifiers who are part of the chat.
        admin_users (list[int]): A list of user identifiers with administrative privileges.
    """
    chat_id: int
    name: str
    description: str
    tags: list[str]
    image_id: int | None = None
    users: list[int]
    admin_users: list[int]


class EditChatDataResponse(BaseModel):
    chat_id: int


class DeleteChatRequest(BaseModel):
    chat_id: int


class DeleteChatResponse(BaseModel):
    deleted_chat_id: int


class SendMessageRequest(BaseModel):
    """
        A model representing a request to send a message.

        Attributes
        ----------
        content : str
            The text content of the message.
        image_id : int | None, optional
            An optional identifier for an image attached to the message.
    """
    content: str
    image_id: int | None = None


class SendMessageResponse(BaseModel):
    pass


class ListMessagesRequest(BaseModel):
    page_id: int | None = None


class ListMessagesResponse(BaseModel):
    """
        Represents the response of a list messages request.

        Attributes
        ----------
        messages : list[Message]
            A list of Message objects.
        next_page_id : int, optional
            An identifier for the next page of messages, if any.
    """
    messages: list[Message]
    next_page_id: int | None = None


class UserInfo(BaseModel):
    id: int
    fullname: str


class ListChatUsersResponse(BaseModel):
    users: list[UserInfo]


