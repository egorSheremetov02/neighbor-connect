from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Double, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase

from app.db_models.chats import User

offer_tag_association = Table(
    "offer_tag_association_table",
    DBBase.metadata,
    Column("offer_id", ForeignKey("offers.id")),
    Column("offer_tag_name", ForeignKey("offers_tags.name")),
)


class Offer(DBBase):
    """
        class Offer(DBBase):
        Represents a Offer database model, inheriting from DBBase.

        Attributes
        ----------
        __tablename__ : str
            The name of the database table for this model.
        id : int
            The unique identifier for the Offer (Primary Key).
        title : str
            The title of the offer (Non-nullable).
        description : str
            A detailed description of the offer (Non-nullable).
        author_id : int
            The ID of the author associated with this offer (Foreign Key).
        date : datetime
            The date and time when the offer was created. Defaults to the current date and time.
        image_id : int or None
            The ID of the image associated with this offer (Foreign Key). Can be None.
        tags : List[OfferTag]
            A list of tags associated with this offer, managed by a relationship with a secondary table.
    """
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    date: datetime = Column(DateTime, default=datetime.utcnow)
    image_id: Mapped[int | None] = mapped_column(ForeignKey("images.id"))
    tags: Mapped[List["OfferTag"]] = relationship(secondary=offer_tag_association)

class OfferTag(DBBase):
    """
        class OfferTag(DBBase):

        OfferTag class represents the tags associated with an offer in the database.
        This class is a subclass of DBBase.

        Attributes
        ----------
        __tablename__ : str
            The name of the table in the database.
        name : sqlalchemy.Column
            The primary key column for the tag name.
    """
    __tablename__ = "offers_tags"
    name = Column(String, primary_key=True)



