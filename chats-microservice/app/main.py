import uvicorn
from fastapi import FastAPI
from app.api.main import api_router
# importing db_models initializes all classes, so that when we `create_all`, it creates all tables
from app.db_models.chats import *
from app.core.db import DBBase, engine

DBBase.metadata.create_all(engine)
app = FastAPI()
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info")
