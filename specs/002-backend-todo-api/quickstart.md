# Quickstart Guide: Backend API for Todo Full-Stack Web Application

**Feature**: 002-backend-todo-api | **Date**: 2026-01-08

## Overview

Quickstart guide to set up and run the FastAPI backend for the todo application. This guide covers installation, configuration, and initial run instructions.

## Prerequisites

- Python 3.11 or higher
- PostgreSQL-compatible database (Neon Serverless PostgreSQL)
- Git
- Docker (optional, for containerized deployment)
- pip (Python package installer)

## Installation

### 1. Clone the Repository
```bash
git clone [repository-url]
cd [repository-directory]
```

### 2. Set up Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

## Configuration

### 1. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_6thPUwz3pAVB@ep-patient-smoke-adqu4twg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_SSL_MODE=require
DATABASE_POOL_SIZE=10
BETTER_AUTH_SECRET=6LrD8qcJ3LL8E70MePBpWRO9y715IEZB
JWT_SECRET=6LrD8qcJ3LL8E70MePBpWRO9y715IEZB
JWT_ALGORITHM=HS256
JWT_EXPIRY_DAYS=7
API_BASE_URL=http://localhost:8000/api
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
DEBUG=True
```

### 2. Database Setup

Run database migrations to create the required tables:

```bash
cd backend
alembic upgrade head
```

## Running the Application

### Development Mode
```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Production Mode
```bash
cd backend
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Docker Deployment

### Building the Image
```bash
docker build -t todo-backend .
```

### Running with Docker
```bash
docker run -p 8000:8000 --env-file .env todo-backend
```

### Running with Docker Compose
```bash
docker-compose up -d
```

## API Endpoints

Once running, the following endpoints will be available:

- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create new task for user
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion
- `DELETE /api/{user_id}/tasks/{id}` - Delete task

## Testing

### Run Unit Tests
```bash
cd backend
pytest tests/
```

### Run Specific Test Module
```bash
cd backend
pytest tests/test_tasks.py
```

### Run with Coverage
```bash
cd backend
pytest --cov=src tests/
```

## Database Migrations

### Generate New Migration
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
cd backend
alembic upgrade head
```

### Downgrade Migrations
```bash
cd backend
alembic downgrade -1
```

## Environment Modes

### Development
- `ENVIRONMENT=development`
- `DEBUG=True`
- Auto-reload enabled
- Detailed error messages

### Production
- `ENVIRONMENT=production`
- `DEBUG=False`
- No auto-reload
- Minimal error messages

## Frontend Integration

The backend is designed to work seamlessly with the existing Next.js frontend:

1. Frontend makes requests to `http://localhost:8000/api` (configurable via API_BASE_URL)
2. Frontend attaches JWT tokens to requests via `Authorization: Bearer <token>` header
3. Backend validates tokens using BETTER_AUTH_SECRET
4. Backend enforces user isolation based on authenticated user ID

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify DATABASE_URL is correct
- Check network connectivity to the database
- Ensure SSL settings match database requirements

#### Authentication Failures
- Verify BETTER_AUTH_SECRET matches frontend configuration
- Check that JWT tokens are properly formatted
- Ensure token expiration is handled correctly

#### CORS Errors
- Verify ALLOWED_ORIGINS includes frontend URL
- Check that frontend is making requests from expected origin

#### Port Conflicts
- Change port in uvicorn command if 8000 is occupied
- Update frontend configuration if using different port

### Checking Logs
```bash
# Check application logs
tail -f logs/app.log

# Or if using Docker
docker logs todo-backend-container
```

## Next Steps

1. Review the API documentation at `http://localhost:8000/docs`
2. Test API endpoints with the frontend application
3. Configure environment variables for your deployment environment
4. Set up monitoring and logging for production use
5. Review security settings before production deployment