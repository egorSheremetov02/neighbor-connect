import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.config import *
from app.core.db import DBBase, engine
from app.init_db import init_db

DBBase.metadata.create_all(engine)
init_db()

app = FastAPI()

# Configure CORS settings
origins = [
    "http://localhost:5173",  # Add your frontend origin here
    # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include your router
app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info")
