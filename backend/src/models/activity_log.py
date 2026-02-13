from sqlmodel import SQLModel, Field
from typing import Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import JSON


class OperationEnum(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    COMPLETE = "COMPLETE"
    ARCHIVE = "ARCHIVE"
    DELETE = "DELETE"


class ActivityLogBase(SQLModel):
    task_id: uuid.UUID = Field(foreign_key="task.id")
    operation: OperationEnum
    user_id: uuid.UUID = Field(foreign_key="user.id")
    previous_state: Optional[Dict[str, Any]] = Field(default=None, sa_column=JSON)
    changes: Optional[Dict[str, Any]] = Field(default=None, sa_column=JSON)


class ActivityLog(ActivityLogBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ActivityLogCreate(ActivityLogBase):
    pass


class ActivityLogRead(SQLModel):
    id: uuid.UUID
    task_id: uuid.UUID
    operation: OperationEnum
    user_id: uuid.UUID
    previous_state: Optional[Dict[str, Any]] = None
    changes: Optional[Dict[str, Any]] = None
    timestamp: datetime