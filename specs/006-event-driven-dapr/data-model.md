# Data Model: Event-Driven Architecture with Dapr Integration

## Overview
This document defines the data models for the event-driven Todo application, including event schemas, entity relationships, and state management patterns.

## Core Entities

### Task
Represents a user's task with all its properties and metadata.

**Fields**:
- `id` (string): Unique identifier for the task
- `title` (string): Task title/description
- `description` (string, optional): Detailed task description
- `userId` (string): ID of the user who owns the task
- `completed` (boolean): Whether the task is completed
- `createdAt` (datetime): Timestamp when task was created
- `updatedAt` (datetime): Timestamp when task was last updated
- `priority` (enum): Priority level (low, medium, high)
- `tags` (array of strings): Tags associated with the task
- `dueDate` (datetime, optional): When the task is due
- `reminderConfig` (object, optional): Configuration for task reminders
- `recurrenceRule` (object, optional): Rule for recurring tasks
- `status` (enum): Current status (pending, completed, archived)

**Relationships**:
- Belongs to one User
- Has many TaskEvents (through event log)

### User
Represents a user in the system.

**Fields**:
- `id` (string): Unique identifier for the user
- `email` (string): User's email address
- `username` (string): User's chosen username
- `createdAt` (datetime): When the user account was created

**Relationships**:
- Has many Tasks
- Associated with many TaskEvents

## Event Schemas

### TaskEvent
Represents an event in the task lifecycle.

**Fields**:
- `id` (string): Unique identifier for the event
- `eventId` (string): Unique identifier for this specific event occurrence
- `eventType` (string): Type of event (created, updated, completed, deleted)
- `taskId` (string): ID of the task this event relates to
- `userId` (string): ID of the user who triggered the event
- `timestamp` (datetime): When the event occurred
- `taskData` (object): Snapshot of the task at the time of the event
- `previousTaskData` (object, optional): Previous state of the task (for update events)

**Validation Rules**:
- `eventType` must be one of: "created", "updated", "completed", "deleted"
- `taskId` must reference an existing task
- `userId` must reference an existing user
- `timestamp` must be in ISO 8601 format

### ReminderEvent
Represents a scheduled reminder for a task.

**Fields**:
- `id` (string): Unique identifier for the event
- `taskId` (string): ID of the task this reminder is for
- `title` (string): Task title for the notification
- `dueAt` (datetime): When the task is due
- `remindAt` (datetime): When to send the reminder
- `userId` (string): ID of the user to notify
- `notificationMethod` (string): Method to use for notification (email, push, both)
- `status` (string): Current status (scheduled, sent, cancelled)

**Validation Rules**:
- `remindAt` must be before or equal to `dueAt`
- `notificationMethod` must be one of: "email", "push", "both"
- `status` must be one of: "scheduled", "sent", "cancelled"

## Dapr State Stores

### Conversation State
Stores conversation history between users and the AI assistant.

**Key Format**: `conversation:{userId}:{sessionId}`
**Value**:
```json
{
  "sessionId": "string",
  "userId": "string",
  "messages": [
    {
      "id": "string",
      "role": "user|assistant",
      "content": "string",
      "timestamp": "datetime"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Task Cache
Caches frequently accessed task data to reduce database queries.

**Key Format**: `task:{taskId}`
**Value**:
```json
{
  "taskId": "string",
  "title": "string",
  "status": "string",
  "lastAccessed": "datetime"
}
```

## Kafka Topics

### task-events
Topic for all task-related events.

**Partitioning Strategy**: By `userId` to ensure ordering within user contexts
**Retention Policy**: 7 days
**Message Format**: JSON with TaskEvent schema

### reminders
Topic for scheduled reminder events.

**Partitioning Strategy**: By `userId` to ensure ordering within user contexts
**Retention Policy**: 24 hours after reminder time
**Message Format**: JSON with ReminderEvent schema

### task-updates
Topic for real-time task update notifications.

**Partitioning Strategy**: By `taskId` to ensure ordering for individual tasks
**Retention Policy**: 1 hour
**Message Format**: JSON with TaskEvent schema (only update events)

## State Transitions

### Task Status Transitions
```
pending → completed (via complete_task event)
pending → archived (via archive_task event)
completed → archived (via archive_task event)
```

### Reminder Status Transitions
```
scheduled → sent (when notification is delivered)
scheduled → cancelled (when task is deleted/completed early)
```

## Validation Rules

### Task Validation
- Title must be between 1 and 255 characters
- Description must be less than 1000 characters if provided
- Priority must be one of: low, medium, high
- Due date must be in the future if provided
- Tags must be unique and not exceed 10 per task
- Recurrence rule must be valid if provided

### Event Validation
- All events must have a valid timestamp
- Event data must conform to the appropriate schema
- Events must reference existing entities where applicable

## Relationships

### Task to User
- One-to-many relationship (one user can have many tasks)
- Foreign key: `userId` in Task references `id` in User

### Task to Events
- One-to-many relationship (one task can have many events)
- Events are linked to tasks via `taskId` field

### User to Events
- One-to-many relationship (one user can trigger many events)
- Events are linked to users via `userId` field

## Indexing Strategy

### Database Indexes
- `tasks.userId`: For efficient user-based queries
- `tasks.status`: For filtering by task status
- `tasks.dueDate`: For efficient due date queries
- `tasks.createdAt`: For chronological sorting

### Kafka Partitioning
- Partition by user ID to maintain ordering within user contexts
- Use consistent hashing for even distribution across partitions