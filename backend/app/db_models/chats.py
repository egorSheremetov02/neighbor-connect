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
    """
        User
        ----
        Represents a user entity in the database.

        Attributes
        ----------
        __tablename__ : str
            Name of the database table.
        id : Integer
            Primary key for the user table.
        name : String
            Name of the user. Default is "Test user".
        email : String
            Email of the user. Cannot be null.
        login : String
            Login identifier for the user. Cannot be null.
        password_hashed : String
            Hashed password for the user. Cannot be null.
        birthday : String
            Birthday of the user. Cannot be null.
        additional_info : String
            Any additional information about the user. Can be null.
        address : String
            Address of the user. Cannot be null.
        chats : Mapped[List["Chat"]]
            List of chats the user is part of. Many-to-many relationship.
        chats_in_administration : Mapped[List["Chat"]]
            List of chats the user administrates. Many-to-many relationship.
    """
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Test user", nullable=False)
    email = Column(String, nullable=False)
    login = Column(String, nullable=False)
    password_hashed = Column(String, nullable=False)
    birthday = Column(String, nullable=False)
    additional_info = Column(String, nullable=True)
    address = Column(String, nullable=False)
    chats: Mapped[List["Chat"]] = relationship(secondary=user_chat_association, back_populates="users")
    chats_in_administration: Mapped[List["Chat"]] = relationship(secondary=user_chat_administration_association, back_populates="admins")


class Message(DBBase):
    """
        Message database model representing a message in a chat application.

        Attributes:
            __tablename__ (str): Name of the database table.
            id (int): Primary key for the message record.
            content (str): Content of the message.
            image_id (int | None): Foreign key referencing the image associated with the message.
            author_id (int): Foreign key referencing the author of the message.
            author (User): Relationship to the User model.
            created_at (datetime): Timestamp when the message was created.
            chat_id (int): Foreign key referencing the chat to which the message belongs.
    """
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
    """
        Class representing a Chat entity in the database.

        Attributes
        ----------
        __tablename__ : str
            Name of the table in the database.
        id : Mapped[int]
            Unique identifier for each chat, primary key.
        name : sqlalchemy.Column
            Name of the chat, not nullable.
        description : sqlalchemy.Column
            Optional description of the chat.
        tags : Mapped[List[Tag]]
            List of tags associated with the chat, many-to-many relationship.
        image_id : Mapped[int | None]
            Foreign key referring to an image associated with the chat, can be null.
        users : Mapped[List["User"]]
            List of users participating in the chat, many-to-many relationship.
        admins : Mapped[List["User"]]
            List of users who are administrators of the chat, many-to-many relationship.
        messages : Mapped[List["Message"]]
            List of messages in the chat, ordered by creation time in ascending order.
    """
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
