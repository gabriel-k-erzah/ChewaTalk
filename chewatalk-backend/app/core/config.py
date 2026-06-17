import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field


class Settings(BaseSettings):
    PROJECT_NAME: str = "ChewaTalk 2.0 API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Configurations
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "chewatalk_db"

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        """Constructs the SQLAlchemy connection string using Psycopg 3."""
        if self.DB_PASSWORD:
            return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        return f"postgresql+psycopg://{self.DB_USER}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Read from a .env file if it exists
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")


settings = Settings()