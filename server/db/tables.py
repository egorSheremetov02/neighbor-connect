from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    bio = Column(Text)

    incidents = relationship('Incident', back_populates='user')


class Incident(Base):
    __tablename__ = 'Incident'

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(Integer, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey('User.id'))

    user = relationship('User', back_populates='incidents')