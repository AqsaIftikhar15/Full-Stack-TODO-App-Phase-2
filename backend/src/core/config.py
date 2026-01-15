from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "Todo Backend API"
    API_V1_STR: str = "/api/v1"
    API_VERSION: str = "1.0.0"
    BACKEND_CORS_ORIGINS: List[str] = []
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()

# Parse CORS origins from environment variable if it's a string
if os.getenv("ALLOWED_ORIGINS"):
    # Split comma-separated origins and convert to list
    origins_str = os.getenv("ALLOWED_ORIGINS", "")
    settings.BACKEND_CORS_ORIGINS = [origin.strip() for origin in origins_str.split(",") if origin.strip()]