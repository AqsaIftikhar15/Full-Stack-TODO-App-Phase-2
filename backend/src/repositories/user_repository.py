from sqlmodel import Session, select
from typing import Optional
import uuid
from ..models.user import User, UserCreate
from ..utils.jwt import get_password_hash


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_user(self, user_create: UserCreate) -> User:
        """Create a new user in the database."""
        hashed_password = get_password_hash(user_create.password)
        user = User(
            email=user_create.email,
            username=user_create.username,
            hashed_password=hashed_password
        )
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        """Get a user by ID."""
        return self.session.get(User, user_id)

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email."""
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get a user by username."""
        statement = select(User).where(User.username == username)
        return self.session.exec(statement).first()

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password."""
        user = self.get_user_by_email(email)
        if not user or not user.is_active:
            return None

        # Assuming we have a verify_password function in utils.jwt
        from ..utils.jwt import verify_password
        if not verify_password(password, user.hashed_password):
            return None

        return user