from enum import Enum

from pydantic import BaseModel


class ImageType(Enum):
    image = 'image'
    avatar = 'avatar'


class StoreImageRequest(BaseModel):
    type: ImageType


class StoreImageResponse(BaseModel):
    image_id: str

class GetImageResponse(BaseModel):
    image_id: str

