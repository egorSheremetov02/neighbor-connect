from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Union


class Incident(BaseModel):
    """
    Incident(id: int, title: str, description: str, author_id: int, status: str, created_at: datetime,
             updated_at: datetime, location: str | None = None, image_id: int | None = None,
             votes: 'IncidentVotesData', user_vote: Union['IncidentVote', None] = None)

    A model representing an incident report in the system.

    Attributes
    ----------
    id : int
        The unique identifier of the incident.

    title : str
        The title of the incident.

    description : str
        A detailed description of the incident.

    author_id : int
        The ID of the user who reported the incident.

    status : str
        The current status of the incident.

    created_at : datetime
        The timestamp when the incident was created.

    updated_at : datetime
        The timestamp when the incident was last updated.

    location : str, optional
        The location where the incident occurred (default is None).

    image_id : int, optional
        The ID of the image associated with the incident (default is None).

    votes : IncidentVotesData
        The voting data related to the incident.

    user_vote : IncidentVote, optional
        The vote data of the current user for the incident (default is None).
    """
    id: int
    title: str
    description: str
    author_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    location: str | None = Field(None)
    image_id: int | None = Field(None)
    votes: 'IncidentVotesData'
    user_vote: Union['IncidentVote', None] = Field(None)


class IncidentVote(str, Enum):
    """
        IncidentVote(str, Enum)

        An enumeration representing the possible voting options for an incident.

        Attributes
        ----------
        LIKE : str
            Indicates a 'like' vote for the incident.
        DISLIKE : str
            Indicates a 'dislike' vote for the incident.
    """
    LIKE = 'like'
    DISLIKE = 'dislike'


class IncidentStatus(str, Enum):
    """
    IncidentStatus defines the various statuses that an incident can have.

    Attributes
    ----------
    PENDING : str
        Indicates that the incident is pending and has not been addressed yet.
    CONFIRMED : str
        Indicates that the incident has been confirmed and verified.
    HIDDEN : str
        Indicates that the incident is hidden and not visible in the normal listings.
    """
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    HIDDEN = 'hidden'


class IncidentVotesData(BaseModel):
    likes: int
    dislikes: int


class ListIncidentsResponse(BaseModel):
    incidents: list[Incident]


class IncidentVoteRequest(BaseModel):
    vote: Union['IncidentVote', None] = Field(None)


class CreateIncidentRequest(BaseModel):
    """
    Represents a request to create a new incident.

    Attributes:
        title (str): The title of the incident.
        description (str): Detailed description of the incident.
        created_at (datetime): The timestamp when the incident was created.
        updated_at (datetime | None): The timestamp when the incident was last updated, can be None.
        location (str): The location where the incident occurred.
        image_id (int | None): The ID of the associated image, can be None.
    """
    title: str
    description: str
    created_at: datetime
    updated_at: datetime | None = Field(None)
    location: str
    image_id: int | None = Field(None)


class CreateIncidentResponse(BaseModel):
    id: int


class DeleteIncidentRequest(BaseModel):
    pass


class DeleteIncidentResponse(BaseModel):
    pass


class EditIncidentDataRequest(BaseModel):
    """
        Represents a request to edit incident data.

        Attributes
        ----------
        title : str
            The title of the incident.
        description : str
            A detailed description of the incident.
        location : str
            The geographical location where the incident occurred.
        image_id : int | None, optional
            An identifier for an image related to the incident, if any (default is None).
        updated_at : datetime
            The timestamp when the incident data was last updated.
    """
    title: str
    description: str
    location: str
    image_id: int | None = Field(None)
    updated_at: datetime


class EditIncidentDataResponse(BaseModel):
    pass


class AuthorizeIncidentRequest(BaseModel):
    status: str


class AuthorizeIncidentResponse(BaseModel):
    pass


class IncidentIsLiked(BaseModel):
    is_liked: bool
