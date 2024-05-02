from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped, backref
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase


user_chat_association = Table(
    "user_chat_association_table",
    DBBase.metadata,
    Column("user_id", ForeignKey("users.id")),
    Column("chat_id", ForeignKey("chats.id")),
)

tag_chat_association = Table(
    "tag_chat_association_table",
    DBBase.metadata,
    Column("tag_name", ForeignKey("tags.name")),
    Column("chat_id", ForeignKey("chats.id")),
    UniqueConstraint('tag_name', 'chat_id', name='unique_tag_chat')
)

user_chat_administration_association = Table(
    "user_chat_administration_association_table",
    DBBase.metadata,
    Column("user_id", ForeignKey("users.id")),
    Column("chat_id", ForeignKey("chats.id")),
    UniqueConstraint('chat_id', 'user_id', name='unique_chat_user')
)


class User(DBBase):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Test user", nullable=False)
    chats: Mapped[List["Chat"]] = relationship(secondary=user_chat_association, back_populates="users")
    chats_in_administration: Mapped[List["Chat"]] = relationship(secondary=user_chat_administration_association, back_populates="admins")


class Message(DBBase):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship()
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"))


class Tag(DBBase):
    __tablename__ = "tags"
    name: Mapped[str] = mapped_column(primary_key=True, index=True)


class Chat(DBBase):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags: Mapped[List[Tag]] = relationship(secondary=tag_chat_association)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    users: Mapped[List["User"]] = relationship(secondary=user_chat_association, back_populates="chats")
    admins: Mapped[List["User"]] = relationship(secondary=user_chat_administration_association, back_populates="chats_in_administration")
    messages: Mapped[List["Message"]] = relationship(order_by="asc(Message.created_at)")



class Image(DBBase):
    __tablename__ = "images"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
