from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase

from app.db_models.chats import User


class Incident(DBBase):
    """
        Represents an incident report within the database.

        Attributes:
            __tablename__ (str): Name of the database table.
            id (Column): Primary key identifier for the incident.
            title (Column): Title of the incident, cannot be null.
            description (Column): Description of the incident, cannot be null.
            author_id (Mapped[int]): Foreign key linking to the author's user ID.
            author (Mapped["User"]): Relationship mapping to the User entity.
            status (Column): Current status of the incident, defaults to 'pending'.
            created_at (datetime): Timestamp when the incident was created, defaults to the current time.
            updated_at (datetime): Timestamp when the incident was last updated, defaults to the current time.
            location (Column): Location of the incident, can be null.
            image_id (Mapped[int | None]): Foreign key linking to an associated image ID, can be null.
    """
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship()
    status = Column(String, default="pending")
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow)
    location = Column(String, nullable=True)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))