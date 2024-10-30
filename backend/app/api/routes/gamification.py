from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import APIKeyHeader
from app.api.util import jwt_token_required
from app.db_models.incidents import Incident, IncidentStatus
from app.core.db import SessionLocal

gamification_router = APIRouter()
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")

@gamification_router.get("/gamification/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def gamification_badge(request: Request, user_payload=None):
    """
    Returns a JSON response with the badge level based on the user's report count.

    :param request: The current request.
    :param user_payload: User data extracted from the JWT token.
    :return: JSON response with the "badge_type" field.
    """
    user_id = user_payload['user_id']

    # Open a session to query the list of incidents
    with SessionLocal() as session:
        with session.begin():
            # Retrieve a list of incidents created by the user that are not hidden
            incidents = session.query(Incident).filter(
                Incident.status != IncidentStatus.HIDDEN,
                Incident.author_id == user_id
            ).all()

            # Count the number of user's incidents
            reports_amount = len(incidents)

    # Determine badge type based on the number of incidents
    if reports_amount < 1:
        badge_type = "novice"
    elif 1 <= reports_amount < 3:
        badge_type = "experienced"
    elif 3 <= reports_amount < 7:
        badge_type = "advanced"
    else:
        badge_type = "legend"

    # Return JSON response with the badge_type field
    return {"badge_type": badge_type}
