from sqlmodel import Session, select
from typing import List, Optional
import uuid
from ..models.task import Task, TaskCreate


class TaskRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate) -> Task:
        """Create a new task in the database."""
        task = Task.model_validate(task_create)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_task_by_id(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Get a task by ID for a specific user."""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return self.session.exec(statement).first()

    def get_tasks_by_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Task]:
        """Get all tasks for a specific user."""
        statement = select(Task).where(Task.user_id == user_id).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def update_task(self, task_id: uuid.UUID, user_id: uuid.UUID, task_update: dict) -> Optional[Task]:
        """Update a task for a specific user."""
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        for field, value in task_update.items():
            setattr(task, field, value)

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a task for a specific user."""
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return False

        self.session.delete(task)
        self.session.commit()
        return True

    def get_total_tasks_count(self, user_id: uuid.UUID) -> int:
        """Get the total count of tasks for a specific user."""
        statement = select(Task).where(Task.user_id == user_id)
        return len(self.session.exec(statement).all())