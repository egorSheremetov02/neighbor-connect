from pydantic import BaseModel, validator, Field

from datetime import datetime
from enum import Enum
from app.api_models.auth import UserResponse
from datetime import date

from app.api.constants import (
    MAX_BIO_HEADER_LENGTH,
    MAX_CHAT_DESCRIPTION_LENGTH, 
    MAX_TAGS_AMOUNT, 
    MAX_TAG_LENGTH
)


class Gender(str, Enum):
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'


class ModifyProfileRequest(BaseModel):
    fullName: str | None = Field(None)
    email: str | None = Field(None)
    login: str | None = Field(None)
    password: str | None = Field(None)
    permanent_address: str | None = Field(None)
    current_address: str | None = Field(None)
    gender: Gender | None = Field(None)
    phone_number: str | None = Field(None)
    birthday: date | None = Field(None)
    bio_header: str | None = Field(None)
    bio_description: str | None = Field(None)
    interests: list[str] | None = Field(None)

    # @validator('birthday')
    # def validate_birthday(cls, value):
    #     if value:
    #         try:
    #             birthday_date = datetime.strptime(value, "%Y-%m-%d")
    #             if birthday_date >= datetime.now():
    #                 raise ValueError("Birthday must be a date in the past")
    #         except ValueError:
    #             raise ValueError("Invalid date format for birthday, expected YYYY-MM-DD")
    #     return value

    @validator('bio_header')
    def validate_bio_header_length(cls, value):
        if value and len(value) > MAX_BIO_HEADER_LENGTH:
            raise ValueError(f"Bio header must be less than {MAX_BIO_HEADER_LENGTH} characters")
        return value

    @validator('bio_description')
    def validate_bio_description_length(cls, value):
        if value and len(value) > MAX_CHAT_DESCRIPTION_LENGTH:
            raise ValueError(f"Bio description must be less than {MAX_CHAT_DESCRIPTION_LENGTH} characters")
        return value

    @validator('interests')
    def validate_interests(cls, value):
        if value and len(value) > MAX_TAGS_AMOUNT:
            raise ValueError(f"Interests list cannot have more than {MAX_TAGS_AMOUNT} items")
        for interest in value:
            if len(interest) > MAX_TAG_LENGTH:
                raise ValueError(f"Each interest must be less than {MAX_TAG_LENGTH} characters")
        return value

class ModifyProfileResponse(BaseModel):
    message: str = "Profile updated successfully"

class ChangePasswordRequest(BaseModel):
    new_password: str

class ChangePasswordResponse(BaseModel):
    message: str = "Profile updated successfully"