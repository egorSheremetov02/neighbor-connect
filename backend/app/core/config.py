from pydantic_settings import BaseSettings
import logging


class Settings(BaseSettings):
    """
    This class defines the settings configuration for database connection.

    Attributes:
        DB_PASSWORD (str): The password for the database connection. Default is an empty string.
        DB_USER (str): The username for the database connection. Default is 'postgres'.
        DB_HOSTNAME (str): The hostname for the database connection. Default is 'localhost'.
        DB_PORT (int): The port number for the database connection. Default is 5432.
        DB_NAME (str): The name of the database. Default is 'postgres'.
    """
    DB_PASSWORD: str = ''
    DB_USER: str = 'postgres'
    DB_HOSTNAME: str = 'localhost'
    DB_PORT: int = 5432
    DB_NAME: str = 'postgres'


FORMAT = '[%(levelname)s | %(name)s | %(asctime)s] %(message)s'
logging.basicConfig(encoding='utf-8', level=logging.DEBUG, format=FORMAT, datefmt='%Y-%m-%d %H:%M:%S')

settings = Settings()
