from sqlmodel import Session, select
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from ..models.task import Task, TaskCreate
from ..models.activity_log import ActivityLog, OperationEnum


class TaskRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate) -> Task:
        """Create a new task in the database."""
        # Convert the TaskCreate object to a dict
        task_data = task_create.model_dump()
        
        # Handle tags conversion if it's a list - convert to JSON string
        if isinstance(task_data.get('tags'), list):
            import json
            task_data['tags'] = json.dumps(task_data['tags'])
        elif task_data.get('tags') is None:
            task_data['tags'] = '[]'
        
        # Handle reminder_config and recurrence_rule if they are sent as dicts but stored as strings
        if 'reminder_config' in task_data and isinstance(task_data['reminder_config'], dict):
            import json
            task_data['reminder_config'] = json.dumps(task_data['reminder_config'])
        
        if 'recurrence_rule' in task_data and isinstance(task_data['recurrence_rule'], dict):
            import json
            task_data['recurrence_rule'] = json.dumps(task_data['recurrence_rule'])
        
        # Create Task instance with processed data
        task = Task(**task_data)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        # Create activity log for task creation
        self._log_activity(task.id, OperationEnum.CREATE, task.user_id, {}, task.model_dump())

        return task

    def get_task_by_id(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Get a task by ID for a specific user."""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return self.session.exec(statement).first()

    def get_tasks_by_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100,
                         priority: Optional[str] = None, tag: Optional[str] = None,
                         status: Optional[str] = None, due_date_from: Optional[datetime] = None,
                         due_date_to: Optional[datetime] = None, sort_by: str = "created_at",
                         order: str = "desc") -> List[Task]:
        """Get all tasks for a specific user with optional filters and sorting."""
        statement = select(Task).where(Task.user_id == user_id)

        # Apply filters
        if priority:
            statement = statement.where(Task.priority == priority)
        if tag:
            statement = statement.where(Task.tags.contains([tag]))
        if status:
            statement = statement.where(Task.status == status)
        if due_date_from:
            statement = statement.where(Task.due_date >= due_date_from)
        if due_date_to:
            statement = statement.where(Task.due_date <= due_date_to)

        # Apply sorting
        if hasattr(Task, sort_by):
            sort_field = getattr(Task, sort_by)
            if order.lower() == "desc":
                statement = statement.order_by(sort_field.desc())
            else:
                statement = statement.order_by(sort_field.asc())

        statement = statement.offset(skip).limit(limit)
        tasks = self.session.exec(statement).all()
        
        # Convert tags from JSON string back to list for frontend consumption
        for task in tasks:
            if isinstance(task.tags, str) and task.tags.startswith('[') and task.tags.endswith(']'):
                try:
                    import json
                    task.tags = json.loads(task.tags)
                except:
                    # If JSON parsing fails, keep original value
                    pass
        
        return tasks

    def update_task(self, task_id: uuid.UUID, user_id: uuid.UUID, task_update: Dict[str, Any]) -> Optional[Task]:
        """Update a task for a specific user."""
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        # Store previous state for activity logging
        previous_state = task.model_dump()

        # Handle JSON field conversions - convert dict to JSON string for storage
        for field, value in task_update.items():
            if field == 'tags' and isinstance(value, list):
                import json
                setattr(task, field, json.dumps(value))
            elif field in ['reminder_config', 'recurrence_rule'] and isinstance(value, dict):
                import json
                setattr(task, field, json.dumps(value))
            elif hasattr(task, field):
                setattr(task, field, value)

        # Update the updated_at timestamp
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        # Create activity log for task update
        changes = {}
        for field, new_value in task_update.items():
            if field in previous_state and previous_state[field] != new_value:
                changes[field] = {"old": previous_state[field], "new": new_value}

        if changes:
            self._log_activity(task.id, OperationEnum.UPDATE, user_id, previous_state, task.model_dump())

        return task

    def delete_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a task for a specific user."""
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return False

        # Create activity log for task deletion
        self._log_activity(task.id, OperationEnum.DELETE, user_id, task.model_dump(), {})

        # Delete related activity logs first to avoid foreign key constraint violation
        from sqlmodel import select
        statement = select(ActivityLog).where(ActivityLog.task_id == task_id)
        activity_logs = self.session.exec(statement).all()
        for activity_log in activity_logs:
            self.session.delete(activity_log)

        self.session.delete(task)
        self.session.commit()
        return True

    def complete_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Mark a task as completed."""
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        previous_state = task.model_dump()
        task.is_completed = True
        task.status = "completed"
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        
        # Create activity log for task completion
        self._log_activity(task.id, OperationEnum.COMPLETE, user_id, previous_state, task.model_dump())

        return task

    def archive_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Archive a completed task."""
        task = self.get_task_by_id(task_id, user_id)
        if not task or task.status != "completed":
            return None

        previous_state = task.model_dump()
        task.status = "archived"
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        
        # Create activity log for task archival
        self._log_activity(task.id, OperationEnum.ARCHIVE, user_id, previous_state, task.model_dump())

        return task

    def search_tasks(self, user_id: uuid.UUID, query: str, skip: int = 0, limit: int = 100) -> List[Task]:
        """Search tasks by title or description."""
        from sqlalchemy import or_
        
        statement = select(Task).where(
            Task.user_id == user_id
        ).where(
            or_(
                Task.title.ilike(f"%{query}%"),
                Task.description.ilike(f"%{query}%")
            )
        ).offset(skip).limit(limit)
        
        return self.session.exec(statement).all()

    def get_total_tasks_count(self, user_id: uuid.UUID, priority: Optional[str] = None, 
                           tag: Optional[str] = None, status: Optional[str] = None) -> int:
        """Get the total count of tasks for a specific user with optional filters."""
        statement = select(Task).where(Task.user_id == user_id)
        
        if priority:
            statement = statement.where(Task.priority == priority)
        if tag:
            statement = statement.where(Task.tags.contains([tag]))
        if status:
            statement = statement.where(Task.status == status)
        
        return len(self.session.exec(statement).all())

    def _log_activity(self, task_id: uuid.UUID, operation: OperationEnum, user_id: uuid.UUID,
                     previous_state: Dict, new_state: Dict) -> None:
        """Log an activity for the task."""
        from ..models.activity_log import ActivityLog
        import json
        from datetime import datetime
        import uuid

        # Calculate changes
        changes = {}
        for key, new_val in new_state.items():
            old_val = previous_state.get(key)
            if old_val != new_val:
                # Handle datetime and uuid serialization
                old_serialized = self._serialize_for_json(old_val)
                new_serialized = self._serialize_for_json(new_val)
                changes[key] = {"old": old_serialized, "new": new_serialized}

        # Convert dict fields to JSON strings for storage
        activity = ActivityLog(
            task_id=task_id,
            operation=operation,
            user_id=user_id,
            previous_state=json.dumps(previous_state, default=self._json_serializer) if previous_state else None,
            changes=json.dumps(changes) if changes else None
        )

        self.session.add(activity)
        self.session.commit()

    def _json_serializer(self, obj):
        """Custom serializer for JSON encoding."""
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, uuid.UUID):
            return str(obj)
        raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

    def _serialize_for_json(self, obj):
        """Serialize individual values for JSON."""
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, uuid.UUID):
            return str(obj)
        elif isinstance(obj, dict):
            # Recursively serialize dict values
            return {k: self._serialize_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            # Recursively serialize list elements
            return [self._serialize_for_json(item) for item in obj]
        else:
            return obj