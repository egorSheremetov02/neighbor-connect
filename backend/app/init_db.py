from app.db_models.chats import User
from app.core.db import SessionLocal
from app.api.util import get_password_hash

def init_db():
    """
    Initializes the database with a test user.

    :return: None
    """
    with SessionLocal() as session:
        with session.begin():
            # This user is just for health check purposes
            password_hashed = get_password_hash("123456")
            session.merge(
                User(
                    id=0, 
                    name='Admin Adminovich',
                    email="admin@capstone.com",
                    login="admin",
                    password_hashed=password_hashed,
                    birthday="2021-01-01",
                    permanent_address="CUB Bremen",
                    image_id=None
                )
            )
