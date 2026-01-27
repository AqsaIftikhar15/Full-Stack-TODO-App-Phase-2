"""MCP Tools for the AI-powered Todo Chatbot"""

from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate
from ..models.user import User
from ..core.database import engine
import uuid
from datetime import datetime


def add_task(user_id: str, title: str, description: Optional[str] = None, **kwargs) -> Dict[str, Any]:
    """
    Creates a new task for the specified user.

    Args:
        user_id: The ID of the user who owns the task
        title: The task title
        description: Optional task description

    Returns:
        Dictionary containing the created task information
    """
    user_uuid = uuid.UUID(user_id)

    with Session(engine) as session:
        task = Task(
            title=title,
            description=description,
            is_completed=False,  # Default to not completed
            user_id=user_uuid
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "id": str(task.id),
            "user_id": str(task.user_id),
            "title": task.title,
            "description": task.description,
            "is_completed": task.is_completed,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat()
        }


def list_tasks(user_id: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Lists tasks for the specified user.

    Args:
        user_id: The ID of the user whose tasks to retrieve
        filters: Optional filters for the query

    Returns:
        List of tasks for the user
    """
    user_uuid = uuid.UUID(user_id)

    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_uuid)

        # Apply filters if provided
        if filters:
            if filters.get('status'):
                # Note: Using is_completed field from existing model
                completed_filter = filters['status'] == 'completed'
                statement = statement.where(Task.is_completed == completed_filter)

        tasks = session.exec(statement).all()

        return [
            {
                "id": str(task.id),
                "user_id": str(task.user_id),
                "title": task.title,
                "description": task.description,
                "is_completed": task.is_completed,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            }
            for task in tasks
        ]


def update_task(user_id: str, task_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Updates specific fields of an existing task.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to update
        updates: Dictionary of fields to update

    Returns:
        Updated task information or None if not found
    """
    user_uuid = uuid.UUID(user_id)
    task_uuid = uuid.UUID(task_id)

    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_uuid, Task.user_id == user_uuid)
        task = session.exec(statement).first()

        if not task:
            return None

        # Apply updates
        for key, value in updates.items():
            if hasattr(task, key):
                setattr(task, key, value)

        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "id": str(task.id),
            "user_id": str(task.user_id),
            "title": task.title,
            "description": task.description,
            "is_completed": task.is_completed,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat()
        }


def complete_task(user_id: str, task_id: str) -> Optional[Dict[str, Any]]:
    """
    Marks a task as completed.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to complete

    Returns:
        Updated task information or None if not found
    """
    return update_task(user_id, task_id, {"is_completed": True})


def delete_task(user_id: str, task_id: str) -> bool:
    """
    Deletes a task for the specified user.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to delete

    Returns:
        True if task was deleted, False if not found
    """
    user_uuid = uuid.UUID(user_id)
    task_uuid = uuid.UUID(task_id)

    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_uuid, Task.user_id == user_uuid)
        task = session.exec(statement).first()

        if not task:
            return False

        session.delete(task)
        session.commit()
        return True