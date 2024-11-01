from fastapi import APIRouter, Depends, Request
from app.api_models.incidents import (Incident as APIIncident, ListIncidentsResponse,
                                      CreateIncidentRequest, CreateIncidentResponse,
                                      DeleteIncidentResponse, EditIncidentDataRequest,
                                      EditIncidentDataResponse, AuthorizeIncidentRequest,
                                      AuthorizeIncidentResponse, IncidentStatus, IncidentVote,
                                      IncidentVoteRequest, IncidentVotesData, IncidentIsLiked)
from fastapi.security import APIKeyHeader
import logging
import sqlalchemy
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db_models.chats import User
from app.db_models.incidents import Incident, IncidentVote as IncidentVoteDB
from app.core.db import SessionLocal
from app.api.util import jwt_token_required, hidden_user_payload
from fastapi import HTTPException

logger = logging.getLogger(__name__)
security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
incidents_router = APIRouter()


@incidents_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def create_incident(request: Request, create_request: CreateIncidentRequest,
                    user_payload=Depends(hidden_user_payload)) -> CreateIncidentResponse:
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
            if not create_request.anonymous:
                author_id = sender_id
                author = session.query(User).filter_by(id=sender_id).first()
            else:
                author_id = None
                author = None

            incident = Incident(
                title=create_request.title,
                description=create_request.description,
                author_id=author_id,
                author=author,
                status=IncidentStatus.CONFIRMED,  # TODO: add pending status when will check admin permissions
                created_at=create_request.created_at,
                updated_at=create_request.created_at,
                location=create_request.location,
                image_id=create_request.image_id
            )
            session.add(incident)

        return CreateIncidentResponse(id=incident.id)


def get_votes_for_incidents(session: Session, incident_ids: list[int] | None = None):
    # Base query for counting votes and checking if incident is not hidden
    query = session.query(
        IncidentVoteDB.incident_id,
        func.sum(sqlalchemy.case((IncidentVoteDB.vote == 'like', 1), else_=0)).label('likes'),
        func.sum(sqlalchemy.case((IncidentVoteDB.vote == 'dislike', 1), else_=0)).label('dislikes')
    ).join(
        Incident, Incident.id == IncidentVoteDB.incident_id
    ).filter(Incident.status != 'hidden')

    # If specific incident_ids are provided, filter by them
    if incident_ids is not None:
        query = query.filter(IncidentVoteDB.incident_id.in_(incident_ids))

    # Group by incident_id
    vote_counts = query.group_by(IncidentVoteDB.incident_id).all()

    # Convert result to a dictionary
    results = {incident_id: {'likes': likes, 'dislikes': dislikes} for incident_id, likes, dislikes in vote_counts}

    return results

def get_votes_for_user_incidents(session: Session, user_id: int, incident_ids: list[int] | None = None):
    query = session.query(
        IncidentVoteDB.incident_id,
        IncidentVoteDB.vote
    ).filter(
        IncidentVoteDB.user_id == user_id  # Filter by user ID
    )

    if incident_ids is not None:
        query = query.filter(IncidentVoteDB.incident_id.in_(incident_ids))

    # Fetch all votes for the user
    user_votes = query.all()

    # Process the results into a dictionary with incident_id as key and vote as value
    results = {incident_id: vote for incident_id, vote in user_votes}

    return results

@incidents_router.get("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def list_incidents(request: Request, user_payload=Depends(hidden_user_payload)) -> ListIncidentsResponse:

    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            incidents = session.query(Incident).filter(Incident.status != IncidentStatus.HIDDEN).all()
            votes = get_votes_for_incidents(session, incident_ids = None)
            user_votes = get_votes_for_user_incidents(session, sender_id, incident_ids = None)

            result = []

            for incident in incidents:
                incident_votes = votes.get(incident.id, {'likes': 0, 'dislikes': 0})
                user_vote = user_votes.get(incident.id, None)
                result.append(
                    APIIncident(
                        id=incident.id,
                        title=incident.title,
                        description=incident.description,
                        author_id=incident.author_id,
                        status=incident.status,
                        created_at=incident.created_at,
                        updated_at=incident.updated_at,
                        location=incident.location,
                        votes = IncidentVotesData(likes= incident_votes.get('likes'), dislikes=incident_votes.get('dislikes')),
                        user_vote = user_vote
                    ))

            return ListIncidentsResponse(incidents=result)


@incidents_router.delete("/{incident_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def delete_incident(request: Request, incident_id: int, user_payload=Depends(hidden_user_payload)) -> DeleteIncidentResponse:
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

            incident.status = IncidentStatus.HIDDEN

        return DeleteIncidentResponse()


@incidents_router.put("/{incident_id}", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def edit_incident_data(request: Request, incident_id: int, edit_request: EditIncidentDataRequest,
                       user_payload=Depends(hidden_user_payload)) -> EditIncidentDataResponse:
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

def is_admin(user_id: int) -> bool:
    return True

@incidents_router.post("/{incident_id}/authorize", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def authorize_incident(request: Request, incident_id: int, auth_request: AuthorizeIncidentRequest,
                       user_payload=Depends(hidden_user_payload)) -> AuthorizeIncidentResponse:
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

            if incident.author_id != sender_id and is_admin(sender_id):
                raise HTTPException(403, f'User doesn\'t have permission to authorize this incident')

            incident.status = auth_request.status

        return AuthorizeIncidentResponse()


@incidents_router.put("/{incident_id}/vote", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def incident_vote(request: Request, incident_id: int, vote_request: IncidentVoteRequest,
                        user_payload=Depends(hidden_user_payload)) -> AuthorizeIncidentResponse:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    incident_id : int
        The unique identifier of the incident to vote on.
    vote_request : IncidentVoteRequest
        The request body containing the user's vote.
    user_payload : dict, optional
        The payload containing user information extracted from the JWT token (default is None).

    Returns
    -------
    AuthorizeIncidentResponse
        Response indicating the result of the voting action.

    Raises
    ------
    HTTPException
        If the incident with the specified ID does not exist.
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')

            user_vote = session.query(IncidentVoteDB).filter_by(incident_id=incident_id, user_id=sender_id).first()

            if user_vote is None:
                if vote_request.vote:
                    user_vote = IncidentVoteDB(user_id=sender_id, incident_id=incident_id, vote=vote_request.vote)
                    session.add(user_vote)
            else:
                if vote_request.vote is None:
                    session.delete(user_vote)
                else:
                    user_vote.vote = vote_request.vote

        return AuthorizeIncidentResponse()


@incidents_router.get("/{incident_id}/vote", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def get_incident_vote(request: Request, incident_id: int, user_payload=Depends(hidden_user_payload)
                            ) -> IncidentIsLiked:
    """
    Parameters
    ----------
    request : Request
        The HTTP request object.
    incident_id : int
        The unique identifier of the incident to vote on.
    user_payload : dict, optional
        The payload containing user information extracted from the JWT token (default is None).

    Returns
    -------
    AuthorizeIncidentResponse
        Response indicating the result whether the incident is liked.

    Raises
    ------
    HTTPException
        If the incident with the specified ID does not exist.
    """
    sender_id = user_payload['user_id']

    with SessionLocal() as session:
        with session.begin():
            incident = session.query(Incident).filter_by(id=incident_id).first()

            if incident is None:
                raise HTTPException(404, f'Incident with id {incident_id} does not exist')

            user_vote = session.query(IncidentVoteDB).filter_by(incident_id=incident_id, user_id=sender_id).first()

            if user_vote is None:
                IncidentIsLiked(is_liked=False)

            return IncidentIsLiked(is_liked=user_vote.vote == 'like')
