from app.db_models.chats import User
from app.core.db import SessionLocal


def init_db():
    """
    Initializes the database with a test user.

    :return: None
    """
    with SessionLocal() as session:
        with session.begin():
            # This user is just for health check purposes
            session.merge(User(id=0, name='Test user', email="aaaa@aaa.com", login="aaaaa", password_hashed="111111", birthday="2021-01-01",
                               additional_info="aaaa", address="aaaa", image_id=None))
