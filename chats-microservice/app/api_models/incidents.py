from pydantic import BaseModel
from datetime import datetime


class Incident(BaseModel):
    pass


class ListIncidentsRequest(BaseModel):
    pass


class ListIncidentsResponse(BaseModel):
    incidents: list[Incident]


class CreateIncidentRequest(BaseModel):
    pass


class CreateIncidentResponse(BaseModel):
    pass


class DeleteIncidentRequest(BaseModel):
    pass


class DeleteIncidentResponse(BaseModel):
    pass


class EditIncidentDataRequest(BaseModel):
    pass


class EditIncidentDataResponse(BaseModel):
    pass


class AuthorizeIncidentRequest(BaseModel):
    pass


class AuthorizeIncidentResponse(BaseModel):
    pass