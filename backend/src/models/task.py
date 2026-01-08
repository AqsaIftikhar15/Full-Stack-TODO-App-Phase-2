from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    user_id: uuid.UUID = Field(foreign_key="user.id")


class Task(TaskBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None


class TaskRead(TaskBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None