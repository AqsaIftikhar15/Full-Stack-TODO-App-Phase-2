from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
from enum import Enum


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: Optional[PriorityEnum] = PriorityEnum.medium
    due_date: Optional[datetime] = None
    reminder_config: Optional[dict] = None
    recurrence_rule: Optional[dict] = None


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None
    tags: Optional[List[str]] = []


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None
    reminder_config: Optional[dict] = None
    recurrence_rule: Optional[dict] = None
    status: Optional[str] = None


class TaskResponse(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    tags: Optional[List[str]]
    status: str = "pending"
    priority: Optional[PriorityEnum] = PriorityEnum.medium
    due_date: Optional[datetime] = None
    reminder_config: Optional[dict] = None
    recurrence_rule: Optional[dict] = None


class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int


class TaskFilterParams(BaseModel):
    priority: Optional[PriorityEnum] = None
    tag: Optional[str] = None
    status: Optional[str] = None
    due_date_from: Optional[datetime] = None
    due_date_to: Optional[datetime] = None
    sort_by: Optional[str] = "created_at"
    order: Optional[str] = "desc"


class TaskSearchResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int
    relevance_score: Optional[float] = None