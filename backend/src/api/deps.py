from fastapi import Depends, HTTPException, status, Request
from sqlmodel import Session
from typing import Generator, Optional
from jose import jwt, JWTError
from datetime import datetime
import uuid
from ..core.database import get_db as get_db_session
from ..core.config import settings
from ..models.user import User
from ..utils.jwt import verify_token


def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    with get_db_session() as session:
        yield session


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Dependency to get current user from JWT token"""
    token_header = request.headers.get("Authorization")
    if not token_header or not token_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = token_header.split(" ")[1]
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(User, uuid.UUID(user_id))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user