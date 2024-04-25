from fastapi import APIRouter, Depends, HTTPException
from app.api_models.chats import (ListIncidentsRequest, ListIncidentsResponse,
                                  CreateIncidentRequest, CreateIncidentResponse,
                                  DeleteIncidentRequest, DeleteIncidentResponse,
                                  EditIncidentDataRequest, EditIncidentDataResponse,
                                  Incident as APIIncident, AuthorizeIncidentRequest, 
                                  AuthorizeIncidentResponse)
import logging, sqlalchemy

from app.db_models.chats import Incident
from app.core.db import SessionLocal
from app.api.util import get_current_user_id, validate_tags
from fastapi import HTTPException

incidents_router = APIRouter()
logger = logging.getLogger(__name__)


@incidents_router.post("/")
def create_incident(request: CreateIncidentRequest) -> CreateIncidentResponse:
    pass 


@incidents_router.get("/")
def list_incidents(request: ListIncidentsRequest) -> ListIncidentsResponse:
    sender_id = get_current_user_id()
    check_user_account_status(sender_id)

    with SessionLocal() as session:
        with session.begin():
            incidents = session.query(Incident).all()
            if not incidents:
                raise HTTPException(status_code=404, detail="No incidents found")
            
            def to_pydantic(incident: Incident) -> APIIncident:
                return APIIncident(
                    id=incident.id,
                    title=incident.title,
                    description=incident.description,
                    author_id=incident.author_id,
                    status=incident.status,
                    created_at=incident.created_at,
                    updated_at=incident.updated_at
                )
            
            return ListIncidentsResponse(incidents=[to_pydantic(incident) for incident in incidents])        


@incidents_router.delete("/")
def delete_incident(request: DeleteIncidentRequest) -> DeleteIncidentResponse:
    pass


@incidents_router.put("/")
def edit_incident_data(request: EditIncidentDataRequest) -> EditIncidentDataResponse:
    pass


@incidents_router.post("/authorize")
def authorize_incident(request: AuthorizeIncidentRequest) -> AuthorizeIncidentResponse:
    pass
