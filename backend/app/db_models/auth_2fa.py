from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import mapped_column, Mapped
from datetime import datetime
from app.core.db import DBBase
from enum import Enum


class Auth2FactorSecret(DBBase):
    __tablename__ = "auth_2fa_secrets"
    id: int = Column(Integer, primary_key=True)
    secret_key: str = Column(String, nullable=False)
    state: str = Column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    created_at: datetime = Column(DateTime, default=datetime.utcnow)


class Auth2FactorSecretState(str, Enum):
    CONFIRMED = 'confirmed'
    PENDING = 'pending'

