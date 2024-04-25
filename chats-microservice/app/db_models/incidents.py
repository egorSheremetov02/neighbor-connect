from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, UniqueConstraint, asc
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.api_models.chats import Message as APIMessage
from app.core.db import DBBase


# Association tables


class Incident(DBBase):
    __tablename__ = "incidents"
    pass
