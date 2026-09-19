from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or .env file."""

    SUPABASE_DB_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("SUPABASE_DB_URL", mode="before")
    @classmethod
    def assemble_async_db_connection(cls, v: str) -> str:
        if not isinstance(v, str):
            return v

        v = v.strip().strip("'\"")

        # Convert standard postgres URIs to asyncpg dialect
        if v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql+asyncpg://", 1)
        elif v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)

        # asyncpg accepts 'ssl' parameter rather than libpq's 'sslmode'
        if "sslmode=" in v:
            v = v.replace("sslmode=", "ssl=")

        # Supabase cloud hosts require SSL
        if ("supabase.co" in v or "supabase.com" in v) and "ssl=" not in v:
            separator = "&" if "?" in v else "?"
            v = f"{v}{separator}ssl=require"

        return v


settings = Settings()
