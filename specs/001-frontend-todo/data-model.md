# Data Model: Frontend Todo Web Application

## Entity: User
**Description**: Represents an authenticated user with credentials, session data, and personal tasks
**Fields**:
- id: string (unique identifier from authentication system)
- email: string (user's email address)
- name: string (user's display name)
- createdAt: Date (account creation timestamp)
- updatedAt: Date (last update timestamp)

## Entity: Task
**Description**: Represents a todo item with properties like title, description, completion status, creation date, and association with a specific user
**Fields**:
- id: string (unique identifier from backend)
- title: string (task title, required)
- description: string (optional task description)
- completed: boolean (completion status, default: false)
- userId: string (foreign key to user who owns this task)
- createdAt: Date (task creation timestamp)
- updatedAt: Date (last update timestamp)

## State Transitions: Task
- **Active** → **Completed**: When user marks task as complete
- **Completed** → **Active**: When user marks task as incomplete
- **Any State** → **Deleted**: When user deletes task (permanent deletion)

## Validation Rules
- Task title must not be empty
- Task must be associated with an authenticated user
- Task operations require valid JWT token
- Task visibility is limited to owner user

## API Response Format
**Task Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string (optional)",
  "completed": "boolean",
  "userId": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**User Response** (from auth system):
```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

## Frontend State Management
- **Auth State**: { user: User | null, loading: boolean, error: string | null }
- **Tasks State**: { tasks: Task[], loading: boolean, error: string | null, selectedTask: Task | null }
- **UI State**: { showCreateForm: boolean, showEditModal: boolean, animationsEnabled: boolean }