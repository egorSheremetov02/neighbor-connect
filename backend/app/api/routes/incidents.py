from fastapi import APIRouter, Depends, HTTPException, Request
from app.api_models.incidents import (Incident as APIIncident, ListIncidentsResponse,
                                      CreateIncidentRequest, CreateIncidentResponse,
                                      DeleteIncidentRequest, DeleteIncidentResponse,
                                      EditIncidentDataRequest, EditIncidentDataResponse,
                                      AuthorizeIncidentRequest, AuthorizeIncidentResponse)
from fastapi.security import APIKeyHeader
import logging, sqlalchemy

from app.db_models.chats import User
from app.db_models.incidents import Incident
from app.core.db import SessionLocal
from app.api.util import jwt_token_required
from fastapi import HTTPException

logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
incidents_router = APIRouter()


@incidents_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def create_incident(request: Request, create_request: CreateIncidentRequest, user_payload=None) -> CreateIncidentResponse:
    sender_id = user_payload['user_id']

    if len(create_request.title) == 0:
        raise HTTPException(400, f'Incident title is missing')
    if len(create_request.description) == 0:
        raise HTTPException(400, f'Incident description is missing')

    with SessionLocal() as session:
        with session.begin():
            author = session.query(User).filter_by(id=sender_id).first()

            incident = Incident(
                title=create_request.title, 
                description=create_request.description, 
                author_id=sender_id,
                author=author
            )
            session.add(incident)

        return CreateIncidentResponse(id=incident.id)


@incidents_router.get("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
def list_incidents(request: Request, user_payload=None) -> ListIncidentsResponse:
    with SessionLocal() as session:
        with session.begin():
            incidents = session.query(Incident).all()

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


@incidents_router.delete("/{incident_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def delete_incident(request: Request, incident_id: int, user_payload=None) -> DeleteIncidentResponse:
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')

            if incident.author_id != sender_id:
                raise HTTPException(403, f'User doesn\'t have permission to delete this incident')

            session.delete(incident)

        return DeleteIncidentResponse()


@incidents_router.put("/{incident_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def edit_incident_data(request: Request, incident_id: int, edit_request: EditIncidentDataRequest, user_payload=None) -> EditIncidentDataResponse:
    sender_id = user_payload['user_id']

    if len(edit_request.title) == 0:
        raise HTTPException(400, f'Incident title is missing')
    if len(edit_request.description) == 0:
        raise HTTPException(400, f'Incident description is missing')

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')

            if incident.author_id != sender_id:
                raise HTTPException(403, f'User doesn\'t have permission to delete this incident')

            incident.title = edit_request.title
            incident.description = edit_request.description

        return EditIncidentDataResponse()


@incidents_router.post("/{incident_id}/authorize", dependencies=[Depends(security_scheme)])
@jwt_token_required
def authorize_incident(request: Request, incident_id: int, auth_request: AuthorizeIncidentRequest, user_payload=None) -> AuthorizeIncidentResponse:
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')

            if incident.author_id != sender_id:
                raise HTTPException(403, f'User doesn\'t have permission to authorize this incident')

            if auth_request.status not in ['verified', 'rejected']:
                raise HTTPException(400, f'Invalid status')

            incident.status = auth_request.status

        return AuthorizeIncidentResponse()
