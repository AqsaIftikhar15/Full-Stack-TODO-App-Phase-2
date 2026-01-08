from sqlmodel import SQLModel, Field
from typing import Optional
import uuid


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)


class User(UserBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    is_active: bool = True


class UserCreate(UserBase):
    password: str
    email: str
    username: str


class UserRead(UserBase):
    id: uuid.UUID
    is_active: bool