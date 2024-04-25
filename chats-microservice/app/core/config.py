from pydantic_settings import BaseSettings
import logging


class Settings(BaseSettings):
    DB_PASSWORD: str = ''
    DB_USER: str = 'postgres'
    DB_HOSTNAME: str = 'localhost'
    DB_PORT: int = 5432
    DB_NAME: str = 'postgres'


FORMAT = '[%(levelname)s | %(name)s | %(asctime)s] %(message)s'
logging.basicConfig(encoding='utf-8', level=logging.DEBUG, format=FORMAT, datefmt='%Y-%m-%d %H:%M:%S')

settings = Settings()
