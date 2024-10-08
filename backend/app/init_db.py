from app.db_models.chats import Chat, User
from app.core.db import SessionLocal
from app.api.util import get_password_hash


def init_db():
    """
    Initializes the database with a test user.

    :return: None
    """
    with SessionLocal.begin() as session:
        password_hashed = get_password_hash("123456")
        # This user is just for health check purposes
        test_user = User(
            id=0,
            name="Admin Adminovich",
            email="admin@capstone.com",
            login="admin",
            password_hashed=password_hashed,
            birthday="2021-01-01",
            permanent_address="CUB Bremen",
            image_id=None,
        )
        session.merge(test_user)
        session.flush()
        session.merge(
            Chat(
                id=0,
                name="Test chat",
                description="bbbbbbbbb",
                tags=[],
                users=[test_user],
                admins=[test_user],
            )
        )
