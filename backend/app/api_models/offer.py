from pydantic import BaseModel
from datetime import datetime


class Offer(BaseModel):
    id: int
    title: str
    description: str
    author_id: int
    price: float
    product: str
    date: datetime
    image_id: int | None = None


class CreateOfferRequest(BaseModel):
    title: str
    description: str
    price: float
    product: str
    date: datetime
    image_id: int | None = None


class CreateOfferResponse(BaseModel):
    offer_id: int


class EditOfferDataRequest(BaseModel):
    offer_id: int
    title: str
    description: str
    price: float
    product: str
    date: datetime
    image_id: int | None = None


class EditOfferDataResponse(BaseModel):
    pass


class DeleteOfferRequest(BaseModel):
    offer_id: int


class DeleteOfferResponse(BaseModel):
    pass


class ListOffersRequest(BaseModel):
    page_id: int | None = None


class ListOffersResponse(BaseModel):
    offers: list[Offer]
    next_page_id: int | None
