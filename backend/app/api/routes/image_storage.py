import io
import logging
import uuid
from typing import Optional, Annotated

from fastapi import APIRouter, Depends, Request, Query, UploadFile, HTTPException, File, Form
from fastapi.security import APIKeyHeader
from starlette.responses import StreamingResponse

from app.api.util import jwt_token_required, hidden_user_payload
from app.api_models.image_storage import StoreImageResponse, ImageType
from app.core.db import SessionLocal
from app.db_models.image_storage import Image

security_scheme = APIKeyHeader(name="Authorization", description="Bearer token")
image_storage_router = APIRouter()
logger = logging.getLogger(__name__)


@image_storage_router.post("/", dependencies=[Depends(security_scheme)])
@jwt_token_required
async def store_image(request: Request, file: Annotated[UploadFile, File()], image_type: Annotated[ImageType, Form()], user_payload=Depends(hidden_user_payload)) -> StoreImageResponse:
    sender_id = user_payload['user_id']
    image_contents = await file.read()
    # TODO crop image based on image_type and convert to png
    with SessionLocal() as session:
        with session.begin():
            uid = str(uuid.uuid4())
            image = Image(image=image_contents, random_id=uid, author_id=sender_id)
            image.uid = uid
            session.add(image)
        return StoreImageResponse(image_id=image.id)


@image_storage_router.get("/{image_id}", dependencies=[Depends(security_scheme)])
#@jwt_token_required
async def get_image(request: Request, image_id: int, user_payload=Depends(hidden_user_payload)) -> StreamingResponse:
    with SessionLocal() as session:
        with session.begin():
            image = session.query(Image.image).filter_by(id=image_id).first()
            if image is None:
                raise HTTPException(404, f'Image with id {image_id} does not exist')
            else:
                return StreamingResponse(content=io.BytesIO(image[0]), media_type="image/png")
