from pydantic import BaseModel
from datetime import datetime


class Incident(BaseModel):
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
