from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, mapped_column, Mapped

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


tag_chat_association_table = Table(
    "tag_chat_association_table",
    DBBase.metadata,
    Column("tag_name", ForeignKey("tags.name")),
    Column("chat_id", ForeignKey("chats.id")),
)


class Tag(DBBase):
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(primary_key=True)
    # name = Column(String, primary_key=True)


class Chat(DBBase):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags: Mapped[List[Tag]] = relationship(secondary=tag_chat_association_table)
    # image_id = Column(Integer, nullable=True) TODO
    # users: list[int]
