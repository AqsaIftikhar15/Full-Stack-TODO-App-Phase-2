# Research: Backend API for Todo Full-Stack Web Application

**Feature**: 002-backend-todo-api | **Date**: 2026-01-08

## Executive Summary

Research for implementing a FastAPI backend that integrates with the existing Next.js frontend. The backend will provide JWT-verified REST API endpoints, connect to Neon Serverless PostgreSQL, and enforce user isolation as required by the constitution.

## Architecture Options

### 1. FastAPI with SQLModel + Neon PostgreSQL
- **Pros**:
  - FastAPI provides excellent performance and automatic API documentation
  - SQLModel offers compatibility with both SQLAlchemy and Pydantic
  - Neon PostgreSQL is serverless and scales automatically
  - Strong type hints and validation
- **Cons**:
  - Learning curve for team unfamiliar with Python ecosystem
  - Potential cold start issues with serverless database
- **Verdict**: Selected as it aligns with constitution requirements

### 2. Authentication Approach
- **Option A**: Custom JWT implementation with PyJWT
  - Pros: Full control over token creation/validation
  - Cons: More complex to implement securely
- **Option B**: Integration with Better Auth
  - Pros: Pre-built solution, aligns with frontend implementation
  - Cons: Need to ensure backend can verify tokens issued by frontend auth
- **Selected**: Custom JWT implementation using BETTER_AUTH_SECRET to verify tokens from frontend

## Technology Deep Dive

### FastAPI Framework
- Modern, fast (high-performance) web framework for building APIs with Python 3.7+
- Built-in support for asynchronous operations
- Automatic interactive API documentation (Swagger UI and ReDoc)
- Strong typing support with Pydantic
- Dependency injection system for handling request dependencies

### SQLModel ORM
- Combines SQLAlchemy and Pydantic
- Allows using the same models for database operations and API validation
- Designed by the same creator as FastAPI
- Supports async operations with databases
- Provides type safety and autocompletion

### Neon Serverless PostgreSQL
- Serverless PostgreSQL database
- Automatically scales compute down to zero when inactive
- Pay-per-use pricing model
- Compatible with PostgreSQL protocol
- Supports branching for development environments

## API Design Patterns

### RESTful Endpoint Structure
Following the frontend's expected API contract:
```
GET    /api/{user_id}/tasks      # Get user's tasks
POST   /api/{user_id}/tasks      # Create new task for user
GET    /api/{user_id}/tasks/{id} # Get specific task
PUT    /api/{user_id}/tasks/{id} # Update task
PATCH  /api/{user_id}/tasks/{id}/complete # Toggle task completion
DELETE /api/{user_id}/tasks/{id} # Delete task
```

### JWT Authentication Flow
1. Frontend handles authentication via Better Auth
2. Frontend receives JWT token
3. Frontend sends token in Authorization header: `Authorization: Bearer <token>`
4. Backend verifies token using BETTER_AUTH_SECRET
5. Backend extracts user ID from token payload
6. Backend enforces user isolation based on extracted user ID

## Security Considerations

### JWT Token Validation
- Verify signature using BETTER_AUTH_SECRET
- Check token expiration
- Extract user identity from claims
- Ensure tokens cannot be tampered with

### User Isolation
- All endpoints must validate that requested resources belong to the authenticated user
- Prevent user A from accessing user B's data
- Validate user_id in URL path matches authenticated user

### Input Validation
- Use Pydantic models to validate all incoming data
- Sanitize and validate all user inputs
- Implement rate limiting to prevent abuse

## Database Schema Design

### User Model
- Primary key: UUID
- Fields: id, email, name, created_at, updated_at
- Constraints: email uniqueness

### Task Model
- Primary key: UUID
- Fields: id, title, description, completed, user_id (foreign key), created_at, updated_at
- Constraints: foreign key relationship to user, user cascade delete

## Implementation Approach

### Phase 1: Core Infrastructure
1. Set up FastAPI application structure
2. Configure SQLModel and database connection
3. Implement JWT validation middleware
4. Create database models

### Phase 2: Authentication Layer
1. Implement JWT token verification
2. Create dependency for getting current user
3. Add authentication middleware
4. Test token validation with frontend-issued tokens

### Phase 3: API Endpoints
1. Implement task CRUD operations
2. Add user isolation enforcement
3. Create Pydantic schemas for request/response validation
4. Test all endpoints with authenticated requests

### Phase 4: Testing and Deployment
1. Write comprehensive tests for all endpoints
2. Set up Docker configuration
3. Configure environment variables
4. Test integration with frontend

## Risk Assessment

### High Risk
- JWT token compatibility between frontend and backend - need to ensure tokens issued by Better Auth can be verified by backend
- Database connection issues with serverless Neon PostgreSQL
- User isolation implementation - critical for security

### Medium Risk
- Performance under load with serverless database
- Cold start times affecting API response
- CORS configuration between frontend and backend

### Low Risk
- FastAPI learning curve for team members
- Dependency management and version conflicts
- Documentation completeness

## Dependencies Analysis

### Core Dependencies
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `sqlmodel`: ORM and validation
- `pyjwt`: JWT token handling
- `psycopg2-binary`: PostgreSQL adapter
- `python-multipart`: Form data handling

### Development Dependencies
- `pytest`: Testing framework
- `httpx`: HTTP testing client
- `black`: Code formatting
- `flake8`: Linting
- `mypy`: Type checking

## Environment Configuration

### Required Environment Variables
- `DATABASE_URL`: Connection string for Neon PostgreSQL
- `BETTER_AUTH_SECRET`: Secret for JWT token verification
- `JWT_ALGORITHM`: Algorithm used for token signing
- `ALLOWED_ORIGINS`: CORS configuration for frontend
- `ENVIRONMENT`: Development/production mode

## Integration Points

### With Frontend
- API endpoints must match exactly what the frontend expects
- Response format must match frontend's API client expectations
- JWT token validation must work with tokens issued by Better Auth

### With Database
- Proper connection pooling configuration
- Migration system for schema changes
- Backup and recovery procedures

## Open Questions

1. How will Better Auth tokens issued on the frontend be compatible with backend verification?
2. What specific claims are included in Better Auth JWT tokens?
3. How should the backend handle token refresh scenarios?
4. What is the expected load and concurrency for the application?