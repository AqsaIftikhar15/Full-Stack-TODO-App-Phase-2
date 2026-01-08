from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int