---
id: 1-backend-todo-spec
title: "Backend Specifications for Todo App"
stage: spec
date: 2026-01-08
surface: agent
model: Claude Sonnet 4.5
feature: backend-todo-api
branch: 002-backend-todo-api
user: user
command: "/sp.specify"
labels: ["backend", "api", "todo-app", "specification"]
links:
  spec: "specs/002-backend-todo-api/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/002-backend-todo-api/spec.md"
  - "specs/002-backend-todo-api/plan.md"
  - "specs/002-backend-todo-api/research.md"
  - "specs/002-backend-todo-api/data-model.md"
  - "specs/002-backend-todo-api/quickstart.md"
  - "specs/002-backend-todo-api/tasks.md"
  - "specs/002-backend-todo-api/contracts/task-api-contract.md"
  - "specs/002-backend-todo-api/checklists/requirements.md"
tests: []
outcome: "Successfully created comprehensive backend specifications for the Todo app, including all required documentation artifacts for implementation."
evaluation: "Specification is complete and ready for the planning phase (/sp.plan). All user requirements were translated into clear, testable functional requirements with proper user scenarios and success criteria."
---

# Prompt History Record: Backend Specifications for Todo App

## PROMPT_TEXT

Backend specifications for Phase II: Todo Full-Stack Web Application

Target audience:
Claude Code (Spec-Kit Plus) implementing the FastAPI backend in a monorepo alongside an already-complete Next.js frontend.

Context:
- Frontend is already implemented in Next.js (App Router) with:
  - Task CRUD UI
  - Authentication hooks
  - JWT-based API client
  - Better Auth dependency installed
- Frontend expects REST endpoints under /api/*
- Authentication is handled on the frontend using Better Auth, issuing JWT tokens
- Backend must verify JWT tokens and enforce strict user isolation
- This is Phase II of a hackathon project and must strictly follow the given requirements
- No manual coding is allowed — spec-driven development only

Objective:
Produce complete, unambiguous backend specifications that allow Claude Code to implement a production-ready FastAPI backend that fully integrates with the existing frontend and completes Phase II of the hackathon.

Environment Variables (Securely in `.env` only, never expose in code):

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

Success criteria (ALL must be satisfied):
- Backend fully supports all frontend API calls without frontend changes
- All endpoints are secured via JWT (Authorization: Bearer <token>)
- User isolation is enforced

Phase II is considered complete when:
- Backend specs are finalized
- Claude Code can implement backend without manual edits
- Frontend connects successfully to backend
- All Phase II requirements are satisfied

## RESPONSE_TEXT

Successfully created comprehensive backend specifications for the Todo app, including all required documentation artifacts:
- Feature specification (specs/002-backend-todo-api/spec.md)
- Implementation plan (specs/002-backend-todo-api/plan.md)
- Research document (specs/002-backend-todo-api/research.md)
- Data model (specs/002-backend-todo-api/data-model.md)
- Quickstart guide (specs/002-backend-todo-api/quickstart.md)
- Tasks breakdown (specs/002-backend-todo-api/tasks.md)
- API contracts (specs/002-backend-todo-api/contracts/task-api-contract.md)
- Quality checklist (specs/002-backend-todo-api/checklists/requirements.md)

The specifications include detailed functional requirements for JWT authentication, user isolation, task CRUD operations, and database integration with Neon PostgreSQL. All requirements from the constitution have been incorporated, and the API contract matches exactly what the frontend expects.