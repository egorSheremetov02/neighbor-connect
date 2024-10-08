from fastapi import APIRouter

from app.api.routes import chats
from app.api.routes import incidents
from app.api.routes import auth
from app.api.routes import offer
from app.api.routes import users

api_router = APIRouter()


api_router.include_router(chats.chats_router, prefix="/chats", tags=["chats"])
api_router.include_router(incidents.incidents_router, prefix="/incidents", tags=["incidents"])
api_router.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(offer.offers_router, prefix="/offers", tags=["offers"])
api_router.include_router(users.users_router, prefix="/users", tags=["users"])