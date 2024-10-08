from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.dialects.postgresql import BYTEA
from sqlalchemy.orm import mapped_column, Mapped

from app.core.db import DBBase


class Image(DBBase):
    __tablename__ = "images"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    random_id = Column(String, unique=True, index=True, nullable=False)
    image = Column(BYTEA, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))



