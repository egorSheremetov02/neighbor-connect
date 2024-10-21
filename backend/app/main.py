import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.config import *
from app.core.db import DBBase, engine
from app.init_db import init_db
import json
import os

DBBase.metadata.create_all(engine)
init_db()

app = FastAPI()

# Configure CORS settings
origins = [
    "http://localhost:8000",  # Add your frontend domain or localhost port
    "http://localhost:8080",  # If running on 8080 or any other relevant port
    "null",  # For local file requests with no origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TODO: replace on origins when we will deploy project
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your router
app.include_router(api_router)


os.makedirs('../schema/', exist_ok=True)
with open('../schema/schema.json', 'w') as file:
    json.dump(app.openapi(), file, indent=4)


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info")
