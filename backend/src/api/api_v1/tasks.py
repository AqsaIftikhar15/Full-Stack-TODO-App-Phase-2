from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
import uuid
from datetime import datetime
from ...models.task import TaskCreate
from ...models.user import User
from ...schemas.task import (
    TaskCreate as TaskCreateSchema, 
    TaskResponse, 
    TaskUpdate, 
    TaskListResponse,
    TaskFilterParams,
    TaskSearchResponse
)
from ..deps import get_current_user, get_db
from ...repositories.task_repository import TaskRepository
from ...repositories.activity_log_repository import ActivityLogRepository
from ...utils.validation import TaskValidator


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
    # Validate the new fields
    validation_result = TaskValidator.validate_task_fields(
        priority=task_create.priority,
        tags=task_create.tags,
        due_date=task_create.due_date,
        reminder_config=task_create.reminder_config,
        recurrence_rule=task_create.recurrence_rule
    )
    
    if not validation_result["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {'; '.join(validation_result['errors'])}"
        )

    # Create task with the authenticated user's ID
    task_data = task_create.model_dump()
    task_data["user_id"] = current_user.id

    # Convert tags from list to JSON string for database storage
    if 'tags' in task_data and isinstance(task_data['tags'], list):
        import json
        task_data['tags'] = json.dumps(task_data['tags'])
    
    # Convert reminder_config from dict to JSON string for database storage
    if 'reminder_config' in task_data and isinstance(task_data['reminder_config'], dict):
        import json
        task_data['reminder_config'] = json.dumps(task_data['reminder_config'])
    
    # Convert recurrence_rule from dict to JSON string for database storage
    if 'recurrence_rule' in task_data and isinstance(task_data['recurrence_rule'], dict):
        import json
        task_data['recurrence_rule'] = json.dumps(task_data['recurrence_rule'])

    task_repo = TaskRepository(db)
    task = task_repo.create_task(TaskCreate(**task_data))

    # Convert tags from JSON string back to list for frontend
    import json
    tags_list = task.tags
    if isinstance(task.tags, str):
        try:
            tags_list = json.loads(task.tags)
        except json.JSONDecodeError:
            tags_list = []
    
    # Convert reminder_config from JSON string back to dict for frontend
    reminder_config = task.reminder_config
    if isinstance(task.reminder_config, str):
        try:
            reminder_config = json.loads(task.reminder_config)
        except json.JSONDecodeError:
            reminder_config = None
    
    # Convert recurrence_rule from JSON string back to dict for frontend
    recurrence_rule = task.recurrence_rule
    if isinstance(task.recurrence_rule, str):
        try:
            recurrence_rule = json.loads(task.recurrence_rule)
        except json.JSONDecodeError:
            recurrence_rule = None

    # Prepare response
    task_response = TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at,
        priority=task.priority,
        tags=tags_list,
        due_date=task.due_date,
        reminder_config=reminder_config,
        recurrence_rule=recurrence_rule,
        status=task.status
    )

    return task_response


@router.get("/", response_model=TaskListResponse)
def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    priority: Optional[str] = Query(None, description="Filter by priority"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    status: Optional[str] = Query(None, description="Filter by status"),
    due_date_from: Optional[datetime] = Query(None, description="Filter tasks with due date after this date"),
    due_date_to: Optional[datetime] = Query(None, description="Filter tasks with due date before this date"),
    sort_by: str = Query("created_at", description="Sort by field"),
    order: str = Query("desc", description="Sort order (asc/desc)")
):
    """
    Retrieve tasks for the authenticated user with filtering and sorting options.
    """
    task_repo = TaskRepository(db)
    tasks = task_repo.get_tasks_by_user(
        current_user.id, 
        skip=skip, 
        limit=limit,
        priority=priority,
        tag=tag,
        status=status,
        due_date_from=due_date_from,
        due_date_to=due_date_to,
        sort_by=sort_by,
        order=order
    )
    total = task_repo.get_total_tasks_count(current_user.id, priority=priority, tag=tag, status=status)

    # Convert to response format with JSON string to dict conversions
    import json
    task_responses = []
    for task in tasks:
        # Convert tags from JSON string back to list for frontend
        tags_list = task.tags
        if isinstance(task.tags, str):
            try:
                tags_list = json.loads(task.tags)
            except json.JSONDecodeError:
                tags_list = []
        
        # Convert reminder_config from JSON string back to dict for frontend
        reminder_config = task.reminder_config
        if isinstance(task.reminder_config, str):
            try:
                reminder_config = json.loads(task.reminder_config)
            except json.JSONDecodeError:
                reminder_config = None
        
        # Convert recurrence_rule from JSON string back to dict for frontend
        recurrence_rule = task.recurrence_rule
        if isinstance(task.recurrence_rule, str):
            try:
                recurrence_rule = json.loads(task.recurrence_rule)
            except json.JSONDecodeError:
                recurrence_rule = None

        task_responses.append(TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            is_completed=task.is_completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at,
            priority=task.priority,
            tags=tags_list,
            due_date=task.due_date,
            reminder_config=reminder_config,
            recurrence_rule=recurrence_rule,
            status=task.status
        ))

    return TaskListResponse(tasks=task_responses, total=total)


@router.get("/search", response_model=List[TaskResponse])
def search_tasks(
    q: str = Query(..., min_length=1, description="Search query"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Search tasks by keyword in title or description.
    """
    if not q:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty"
        )
    
    task_repo = TaskRepository(db)
    tasks = task_repo.search_tasks(current_user.id, q, skip=skip, limit=limit)

    # Convert to response format with JSON string to dict conversions
    import json
    task_responses = []
    for task in tasks:
        # Convert tags from JSON string back to list for frontend
        tags_list = task.tags
        if isinstance(task.tags, str):
            try:
                tags_list = json.loads(task.tags)
            except json.JSONDecodeError:
                tags_list = []
        
        # Convert reminder_config from JSON string back to dict for frontend
        reminder_config = task.reminder_config
        if isinstance(task.reminder_config, str):
            try:
                reminder_config = json.loads(task.reminder_config)
            except json.JSONDecodeError:
                reminder_config = None
        
        # Convert recurrence_rule from JSON string back to dict for frontend
        recurrence_rule = task.recurrence_rule
        if isinstance(task.recurrence_rule, str):
            try:
                recurrence_rule = json.loads(task.recurrence_rule)
            except json.JSONDecodeError:
                recurrence_rule = None

        task_responses.append(TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            is_completed=task.is_completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at,
            priority=task.priority,
            tags=tags_list,
            due_date=task.due_date,
            reminder_config=reminder_config,
            recurrence_rule=recurrence_rule,
            status=task.status
        ))

    return task_responses


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

    # Convert tags from JSON string back to list for frontend
    import json
    tags_list = task.tags
    if isinstance(task.tags, str):
        try:
            tags_list = json.loads(task.tags)
        except json.JSONDecodeError:
            tags_list = []
    
    # Convert reminder_config from JSON string back to dict for frontend
    reminder_config = task.reminder_config
    if isinstance(task.reminder_config, str):
        try:
            reminder_config = json.loads(task.reminder_config)
        except json.JSONDecodeError:
            reminder_config = None
    
    # Convert recurrence_rule from JSON string back to dict for frontend
    recurrence_rule = task.recurrence_rule
    if isinstance(task.recurrence_rule, str):
        try:
            recurrence_rule = json.loads(task.recurrence_rule)
        except json.JSONDecodeError:
            recurrence_rule = None

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at,
        priority=task.priority,
        tags=tags_list,
        due_date=task.due_date,
        reminder_config=reminder_config,
        recurrence_rule=recurrence_rule,
        status=task.status
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
    
    # Validate the new fields if they are being updated
    validation_result = TaskValidator.validate_task_fields(
        priority=update_data.get('priority'),
        tags=update_data.get('tags'),
        due_date=update_data.get('due_date'),
        reminder_config=update_data.get('reminder_config'),
        recurrence_rule=update_data.get('recurrence_rule')
    )
    
    if not validation_result["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {'; '.join(validation_result['errors'])}"
        )
    
    updated_task = task_repo.update_task(task_id, current_user.id, update_data)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Convert tags from JSON string back to list for frontend
    import json
    tags_list = updated_task.tags
    if isinstance(updated_task.tags, str):
        try:
            tags_list = json.loads(updated_task.tags)
        except json.JSONDecodeError:
            tags_list = []
    
    # Convert reminder_config from JSON string back to dict for frontend
    reminder_config = updated_task.reminder_config
    if isinstance(updated_task.reminder_config, str):
        try:
            reminder_config = json.loads(updated_task.reminder_config)
        except json.JSONDecodeError:
            reminder_config = None
    
    # Convert recurrence_rule from JSON string back to dict for frontend
    recurrence_rule = updated_task.recurrence_rule
    if isinstance(updated_task.recurrence_rule, str):
        try:
            recurrence_rule = json.loads(updated_task.recurrence_rule)
        except json.JSONDecodeError:
            recurrence_rule = None

    return TaskResponse(
        id=updated_task.id,
        title=updated_task.title,
        description=updated_task.description,
        is_completed=updated_task.is_completed,
        user_id=updated_task.user_id,
        created_at=updated_task.created_at,
        updated_at=updated_task.updated_at,
        priority=updated_task.priority,
        tags=tags_list,
        due_date=updated_task.due_date,
        reminder_config=reminder_config,
        recurrence_rule=recurrence_rule,
        status=updated_task.status
    )


@router.put("/{task_id}/complete", response_model=TaskResponse)
def complete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a task as complete.
    """
    task_repo = TaskRepository(db)
    completed_task = task_repo.complete_task(task_id, current_user.id)

    if not completed_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or user not authorized"
        )

    return TaskResponse(
        id=completed_task.id,
        title=completed_task.title,
        description=completed_task.description,
        is_completed=completed_task.is_completed,
        user_id=completed_task.user_id,
        created_at=completed_task.created_at,
        updated_at=completed_task.updated_at,
        priority=completed_task.priority,
        tags=completed_task.tags,
        due_date=completed_task.due_date,
        reminder_config=completed_task.reminder_config,
        recurrence_rule=completed_task.recurrence_rule,
        status=completed_task.status
    )


@router.put("/{task_id}/archive", response_model=TaskResponse)
def archive_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Archive a completed task.
    """
    task_repo = TaskRepository(db)
    archived_task = task_repo.archive_task(task_id, current_user.id)

    if not archived_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found, not completed, or user not authorized"
        )

    return TaskResponse(
        id=archived_task.id,
        title=archived_task.title,
        description=archived_task.description,
        is_completed=archived_task.is_completed,
        user_id=archived_task.user_id,
        created_at=archived_task.created_at,
        updated_at=archived_task.updated_at,
        priority=archived_task.priority,
        tags=archived_task.tags,
        due_date=archived_task.due_date,
        reminder_config=archived_task.reminder_config,
        recurrence_rule=archived_task.recurrence_rule,
        status=archived_task.status
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


@router.post("/{task_id}/reminder")
def configure_reminder(
    task_id: uuid.UUID,
    reminder_config: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Configure reminder for a specific task.
    """
    # Validate the reminder configuration
    validation_result = TaskValidator.validate_reminder_config(reminder_config)
    
    if not validation_result["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {'; '.join(validation_result['errors'])}"
        )
    
    # Update the task with the reminder configuration
    task_repo = TaskRepository(db)
    update_data = {"reminder_config": reminder_config}
    updated_task = task_repo.update_task(task_id, current_user.id, update_data)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or user not authorized"
        )

    return {"message": "Reminder configured successfully", "task_id": task_id}


@router.get("/{task_id}/reminder")
def get_reminder_config(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get reminder configuration for a specific task.
    """
    task_repo = TaskRepository(db)
    task = task_repo.get_task_by_id(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"task_id": task.id, "reminder_config": task.reminder_config}


@router.post("/{task_id}/recurrence")
def configure_recurrence(
    task_id: uuid.UUID,
    recurrence_rule: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Configure recurrence for a specific task.
    """
    # Validate the recurrence rule
    validation_result = TaskValidator.validate_recurrence_rule(recurrence_rule)
    
    if not validation_result["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {'; '.join(validation_result['errors'])}"
        )
    
    # Update the task with the recurrence rule
    task_repo = TaskRepository(db)
    update_data = {"recurrence_rule": recurrence_rule}
    updated_task = task_repo.update_task(task_id, current_user.id, update_data)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or user not authorized"
        )

    return {"message": "Recurrence configured successfully", "task_id": task_id}


@router.get("/{task_id}/recurrence")
def get_recurrence_config(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get recurrence configuration for a specific task.
    """
    task_repo = TaskRepository(db)
    task = task_repo.get_task_by_id(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"task_id": task.id, "recurrence_rule": task.recurrence_rule}


@router.get("/{task_id}/activity")
def get_task_activity(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Get activity log for a specific task.
    """
    # Verify that the user owns the task
    task_repo = TaskRepository(db)
    task = task_repo.get_task_by_id(task_id, current_user.id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Get the activity logs for this task
    activity_repo = ActivityLogRepository(db)
    activities = activity_repo.get_activities_by_task(task_id, skip=skip, limit=limit)
    
    # Format the response with JSON conversion for previous_state and changes
    import json
    activity_list = []
    for activity in activities:
        # Convert JSON strings back to dict for frontend
        previous_state = activity.previous_state
        if isinstance(activity.previous_state, str):
            try:
                previous_state = json.loads(activity.previous_state)
            except json.JSONDecodeError:
                previous_state = {}
                
        changes = activity.changes
        if isinstance(activity.changes, str):
            try:
                changes = json.loads(activity.changes)
            except json.JSONDecodeError:
                changes = {}

        activity_list.append({
            "id": activity.id,
            "task_id": activity.task_id,
            "operation": activity.operation.value,
            "timestamp": activity.timestamp,
            "user_id": activity.user_id,
            "previous_state": previous_state,
            "changes": changes
        })
    
    return {"activities": activity_list, "total": len(activity_list)}