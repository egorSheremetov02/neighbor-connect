from pydantic import BaseModel
from app.core.db import DBBase
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime,
import datetime


class User(DBBase):
    id = Column(Integer, primary_key=True, index=r)


class Message(DBBase):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    image_id: int = Column(Integer, nullable=True)
    author_id: int = Column(Integer)
    created_at: datetime = Column(DateTime, default=datetime.datetime.utcnow)


class MessageView(BaseModel):
    content = Column(String, nullable=False)
    image_id: int = Column(Integer, nullable=True)
    author_id: int = Column(Integer)
    author_name: str = Column(String, nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.datetime.utcnow)



class CreateChatRequest(BaseModel):
    name: str
    description: str
    tags: list[str]
    image_id: int | None = None
    users: list[int]

# class Chat(DBBase):
#     __tablename__ = "chats"
#
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     description = Column(String, nullable=True)
#     tags: list[str] = Column()
#     image_id: int | None = None
#     users: list[int]

class Tag(DBBase):
    name = Column(String, primary_key=True)

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
    messages: list[MessageView]
    next_page_id: int | None = None
