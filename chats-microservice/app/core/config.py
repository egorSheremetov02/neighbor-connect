from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_PASSWORD: str = ''
    DB_USER: str = 'postgres'
    DB_HOSTNAME: str = 'localhost'
    DB_PORT: int = 5432
    DB_NAME: str = 'postgres'


settings = Settings()
