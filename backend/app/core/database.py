from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


# Configure async engine for Supabase Postgres
# statement_cache_size=0 ensures compatibility with PgBouncer / Supabase connection poolers
engine = create_async_engine(
    settings.SUPABASE_DB_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"statement_cache_size": 0},
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency yielding an async database session for FastAPI requests."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
