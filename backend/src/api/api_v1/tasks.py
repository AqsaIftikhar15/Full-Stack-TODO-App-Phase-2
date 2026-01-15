from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
import uuid
from ...models.task import TaskCreate
from ...models.user import User
from ...schemas.task import TaskCreate as TaskCreateSchema, TaskResponse, TaskUpdate, TaskListResponse
from ..deps import get_current_user, get_db
from ...repositories.task_repository import TaskRepository


router = APIRouter()


@router.post("/", response_model=TaskResponse)
def create_task(
    task_create: TaskCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new task for the authenticated user.
    """
    # Create task with the authenticated user's ID
    task_data = task_create.model_dump()
    task_data["user_id"] = current_user.id

    task_repo = TaskRepository(db)
    task = task_repo.create_task(TaskCreate(**task_data))

    # Prepare response
    task_response = TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

    return task_response


@router.get("/", response_model=TaskListResponse)
def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve tasks for the authenticated user.
    """
    task_repo = TaskRepository(db)
    tasks = task_repo.get_tasks_by_user(current_user.id, skip=skip, limit=limit)
    total = task_repo.get_total_tasks_count(current_user.id)

    # Convert to response format
    task_responses = [
        TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            is_completed=task.is_completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]

    return TaskListResponse(tasks=task_responses, total=total)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific task by ID for the authenticated user.
    """
    task_repo = TaskRepository(db)
    task = task_repo.get_task_by_id(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: uuid.UUID,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a specific task by ID for the authenticated user.
    """
    task_repo = TaskRepository(db)
    update_data = task_update.model_dump(exclude_unset=True)
    updated_task = task_repo.update_task(task_id, current_user.id, update_data)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=updated_task.id,
        title=updated_task.title,
        description=updated_task.description,
        is_completed=updated_task.is_completed,
        user_id=updated_task.user_id,
        created_at=updated_task.created_at,
        updated_at=updated_task.updated_at
    )


@router.delete("/{task_id}")
def delete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific task by ID for the authenticated user.
    """
    task_repo = TaskRepository(db)
    deleted = task_repo.delete_task(task_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"message": "Task deleted successfully"}