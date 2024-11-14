from fastapi import APIRouter

# Import other routers
from app.api.routes import chats
from app.api.routes import incidents
from app.api.routes import auth
from app.api.routes import offer
from app.api.routes import image_storage
from app.api.routes import users
from app.api.routes import chatbot 

# Initialize the main API router
api_router = APIRouter()

# Include other routers
api_router.include_router(chats.chats_router, prefix="/chats", tags=["chats"])
api_router.include_router(incidents.incidents_router, prefix="/incidents", tags=["incidents"])
api_router.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(offer.offers_router, prefix="/offers", tags=["offers"])
api_router.include_router(image_storage.image_storage_router, prefix="/image_storage", tags=["image_storage"])
api_router.include_router(users.users_router, prefix="/users", tags=["users"])
api_router.include_router(chatbot.chatbot_router, prefix="/chatbot", tags=["chatbot"])
