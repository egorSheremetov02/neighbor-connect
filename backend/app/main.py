import uvicorn
# set up loggers
from fastapi import FastAPI
from app.api.main import api_router
# importing db_models initializes all classes, so that when we `create_all`, it creates all tables
from app.db_models.chats import *
# configure project
from app.core.config import *
from app.core.db import DBBase, engine
from app.init_db import init_db

DBBase.metadata.create_all(engine)
init_db()
app = FastAPI()
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info")
