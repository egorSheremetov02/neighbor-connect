from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Double, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase

from app.db_models.chats import User


class Offer(DBBase):
    """
    Defines the `Offer` class representing a database model for storing offer details.

    Classes:
        Offer: A model for representing an offer in the database.

    Attributes:
        __tablename__: The name of the database table.
        id: The unique identifier for the offer.
        title: The title of the offer.
        description: The detailed description of the offer.
        author_id: The foreign key linking to the user who authored the offer.
        price: The price of the offer.
        product: The product associated with the offer.
        date: The datetime when the offer was created, defaults to the current UTC time.
        image_id: The foreign key linking to the image associated with the offer, if any.
    """
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    price = Column(Double, nullable=False)
    product = Column(String, nullable=False)
    date: datetime = Column(DateTime, default=datetime.utcnow)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))