from sqlmodel import create_engine, Session
from typing import Generator
from .config import settings


# Create the database engine with proper connection pooling and SSL settings for Neon
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
)


def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session