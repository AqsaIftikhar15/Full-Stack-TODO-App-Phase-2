from sqlmodel import Session, select
from typing import List, Optional
import uuid
from datetime import datetime
from ..models.activity_log import ActivityLog, ActivityLogCreate


class ActivityLogRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_activity_log(self, activity_log_create: ActivityLogCreate) -> ActivityLog:
        """Create a new activity log entry."""
        activity_log = ActivityLog.model_validate(activity_log_create)
        self.session.add(activity_log)
        self.session.commit()
        self.session.refresh(activity_log)
        return activity_log

    def get_activities_by_task(self, task_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[ActivityLog]:
        """Get all activities for a specific task."""
        statement = select(ActivityLog).where(ActivityLog.task_id == task_id).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def get_activities_by_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[ActivityLog]:
        """Get all activities for a specific user."""
        statement = select(ActivityLog).where(ActivityLog.user_id == user_id).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def get_activities_by_operation(self, operation: str, skip: int = 0, limit: int = 100) -> List[ActivityLog]:
        """Get all activities of a specific operation type."""
        from ..models.activity_log import OperationEnum
        statement = select(ActivityLog).where(ActivityLog.operation == OperationEnum(operation)).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def get_activities_in_time_range(self, start_time: datetime, end_time: datetime, skip: int = 0, limit: int = 100) -> List[ActivityLog]:
        """Get all activities within a specific time range."""
        statement = select(ActivityLog).where(
            ActivityLog.timestamp >= start_time,
            ActivityLog.timestamp <= end_time
        ).offset(skip).limit(limit)
        return self.session.exec(statement).all()