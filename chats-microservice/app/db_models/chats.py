from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from app.core.db import DBBase


class User(DBBase):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)


class Message(DBBase):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    image_id: int = Column(Integer, nullable=True)
    author_id: int = Column(Integer)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)


class Tag(DBBase):
    __tablename__ = "tags"
    name = Column(String, primary_key=True)


class Chat(DBBase):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    # tags: list[str] = Column()
    # image_id: int | None = None
    # users: list[int]
