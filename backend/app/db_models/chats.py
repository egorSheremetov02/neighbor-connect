from datetime import datetime
from typing import List

from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import functions as func
from app.core.db import DBBase


class User(DBBase):
    __tablename__ = "users"
    id = mapped_column(Integer, primary_key=True, index=True)
    name = mapped_column(String, default="Test user", nullable=False)
    email = mapped_column(String, nullable=False)
    login = mapped_column(String, nullable=False)
    password_hashed = mapped_column(String, nullable=False)
    birthday = mapped_column(String, nullable=False)
    additional_info = mapped_column(String, nullable=True)
    address = mapped_column(String, nullable=False)


class Message(DBBase):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(nullable=False)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"), default=None)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped[str] = relationship()  
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"))


class Tag(DBBase):
    __tablename__ = "tags"
    name: Mapped[str] = mapped_column(primary_key=True, index=True)


class Chat(DBBase):
    __tablename__ = "chats"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    tags_names: Mapped[List[str]] = mapped_column(ForeignKey("tags.name"))
    tags: Mapped[List[Tag]] = relationship()
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"), default=None)
    users_ids: Mapped[List[int]] = mapped_column(ForeignKey("users.id"))
    users: Mapped[List[User]] = relationship()
    admins_ids: Mapped[List[int]] = mapped_column(ForeignKey("users.id"))
    admins: Mapped[List["User"]] = relationship()
    messages: Mapped[List["Message"]] = relationship(order_by="desc(Message.created_at)", cascade="all, delete", default=[])


class Image(DBBase):
    __tablename__ = "images"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
