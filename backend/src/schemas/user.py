from pydantic import BaseModel
from typing import Optional
import uuid


class UserBase(BaseModel):
    email: str
    username: str


class UserCreate(UserBase):
    password: str
    email: str
    username: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[uuid.UUID] = None