import secrets
from pydantic_settings import BaseSettings
from pydantic import field_validator, model_validator
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Barber Reservation System"
    DEBUG: bool = False
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/barberco"

    # Security - no default, must be set via environment variable
    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS - comma-separated string, e.g. "https://frontend.railway.app,http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_database_url(cls, v: str) -> str:
        # Railway uses postgres:// but SQLAlchemy 2.0 requires postgresql://
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    @model_validator(mode="after")
    def validate_secret_key(self) -> "Settings":
        if not self.SECRET_KEY:
            if self.DEBUG:
                # Generate a random key for development (warning: sessions won't persist across restarts)
                self.SECRET_KEY = secrets.token_urlsafe(32)
            else:
                raise ValueError("SECRET_KEY environment variable is required in production (DEBUG=false)")
        return self

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS string into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
