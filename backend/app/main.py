from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine
from app.routers import health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for clean startup and resource disposal."""
    # Startup logic
    yield
    # Gracefully dispose of SQLAlchemy engine connection pool on shutdown
    await engine.dispose()


app = FastAPI(
    title="LifeLink API",
    version="0.1.0",
    description="Real-Time Blood Availability & Donor Network Backend API",
    lifespan=lifespan,
)

# CORS Middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers (mounted at root and /api for convenience)
app.include_router(health.router)
app.include_router(health.router, prefix="/api")


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "LifeLink API is running",
        "docs_url": "/docs",
        "health_check": "/health",
    }
