# Data Model: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Created**: 2026-01-20

## Overview
This document defines the data entities and relationships for the AI-powered Todo Chatbot feature, including tasks, conversations, and messages.

## Entity Definitions

### Task Entity
- **Name**: Task
- **Description**: Represents a todo item that can be created, modified, completed, or deleted through natural language commands
- **Fields**:
  - id (UUID): Primary key, auto-generated
  - user_id (UUID): Foreign key linking to the user who owns the task
  - title (VARCHAR[255]): Task title, required
  - description (TEXT): Optional task description
  - status (VARCHAR[20]): Task status ('active', 'completed'), default 'active'
  - priority (INTEGER): Task priority level, default 0
  - due_date (TIMESTAMP): Optional due date for the task
  - created_at (TIMESTAMP): Timestamp when task was created, default CURRENT_TIMESTAMP
  - updated_at (TIMESTAMP): Timestamp when task was last updated, default CURRENT_TIMESTAMP
  - completed_at (TIMESTAMP): Timestamp when task was completed (nullable)

- **Validation Rules**:
  - Title must be between 1-255 characters
  - Status must be one of allowed values ('active', 'completed')
  - Priority must be a valid integer (suggest range -10 to 10)
  - Due date must be a valid future date if provided

- **Relationships**:
  - Belongs to User (via user_id foreign key)

### Conversation Entity
- **Name**: Conversation
- **Description**: Represents a user's chat session with the AI, containing the history of messages exchanged
- **Fields**:
  - id (UUID): Primary key, auto-generated
  - user_id (UUID): Foreign key linking to the user who owns the conversation
  - created_at (TIMESTAMP): Timestamp when conversation was started, default CURRENT_TIMESTAMP
  - updated_at (TIMESTAMP): Timestamp when conversation was last updated, default CURRENT_TIMESTAMP

- **Validation Rules**:
  - user_id must reference an existing user
  - created_at and updated_at are automatically managed

- **Relationships**:
  - Belongs to User (via user_id foreign key)
  - Has Many Messages (via conversation_id foreign key)

### Message Entity
- **Name**: Message
- **Description**: An individual message in a conversation, either from the user or the AI assistant
- **Fields**:
  - id (UUID): Primary key, auto-generated
  - conversation_id (UUID): Foreign key linking to the conversation
  - user_id (UUID): Foreign key linking to the user who sent the message
  - role (VARCHAR[20]): Message role ('user', 'assistant'), required
  - content (TEXT): The actual message content, required
  - tool_calls (JSONB): JSON array of MCP tool calls executed, nullable
  - created_at (TIMESTAMP): Timestamp when message was created, default CURRENT_TIMESTAMP

- **Validation Rules**:
  - Content must be between 1-500 characters (enforced by application)
  - Role must be one of allowed values ('user', 'assistant')
  - conversation_id must reference an existing conversation
  - user_id must reference an existing user

- **Relationships**:
  - Belongs to Conversation (via conversation_id foreign key)
  - Belongs to User (via user_id foreign key)

## Indexing Strategy

### Primary Indexes
- Task.id: Primary key index
- Conversation.id: Primary key index
- Message.id: Primary key index

### Secondary Indexes
- Task.user_id: Index for efficient user-based queries
- Task.status: Index for status-based filtering
- Conversation.user_id: Index for user conversation lookup
- Message.conversation_id: Index for conversation message retrieval
- Message.created_at: Index for chronological ordering
- Task.created_at: Index for creation date queries

## Constraints

### Foreign Key Constraints
- Task.user_id → User.id
- Conversation.user_id → User.id
- Message.conversation_id → Conversation.id
- Message.user_id → User.id

### Check Constraints
- Task.status IN ('active', 'completed')
- Message.role IN ('user', 'assistant')

## Relationship Diagram
```
User (1) ←→ (Many) Task
User (1) ←→ (Many) Conversation
Conversation (1) ←→ (Many) Message
User (1) ←→ (Many) Message
```

## State Transitions

### Task Status Transitions
- active → completed (via complete_task MCP tool)
- completed → active (via update_task MCP tool)

## Access Patterns

### Common Queries
1. Get all tasks for a user: `SELECT * FROM tasks WHERE user_id = ?`
2. Get tasks with specific status: `SELECT * FROM tasks WHERE user_id = ? AND status = ?`
3. Get conversation history: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at`
4. Get last N messages in conversation: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?`

## Size Estimates
- Average task title: 50 characters
- Average message content: 100 characters
- Estimated 50 messages per conversation (as per requirement)
- Estimated 10-50 tasks per user