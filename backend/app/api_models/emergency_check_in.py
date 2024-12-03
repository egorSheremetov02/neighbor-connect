from pydantic import BaseModel

class EmergencyStatusUpdate(BaseModel):
    # user to redirect the status to
    receievers_ids: list[int]
    status: str