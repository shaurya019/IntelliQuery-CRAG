from pathlib import Path

from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    APP_NAME: str = "IntelliQuery CRAG Backend"
    API_V1_PREFIX: str = "/api/v1"
    AWS_REGION: str = "ap-south-1"
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None

    DYNAMODB_USERS_TABLE: str
    DYNAMODB_DOCUMENTS_TABLE: str
    DYNAMODB_CHATS_TABLE: str

    class Config:
        env_file = ENV_FILE
        env_file_encoding = "utf-8"


settings = Settings()
