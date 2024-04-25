from fastapi import APIRouter, Depends, HTTPException
from app.api_models.incidents import (ListIncidentsRequest, ListIncidentsResponse,
                                  CreateIncidentRequest, CreateIncidentResponse,
                                  DeleteIncidentRequest, DeleteIncidentResponse,
                                  EditIncidentDataRequest, EditIncidentDataResponse,
                                  Incident as APIIncident, AuthorizeIncidentRequest, 
                                  AuthorizeIncidentResponse)
import logging, sqlalchemy

from app.db_models.chats import User
from app.db_models.incidents import Incident
from app.core.db import SessionLocal
from app.api.util import get_current_user_id, validate_tags, check_user_account_status
from fastapi import HTTPException

incidents_router = APIRouter()
logger = logging.getLogger(__name__)

@incidents_router.post("/")
def create_incident(request: CreateIncidentRequest) -> CreateIncidentResponse:
    sender_id = get_current_user_id()

    check_user_account_status(sender_id)

    if len(request.title) == 0:
        raise HTTPException(400, f'Incident title is missing')
    if len(request.description) == 0:
        raise HTTPException(400, f'Incident description is missing')
    if sender_id != request.author_id:
        raise HTTPException(400, f'Incident creator should be the same as the author')

    with SessionLocal() as session:
        with session.begin():
            author = session.query(User).filter_by(id=request.author_id).first()

            if author is None:
                raise HTTPException(400, f'User with id {author} does not exist')

            incident = Incident(title=request.title, description=request.description, author_id=request.author_id, author=author)
            session.add(author)

        return CreateIncidentResponse(id=incident.id)


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


@incidents_router.delete("/{incident_id}")
def delete_incident(incident_id: int, request: DeleteIncidentRequest) -> DeleteIncidentResponse:
    sender_id = get_current_user_id()

    check_user_account_status(sender_id)

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')
            
            if incident.author_id != sender_id:
                raise HTTPException(403, f'User doesn\'t have permission to delete this incident')

            session.delete(incident)

        return DeleteIncidentResponse()


@incidents_router.put("/{incident_id}")
def edit_incident_data(incident_id: int, request: EditIncidentDataRequest) -> EditIncidentDataResponse:
    sender_id = get_current_user_id()
    check_user_account_status(sender_id)

    if len(request.title) == 0:
        raise HTTPException(400, f'Incident title is missing')
    if len(request.description) == 0:
        raise HTTPException(400, f'Incident description is missing')
    if sender_id != request.author_id:
        raise HTTPException(400, f'Incident creator should be the same as the author')

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')
            
            if incident.author_id != sender_id:
                raise HTTPException(403, f'User doesn\'t have permission to delete this incident')

            incident.title = request.title
            incident.description = request.description

        return EditIncidentDataResponse()


@incidents_router.post("/{incident_id}/authorize")
def authorize_incident(incident_id: int, request: AuthorizeIncidentRequest) -> AuthorizeIncidentResponse:
    sender_id = get_current_user_id()
    check_user_account_status(sender_id)

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')
            
            if incident.author_id != sender_id:
                raise HTTPException(403, f'User doesn\'t have permission to delete this incident')

            if request.status not in ['verified', 'rejected']:
                raise HTTPException(400, f'Invalid status')

            incident.status = request.status

        return AuthorizeIncidentResponse()
