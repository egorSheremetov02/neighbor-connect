from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class Gen2FaStatus(str, Enum):
    SUCCESS = 'success'
    OUTDATED = 'outdated'


class Generate2FaRequest(BaseModel):
    pass


class Generate2FaResponse(BaseModel):
    provisioning_uri: str   # encode to qr code


class Gen2FaState(str, Enum):
    EMPTY = 'empty'
    CREATED = 'created'

class Get2FaStateResponse(BaseModel):
    state: Gen2FaState

class Confirm2FaGenerationRequest(BaseModel):
    code: str



class Confirm2FaGenerationResponse(BaseModel):
    status: Gen2FaStatus