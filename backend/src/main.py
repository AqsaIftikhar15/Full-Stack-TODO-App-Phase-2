from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from .api.deps import get_db
from .core.config import settings
from .core.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    print("Initializing database tables...")
    SQLModel.metadata.create_all(bind=engine)
    print("Database tables initialized successfully!")
    yield
    # Shutdown: cleanup code would go here if needed


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.API_VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    # Include API routes
    from .api.api_v1.api import api_router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Register lifespan event handler
    app.lifespan = lifespan

    return app


app = create_app()