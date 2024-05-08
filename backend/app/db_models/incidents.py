from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase

from app.db_models.chats import User


class Incident(DBBase):
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