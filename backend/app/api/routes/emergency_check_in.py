from fastapi import APIRouter, Depends, HTTPException, Request, status, Response
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.db_models.chats import Chat, User, Message
from app.core.db import SessionLocal
from app.api.util import (
    jwt_token_required,
    hidden_user_payload
)
import app.api.db_util as db_util

emergency_router = APIRouter()
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")


class EmergencyStatusUpdate(BaseModel):
    receivers_ids: List[int]
    status: str


@emergency_router.post(
    "/",
    dependencies=[Depends(security_scheme)],
    status_code=status.HTTP_204_NO_CONTENT
)
@jwt_token_required
async def emergency_check_in(
    request: Request,
    emergency_update: EmergencyStatusUpdate,
    user_payload=Depends(hidden_user_payload)
):
    """Endpoint to send an emergency status update to specified users."""
    sender_id = user_payload["user_id"]

    with SessionLocal.begin() as session:
        sender = db_util.get_user(session=session, user_id=sender_id)
        if not sender:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sender does not exist."
            )

        # Validate receiver IDs
        invalid_receiver_ids = []
        for receiver_id in emergency_update.receivers_ids:
            receiver = db_util.get_user(session=session, user_id=receiver_id)
            if not receiver:
                invalid_receiver_ids.append(receiver_id)
            else:
                chat = db_util.get_or_create_dm_chat(session=session, user1=sender, user2=receiver)

                message_content = f"Emergency Status Update, my status is {emergency_update.status}"

                message = Message(
                    content=message_content,
                    author_id=sender_id,
                    chat_id=chat.id,
                )
                session.add(message)

        if invalid_receiver_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid receiver IDs: {invalid_receiver_ids}"
            )

    # On success, return HTTP 204 No Content
    return Response(status_code=status.HTTP_204_NO_CONTENT)