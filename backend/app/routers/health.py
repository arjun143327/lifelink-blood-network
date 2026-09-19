from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    database: str


class HealthErrorResponse(BaseModel):
    status: str
    database: str
    detail: str


@router.get(
    "/health",
    summary="Health check verifying application and database connectivity",
    response_model=HealthResponse,
    responses={
        200: {"model": HealthResponse, "description": "Database is reachable and responding"},
        503: {"model": HealthErrorResponse, "description": "Database is unreachable or misconfigured"},
    },
)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Verifies that the FastAPI application and Supabase/Postgres connection are functional."""
    try:
        # Test database connectivity by executing SELECT 1
        result = await db.execute(text("SELECT 1"))
        scalar_val = result.scalar()
        if scalar_val == 1:
            return HealthResponse(
                status="healthy",
                database="connected",
            )
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "unexpected response",
            },
        )
    except Exception as exc:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "detail": str(exc),
            },
        )
