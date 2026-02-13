from sqlmodel import SQLModel, Field
from typing import Optional, List, Union, Dict, Any
import uuid
from datetime import datetime
from enum import Enum
import json


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    user_id: uuid.UUID = Field(foreign_key="user.id")
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    due_date: Optional[datetime] = Field(default=None)
    reminder_config: Optional[str] = Field(default=None)
    recurrence_rule: Optional[str] = Field(default=None)


class Task(TaskBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    tags: Optional[str] = Field(default="[]")
    status: str = Field(default="pending")  # pending, completed, archived


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None
    tags: Optional[str] = "[]"


class TaskRead(TaskBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    tags: Optional[str]
    status: str


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    tags: Optional[str] = None
    due_date: Optional[datetime] = None
    reminder_config: Optional[str] = None
    recurrence_rule: Optional[str] = None
    status: Optional[str] = None