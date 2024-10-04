import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.db import DBBase
from unittest.mock import patch

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=True)
def override_session():
    global SessionLocal
    SessionLocal = TestingSessionLocal


@pytest.fixture(scope="function")
def client():
    DBBase.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    DBBase.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function", autouse=True)
def mock_jwt_dependency():
    with patch("app.api.util.jwt_token_required") as mock_jwt:
        mock_jwt.return_value = {
            'user_id': 6  # Simulate a user ID
        }
        yield
