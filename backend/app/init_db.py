from datetime import datetime
from app.db_models.chats import Chat, User
from app.core.db import SessionLocal


def init_db():
    """
    Initializes the database with a test user.

    :return: None
    """
    with SessionLocal.begin() as session:
        # This user is just for health check purposes
        test_user = User(id=0, name='Test user', email="aaaa@aaa.com", login="aaaaa", password_hashed="111111", birthday=datetime.now(),
                            additional_info="aaaa", address="aaaa")
        session.merge(test_user)
        session.flush()
        session.merge(Chat(id=0, name="Test chat", description="bbbbbbbbb", tags=[], users=[test_user], admins=[test_user]))
