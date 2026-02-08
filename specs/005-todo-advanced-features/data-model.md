# Data Model: Todo Advanced Features

## Entity Extensions

### Task Entity
Extending the existing Task entity with new fields:

- `id`: String/UUID (primary key, existing)
- `title`: String (existing)
- `description`: String (optional, existing)
- `status`: String enum (pending, completed, archived) (existing)
- `created_at`: DateTime (existing)
- `updated_at`: DateTime (existing)
- `priority`: String enum (low, medium, high) (NEW)
  - Default: "medium"
  - Validation: Must be one of the allowed values
- `tags`: Array of Strings (NEW)
  - Max length: 10 tags per task
  - Validation: Each tag must be 1-50 characters, alphanumeric with hyphens/underscores
- `due_date`: DateTime (optional, NEW)
  - Validation: If provided, must be in the future
- `reminder_config`: Object (optional, NEW)
  - `enabled`: Boolean (default: false)
  - `notify_before`: Integer (minutes before due_date, default: 15)
  - `method`: String enum (email, push, both) (default: push)
- `recurrence_rule`: Object (optional, NEW)
  - `enabled`: Boolean (default: false)
  - `pattern`: String enum (daily, weekly, monthly, interval) (default: daily)
  - `interval_days`: Integer (for interval pattern, default: 1)
  - `ends_on`: DateTime (optional, when recurrence should stop)
  - `occurrences_count`: Integer (optional, max number of occurrences)

### ActivityLog Entity (New)
Storing audit trail for task operations:

- `id`: String/UUID (primary key)
- `task_id`: String/UUID (foreign key to Task)
- `operation`: String enum (CREATE, UPDATE, COMPLETE, ARCHIVE, DELETE)
- `timestamp`: DateTime
- `user_id`: String/UUID (reference to user performing operation)
- `previous_state`: JSON object (snapshot of task before operation)
- `changes`: JSON object (detailed changes made in operation)

## Relationships

- Task (1) → ActivityLog (Many): One task can have many activity log entries
- Task (Many) → Tags (Many): Many tasks can have many tags (through the tags array field)

## Validation Rules

### Task Entity
- `priority`: Must be one of ["low", "medium", "high"]
- `tags`: Maximum 10 tags per task, each tag 1-50 characters (alphanumeric, hyphens, underscores)
- `due_date`: If provided, must be in the future (not past)
- `reminder_config.notify_before`: If enabled, must be positive integer (minutes)
- `recurrence_rule.interval_days`: If pattern is "interval", must be positive integer

### ActivityLog Entity
- `operation`: Must be one of the defined enums
- `task_id`: Must reference an existing Task
- `user_id`: Must reference an existing User (if user system exists)

## State Transitions

### Task Status Transitions
- pending → completed (via PUT /tasks/{id}/complete)
- completed → pending (via PUT /tasks/{id}/reopen) [optional]
- completed → archived (via PUT /tasks/{id}/archive)
- archived → pending (via PUT /tasks/{id}/restore) [optional]

### Valid Transitions
- A task with recurrence enabled cannot be archived until recurrence is disabled
- Completed recurring tasks generate new instances based on recurrence rules
- Deleting a recurring task affects only future instances if configured to do so

## Indexes

### Task Entity
- Index on `priority` for efficient filtering
- Index on `due_date` for efficient sorting and filtering
- Index on `status` for efficient filtering
- Composite index on (`status`, `priority`, `due_date`) for combined filtering

### ActivityLog Entity
- Index on `task_id` for efficient lookup by task
- Index on `timestamp` for chronological ordering
- Index on `operation` for filtering by operation type