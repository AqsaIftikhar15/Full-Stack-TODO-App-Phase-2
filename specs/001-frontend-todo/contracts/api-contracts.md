# API Contracts: Frontend Todo Web Application

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Register a new user account
**Request**:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```
**Response**:
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```
**Authentication**: None required

### POST /api/auth/login
**Description**: Authenticate user and return JWT token
**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```
**Authentication**: None required

### POST /api/auth/logout
**Description**: Invalidate user session
**Response**: 200 OK
**Authentication**: JWT token required in Authorization header

## Task Management Endpoints

### GET /api/{user_id}/tasks
**Description**: Retrieve all tasks for authenticated user
**Response**:
```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "userId": "string",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ]
}
```
**Authentication**: JWT token required in Authorization header

### POST /api/{user_id}/tasks
**Description**: Create a new task for authenticated user
**Request**:
```json
{
  "title": "string",
  "description": "string"
}
```
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "userId": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```
**Authentication**: JWT token required in Authorization header

### PUT /api/{user_id}/tasks/{id}
**Description**: Update an existing task for authenticated user
**Request**:
```json
{
  "title": "string",
  "description": "string"
}
```
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "userId": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```
**Authentication**: JWT token required in Authorization header

### PATCH /api/{user_id}/tasks/{id}/complete
**Description**: Toggle task completion status for authenticated user
**Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "userId": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```
**Authentication**: JWT token required in Authorization header

### DELETE /api/{user_id}/tasks/{id}
**Description**: Delete a task for authenticated user
**Response**: 204 No Content
**Authentication**: JWT token required in Authorization header

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required or token invalid"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied to requested resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Requested resource does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```