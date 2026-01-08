# Data Model: Backend API for Todo Full-Stack Web Application

**Feature**: 002-backend-todo-api | **Date**: 2026-01-08

## Overview

Data model for the FastAPI backend that will store user accounts and their associated tasks. The model enforces user isolation and supports the CRUD operations required by the frontend application.

## Entity Relationship Diagram

```
┌─────────┐    ┌─────────┐
│  User   │    │  Task   │
├─────────┤    ├─────────┤
│ id: UUID│◄───┤user_id: │
│ email:  │    │  UUID   │
│  str    │    │ title:  │
│ name:   │    │  str    │
│  str    │    │desc: str│
│created_ │    │compl:   │
│  at: dt │    │ bool    │
│updated_ │    │created_ │
│  at: dt │    │  at: dt │
└─────────┘    │updated_ │
               │  at: dt │
               └─────────┘
```

## Database Schema

### User Table
```
Table: users
┌──────────────────┬──────────────┬─────────────────────────────────────┐
│ Column           │ Type         │ Constraints                         │
├──────────────────┼──────────────┼─────────────────────────────────────┤
│ id               │ UUID         │ PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() │
│ email            │ VARCHAR(255) │ NOT NULL, UNIQUE, NOT NULL          │
│ name             │ VARCHAR(255) │ NOT NULL                            │
│ created_at       │ TIMESTAMP    │ NOT NULL, DEFAULT CURRENT_TIMESTAMP │
│ updated_at       │ TIMESTAMP    │ NOT NULL, DEFAULT CURRENT_TIMESTAMP │
└──────────────────┴──────────────┴─────────────────────────────────────┘
```

### Task Table
```
Table: tasks
┌──────────────────┬──────────────┬─────────────────────────────────────┐
│ Column           │ Type         │ Constraints                         │
├──────────────────┼──────────────┼─────────────────────────────────────┤
│ id               │ UUID         │ PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() │
│ title            │ VARCHAR(255) │ NOT NULL                            │
│ description      │ TEXT         │ NULL                                │
│ completed        │ BOOLEAN      │ NOT NULL, DEFAULT FALSE             │
│ user_id          │ UUID         │ NOT NULL, FOREIGN KEY(users.id) ON DELETE CASCADE │
│ created_at       │ TIMESTAMP    │ NOT NULL, DEFAULT CURRENT_TIMESTAMP │
│ updated_at       │ TIMESTAMP    │ NOT NULL, DEFAULT CURRENT_TIMESTAMP │
└──────────────────┴──────────────┴─────────────────────────────────────┘
```

## SQLModel Definitions

### User Model
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    name: str = Field(nullable=False)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)
```

### Task Model
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
import uuid

class TaskBase(SQLModel):
    title: str = Field(nullable=False)
    description: str | None = Field(default=None)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to User
    user: User | None = Relationship(back_populates="tasks")

class User(UserBase, table=True):
    # ... previous fields ...

    # Relationship to Tasks
    tasks: list[Task] = Relationship(back_populates="user")
```

## API Schema Models

### User Schemas
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: str
    name: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### Task Schemas
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

## Indexes

### Required Indexes
1. **users.email**: Unique index for email addresses (enforced by UNIQUE constraint)
2. **tasks.user_id**: Index for user_id foreign key (for efficient user isolation queries)
3. **tasks.created_at**: Index for creation timestamp (for sorting/filtering)

### Optional Indexes
1. **tasks.completed**: Index on completion status (for filtering completed/incomplete tasks)

## Data Integrity Rules

### Foreign Key Constraints
- `tasks.user_id` references `users.id`
- ON DELETE CASCADE: When a user is deleted, all their tasks are automatically deleted
- ON UPDATE CASCADE: When a user ID is updated, task references are updated accordingly

### Validation Rules
1. **Email Format**: Email addresses must follow standard email format
2. **Required Fields**: Task title and user email/name are required
3. **User Isolation**: Tasks can only be accessed by their owner
4. **UUID Format**: All IDs must be valid UUIDs

## Audit Trail

### Timestamps
- `created_at`: Set automatically when record is created
- `updated_at`: Updated automatically when record is modified
- Both fields use UTC timezone for consistency

## Privacy & Security

### Data Encryption
- Database connection encrypted using SSL
- Sensitive data stored with appropriate encryption at rest
- JWT tokens for authentication and authorization

### Access Control
- User isolation enforced at database level
- Authentication required for all data access
- Role-based access control implemented through JWT claims

## Migration Strategy

### Initial Setup
1. Create users table
2. Create tasks table with foreign key relationship
3. Create required indexes
4. Set up audit trail triggers (if needed)

### Future Changes
- Use Alembic for database migrations
- Maintain backward compatibility when possible
- Plan for zero-downtime deployments
- Document all schema changes

## Performance Considerations

### Query Optimization
- Use UUIDs for primary keys (avoid sequential IDs)
- Index foreign keys for join operations
- Consider partitioning for large datasets
- Optimize queries for the most common access patterns

### Connection Pooling
- Configure appropriate pool size based on expected load
- Monitor connection usage and adjust as needed
- Implement connection timeouts to prevent hanging connections