from dotenv import load_dotenv

path_to_env_file = './.env'
load_dotenv(path_to_env_file)

import uvicorn

# from app.clients.open_ai import open_ai_client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.config import *
from app.core.db import DBBase, engine
from app.init_db import init_db
import json
import os
<<<<<<< HEAD
=======

>>>>>>> 704ecf847dfdf1db5ea2bca258fd81379080e50f

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


@app.on_event("startup")
def save_openapi_json():
    openapi_data = app.openapi()
    os.makedirs('../schema/', exist_ok=True)
    with open("../schema/openapi.json", "w") as file:
        json.dump(openapi_data, file, indent=4)


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info")
