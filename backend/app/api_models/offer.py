from pydantic import BaseModel, Field
from datetime import datetime


class Offer(BaseModel):
    id: int
    title: str
    description: str
    author_id: int
    date: datetime
    tags: list[str]
    image_id: int | None = Field(None)


class CreateOfferRequest(BaseModel):
    title: str
    description: str
    date: datetime | None = Field(None)
    tags: list[str]
    image_id: int | None = Field(None)



class CreateOfferResponse(BaseModel):
    offer_id: int


class EditOfferDataRequest(BaseModel):
    offer_id: int
    title: str
    description: str
    date: datetime | None = Field(None)
    tags: list[str]
    image_id: int | None = Field(None)


class EditOfferDataResponse(BaseModel):
    pass


class DeleteOfferRequest(BaseModel):
    offer_id: int


class DeleteOfferResponse(BaseModel):
    pass

class ListOffersResponse(BaseModel):
    offers: list[Offer]
    # next_page_id: int | None
