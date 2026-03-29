from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_NAME: str = "healthcare_db"
    APP_NAME: str = "Healthcare api"
    SECRET_KEY: str = "supersecret"

    class Config:
        env_file = ".env"


settings = Settings()