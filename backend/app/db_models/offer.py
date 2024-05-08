from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Double, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase

from app.db_models.chats import User


class Offer(DBBase):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    price = Column(Double, nullable=False)
    product = Column(String, nullable=False)
    date: datetime = Column(DateTime, default=datetime.utcnow)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))