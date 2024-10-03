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
def create_incident(request: Request, create_request: CreateIncidentRequest,
                    user_payload=None) -> CreateIncidentResponse:
    """
    :param request: Incoming HTTP request object
    :param create_request: Data required to create a new incident, containing title, description, created_at, and location
    :param user_payload: Payload containing user information, used here to extract the sender's user ID
    :return: Response object containing the ID of the newly created incident
    """
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
                author=author,
                status='pending',
                created_at=create_request.created_at,
                updated_at=create_request.created_at,
                location=create_request.location
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
                    updated_at=incident.updated_at,
                    location=incident.location
                )

            return ListIncidentsResponse(incidents=[to_pydantic(incident) for incident in incidents])


@incidents_router.delete("/{incident_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
def delete_incident(request: Request, incident_id: int, user_payload=None) -> DeleteIncidentResponse:
    """
    :param request: The HTTP request object.
    :param incident_id: The ID of the incident to be deleted.
    :param user_payload: The payload containing user information, with a default value of None.
    :return: An instance of DeleteIncidentResponse indicating the result of the delete operation.
    """
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
def edit_incident_data(request: Request, incident_id: int, edit_request: EditIncidentDataRequest,
                       user_payload=None) -> EditIncidentDataResponse:
    """
    :param request: The request object containing metadata about the request.
    :param incident_id: The unique identifier of the incident to be edited.
    :param edit_request: An object containing the new data for the incident including title, description, location, and updated_at values.
    :param user_payload: An optional payload that includes user information such as user_id. Defaults to None.
    :return: An `EditIncidentDataResponse` object indicating the result of the operation.
    """
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
            incident.location = edit_request.location
            incident.updated_at = edit_request.updated_at

        return EditIncidentDataResponse()


@incidents_router.post("/{incident_id}/authorize", dependencies=[Depends(security_scheme)])
@jwt_token_required
def authorize_incident(request: Request, incident_id: int, auth_request: AuthorizeIncidentRequest,
                       user_payload=None) -> AuthorizeIncidentResponse:
    """
    :param request: The request object containing the HTTP request details.
    :param incident_id: An integer representing the unique identifier of the incident to be authorized.
    :param auth_request: An object of type AuthorizeIncidentRequest containing the authorization request data.
    :param user_payload: A dictionary containing user-related data extracted from the JWT token. Default is None.
    :return: An instance of AuthorizeIncidentResponse indicating the result of the authorization process.
    """
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
