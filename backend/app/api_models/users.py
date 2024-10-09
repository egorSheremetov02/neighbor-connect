from pydantic import BaseModel



class UserShortInfo(BaseModel):
    id: int
    name: str
    image_id: int | None


class GetUsersResponse(BaseModel):
    users_info: list[UserShortInfo]


