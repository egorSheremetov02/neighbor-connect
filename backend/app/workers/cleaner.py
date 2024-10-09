from sqlalchemy import select
from app.db_models.offer import OfferTag, offer_tag_association
from app.core.db import SessionLocal

async def clean_unused_offers_tags():
    with SessionLocal() as session:
        with session.begin():
            unused_tags_query = select(OfferTag).where(
                ~OfferTag.name.in_(
                    select(offer_tag_association.c.offer_tag_name)
                )
            )
            unused_tags = session.scalars(unused_tags_query).all()

            if unused_tags:
                for tag in unused_tags:
                    session.delete(tag)

            session.commit()


