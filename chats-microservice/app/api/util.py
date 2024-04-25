import re
from fastapi import HTTPException


def get_current_user_id() -> int:
    return 1


MAX_TAG_LENGTH = 64


def validate_tags(tags: list[str]) -> None:
    for tag in tags:
        if len(tag) == 0 or len(tag) > MAX_TAG_LENGTH:
            raise HTTPException(400, f'Length of tag \'{tag}\' should be in range [1 .. {MAX_TAG_LENGTH}]')
        if re.fullmatch('[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9]', tag) is None:
            raise HTTPException(400, f'Tag \'{tag}\' does not match the format')

def check_user_permission(user_id: int) -> None:
    if user_id == 0:
        raise HTTPException(403, f'User does not have permission to create chats')

def check_image_exists(image_id: int) -> None:
    # some logic
    if image_id == -1:
        raise HTTPException(400, f'Image does not uploaded to images storage')
