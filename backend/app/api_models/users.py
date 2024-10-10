from pydantic import BaseModel, Field



class UserShortInfo(BaseModel):
    id: int
    name: str
    image_id: int | None = Field(None)


class GetUsersResponse(BaseModel):
    users_info: list[UserShortInfo]


