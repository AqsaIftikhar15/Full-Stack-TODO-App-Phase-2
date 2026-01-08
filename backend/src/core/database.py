from sqlmodel import create_engine, Session
from typing import Generator
from .config import settings


# Create the database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
)


def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session