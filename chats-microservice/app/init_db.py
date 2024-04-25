from app.db_models.chats import Chat, Tag, User
from app.core.db import SessionLocal


def init_db():
    with SessionLocal() as session:
        with session.begin():
            session.merge(User(id=0))