# Quickstart Guide: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Created**: 2026-01-20

## Overview
This guide provides instructions for setting up and running the AI-powered Todo Chatbot feature.

## Prerequisites
- Python 3.9+
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL-compatible database (Neon recommended)
- Access to Cohere API

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
NEON_DATABASE_URL="your_neon_database_url_here"

# Authentication
BETTER_AUTH_SECRET="your_auth_secret_here"
BETTER_AUTH_URL="http://localhost:8000"

# AI Service Configuration
OPENAI_API_BASE="https://api.cohere.ai/v1"  # For OpenAI-compatible endpoint

# Application Settings
APP_ENV="development"
DEBUG="true"
```

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 4. Set Up Database
```bash
# Run database migrations
cd backend
python -m alembic upgrade head
```

### 5. Start MCP Server
```bash
# In a separate terminal
cd backend/mcp-server
python mcp_server.py
```

### 6. Start Backend Service
```bash
# In a separate terminal
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 7. Start Frontend
```bash
# In a separate terminal
cd frontend
npm run dev
```

## Running the Application

### Development Mode
1. Ensure all services are running (database, MCP server, backend, frontend)
2. Access the application at `http://localhost:3000`
3. Use the ChatKit UI to interact with the AI-powered Todo Chatbot

### Production Mode
1. Build the frontend: `npm run build`
2. Use Docker Compose to run all services:
   ```bash
   docker-compose up --build
   ```

## Key Features

### Natural Language Task Management
- Add tasks: "Add a task to buy groceries"
- List tasks: "Show me my tasks"
- Complete tasks: "Mark the grocery task as complete"
- Update tasks: "Change the deadline for my project task to Friday"
- Delete tasks: "Delete the old appointment task"

### Conversation Context
- The AI maintains context for up to 50 message exchanges
- Conversations persist across sessions
- Context-aware task management

### Error Handling
- Graceful degradation when AI services are unavailable
- User-friendly error messages
- Fallback responses during service outages

## Testing

### Unit Tests
```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm run test
```

### Integration Tests
```bash
# End-to-end tests
cd backend
python -m pytest tests/integration/
```

## Troubleshooting

### Common Issues
1. **AI Service Unavailable**: Check that the COHERE_API_KEY is correctly configured
2. **Database Connection**: Verify DATABASE_URL is correct and database is accessible
3. **Authentication Issues**: Ensure BETTER_AUTH_SECRET matches between frontend and backend

### API Rate Limits
- The system limits users to 3 concurrent AI requests
- Requests exceeding this limit will receive a 429 status code
- Implement retry logic with exponential backoff for production applications

## Next Steps
1. Review the API documentation in `contracts/chat-api.yaml`
2. Explore the data models in `data-model.md`
3. Customize the UI components in the frontend directory
4. Extend the MCP tools in the backend if additional functionality is needed