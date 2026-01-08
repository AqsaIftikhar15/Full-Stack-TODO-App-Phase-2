# API Contracts: Backend API for Todo Full-Stack Web Application

## Authentication API Contract

### POST /api/auth/login
**Description**: Authenticates user and returns JWT token
**Expected by frontend**: Not directly used since authentication handled by Better Auth on frontend

### POST /api/auth/signup
**Description**: Creates new user account
**Expected by frontend**: Not directly used since authentication handled by Better Auth on frontend

## Task Management API Contracts

### GET /api/{user_id}/tasks
**Description**: Retrieve all tasks for a specific user
**Authentication**: Required - JWT token in Authorization header
**Request**:
- Headers: `Authorization: Bearer <valid_jwt_token>`
- Path Params: `user_id` (should match authenticated user ID)
**Response (200)**:
```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string or null",
      "completed": true/false,
      "user_id": "string",
      "created_at": "ISO 8601 datetime string",
      "updated_at": "ISO 8601 datetime string"
    }
  ]
}
```
**Error Responses**:
- 401: Unauthorized (invalid/missing JWT token)
- 403: Forbidden (user_id doesn't match authenticated user)
- 404: User not found
- 500: Internal server error

### POST /api/{user_id}/tasks
**Description**: Create a new task for the specified user
**Authentication**: Required - JWT token in Authorization header
**Request**:
- Headers: `Authorization: Bearer <valid_jwt_token>`
- Path Params: `user_id` (should match authenticated user ID)
- Body:
```json
{
  "title": "string",
  "description": "string (optional)"
}
```
**Response (201)**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": false,
  "user_id": "string",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```
**Error Responses**:
- 400: Bad request (invalid input data)
- 401: Unauthorized (invalid/missing JWT token)
- 403: Forbidden (user_id doesn't match authenticated user)
- 404: User not found
- 500: Internal server error

### GET /api/{user_id}/tasks/{id}
**Description**: Retrieve a specific task for the specified user
**Authentication**: Required - JWT token in Authorization header
**Request**:
- Headers: `Authorization: Bearer <valid_jwt_token>`
- Path Params: `user_id` (should match authenticated user ID), `id` (task ID)
**Response (200)**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": true/false,
  "user_id": "string",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```
**Error Responses**:
- 401: Unauthorized (invalid/missing JWT token)
- 403: Forbidden (user_id doesn't match authenticated user, or task doesn't belong to user)
- 404: Task not found
- 500: Internal server error

### PUT /api/{user_id}/tasks/{id}
**Description**: Update a specific task for the specified user
**Authentication**: Required - JWT token in Authorization header
**Request**:
- Headers: `Authorization: Bearer <valid_jwt_token>`
- Path Params: `user_id` (should match authenticated user ID), `id` (task ID)
- Body:
```json
{
  "title": "string",
  "description": "string (optional)"
}
```
**Response (200)**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": true/false,
  "user_id": "string",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```
**Error Responses**:
- 400: Bad request (invalid input data)
- 401: Unauthorized (invalid/missing JWT token)
- 403: Forbidden (user_id doesn't match authenticated user, or task doesn't belong to user)
- 404: Task not found
- 500: Internal server error

### PATCH /api/{user_id}/tasks/{id}/complete
**Description**: Toggle completion status of a specific task
**Authentication**: Required - JWT token in Authorization header
**Request**:
- Headers: `Authorization: Bearer <valid_jwt_token>`
- Path Params: `user_id` (should match authenticated user ID), `id` (task ID)
**Response (200)**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": true/false (toggled),
  "user_id": "string",
  "created_at": "ISO 8601 datetime string",
  "updated_at": "ISO 8601 datetime string"
}
```
**Error Responses**:
- 401: Unauthorized (invalid/missing JWT token)
- 403: Forbidden (user_id doesn't match authenticated user, or task doesn't belong to user)
- 404: Task not found
- 500: Internal server error

### DELETE /api/{user_id}/tasks/{id}
**Description**: Delete a specific task for the specified user
**Authentication**: Required - JWT token in Authorization header
**Request**:
- Headers: `Authorization: Bearer <valid_jwt_token>`
- Path Params: `user_id` (should match authenticated user ID), `id` (task ID)
**Response (204)**: No content
**Error Responses**:
- 401: Unauthorized (invalid/missing JWT token)
- 403: Forbidden (user_id doesn't match authenticated user, or task doesn't belong to user)
- 404: Task not found
- 500: Internal server error