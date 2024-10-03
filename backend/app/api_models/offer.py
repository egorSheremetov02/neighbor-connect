from pydantic import BaseModel
from datetime import datetime


class Offer(BaseModel):
    """
    Represents an offer entity with detailed information.

    Attributes:
        id (int): Unique identifier for the offer.
        title (str): Title of the offer.
        description (str): Description of the offer.
        author_id (int): Identifier of the author who created the offer.
        price (float): Price of the offer.
        product (str): The product associated with the offer.
        date (datetime): Date when the offer was created.
        image_id (int | None, optional): Optional image identifier associated with the offer. Default is None.
    """
    id: int
    title: str
    description: str
    author_id: int
    price: float
    product: str
    date: datetime
    image_id: int | None = None


class CreateOfferRequest(BaseModel):
    """
        CreateOfferRequest

        A data model representing a request to create an offer.

        Attributes
        ----------
        title : str
            The title of the offer.
        description : str
            A detailed description of the offer.
        price : float
            The price of the offer.
        product : str
            The product associated with the offer.
        date : datetime
            The date when the offer is created.
        image_id : int or None, optional
            The ID of the image associated with the offer, default is None.
    """
    title: str
    description: str
    price: float
    product: str
    date: datetime
    image_id: int | None = None


class CreateOfferResponse(BaseModel):
    offer_id: int


class EditOfferDataRequest(BaseModel):
    """
        Class representing the request data for editing an offer.

        Attributes
        ----------
        offer_id : int
            The unique identifier of the offer to be edited.
        title : str
            The new title of the offer.
        description : str
            The new description of the offer.
        price : float
            The new price of the offer.
        product : str
            The associated product of the offer.
        date : datetime
            The date of the offer.
        image_id : int, optional
            The unique identifier of the image associated with the offer, if any.
    """
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
    """

        Represents a response for listing offers.

        Attributes
        ----------
        offers : list[Offer]
            A list of offers returned in the response.
        next_page_id : int or None
            The identifier for the next page of results, if available.
    """
    offers: list[Offer]
    next_page_id: int | None
