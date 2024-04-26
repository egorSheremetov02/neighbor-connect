from fastapi import APIRouter

from app.api.routes import chats
from app.api.routes import incidents

api_router = APIRouter()


api_router.include_router(chats.chats_router, prefix="/chats", tags=["chats"])
api_router.include_router(incidents.incidents_router, prefix="/incidents", tags=["incidents"])