from fastapi import APIRouter

from app.api.routes import chats

api_router = APIRouter()


api_router.include_router(chats.chats_router, prefix="/chats", tags=["chats"])
