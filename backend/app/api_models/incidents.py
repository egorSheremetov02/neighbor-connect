from pydantic import BaseModel
from datetime import datetime


class Incident(BaseModel):
    """
    Incident class representing an incident report in the system.

    Attributes
    ----------
    id : int
        Unique identifier for the incident.
    title : str
        Title of the incident.
    description : str
        Detailed description of the incident.
    author_id : int
        Identifier for the author who reported the incident.
    status : str
        Current status of the incident (e.g., 'open', 'closed').
    created_at : datetime
        Timestamp when the incident was created.
    updated_at : datetime
        Timestamp when the incident was last updated.
    location : str | None, optional
        Location where the incident occurred.
    image_id : int | None, optional
        Identifier for the image associated with the incident.
    """
    id: int
    title: str
    description: str
    author_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    location: str | None = None
    image_id: int | None = None


class ListIncidentsResponse(BaseModel):
    incidents: list[Incident]


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
    updated_at: datetime | None = None
    location: str
    image_id: int | None = None


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
    image_id: int | None = None
    updated_at: datetime


class EditIncidentDataResponse(BaseModel):
    pass


class AuthorizeIncidentRequest(BaseModel):
    status: str


class AuthorizeIncidentResponse(BaseModel):
    pass
