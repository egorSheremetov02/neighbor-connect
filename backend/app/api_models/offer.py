from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Union


class Offer(BaseModel):
    id: int
    title: str
    description: str
    author_id: int
    date: datetime
    tags: list[str]
    image_id: int | None = Field(None)


class OfferVote(str, Enum):
    """
        OfferVote(str, Enum)

        An enumeration representing the possible voting options for an offer.

        Attributes
        ----------
        LIKE : str
            Indicates a 'like' vote for the offer.
        DISLIKE : str
            Indicates a 'dislike' vote for the offer.
    """
    LIKE = 'like'
    DISLIKE = 'dislike'


class OfferVoteRequest(BaseModel):
    vote: Union['OfferVote', None] = Field(None)


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


class AuthorizeOfferResponse(BaseModel):
    pass


class OfferIsLiked(BaseModel):
    is_liked: bool
