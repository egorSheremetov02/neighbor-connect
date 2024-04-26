from pydantic import BaseModel
from datetime import datetime


class Incident(BaseModel):
    id: int 
    title: str 
    description: str 
    author_id: int 
    status: str 
    created_at: datetime 
    updated_up: datetime


class ListIncidentsResponse(BaseModel):
    incidents: list[Incident]


class CreateIncidentRequest(BaseModel):
    title: str
    description: str 
    author_id: int 



class CreateIncidentResponse(BaseModel):
    id: int 


class DeleteIncidentRequest(BaseModel):
    pass


class DeleteIncidentResponse(BaseModel):
    pass


class EditIncidentDataRequest(BaseModel):
    title: str
    description: str 
    author_id: int 


class EditIncidentDataResponse(BaseModel):
    pass


class AuthorizeIncidentRequest(BaseModel):
    status: str


class AuthorizeIncidentResponse(BaseModel):
    pass