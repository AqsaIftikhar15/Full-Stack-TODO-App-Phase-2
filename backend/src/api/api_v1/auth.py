from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
import uuid
from ...core.database import get_db
from ...models.user import UserCreate
from ...schemas.user import UserResponse, UserLogin, Token, LoginResponse
from ...repositories.user_repository import UserRepository
from ...utils.jwt import create_access_token, verify_password
from datetime import timedelta

router = APIRouter()


@router.post("/signup", response_model=UserResponse)
def signup(user_create: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.
    """
    user_repo = UserRepository(db)

    # Check if user with email already exists
    existing_user = user_repo.get_user_by_email(user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if user with username already exists
    existing_username = user_repo.get_user_by_username(user_create.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create the user
    user = user_repo.create_user(user_create)

    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        is_active=user.is_active
    )


@router.post("/login", response_model=LoginResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token and user data.
    """
    user_repo = UserRepository(db)
    user = user_repo.authenticate_user(user_login.email, user_login.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)  # 30 minutes expiry
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    # Create user response
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        is_active=user.is_active
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }


@router.post("/logout")
def logout():
    """
    Logout endpoint (client-side token removal is sufficient for JWT).
    """
    return {"message": "Logged out successfully"}