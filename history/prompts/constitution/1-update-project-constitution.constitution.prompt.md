---
id: 1
title: update-project-constitution
stage: constitution
date: 2026-01-03
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: main
user: user
command: /sp.constitution
labels: [constitution, setup, configuration]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```
/sp.constitution

Project: Full-Stack Todo Web Application

Objective:
Create a modern, multi-user full-stack Todo web application with persistent storage using Claude Code and Spec-Kit Plus, implementing all core Todo functionalities in a secure, scalable, and extensible architecture.

Core principles:
- Spec-driven development (specs are the single source of truth)
- Agentic Dev Stack workflow enforcement
- No manual coding outside Claude Code
- Clear separation of frontend and backend responsibilities
- Secure, user-isolated data access
- Extensibility for future phases and features

Development approach:
- Strictly follow the Agentic Dev Stack workflow:
  Write spec → Generate plan → Break into tasks → Implement via Claude Code
- All implementation must be driven by Spec-Kit Plus specifications
- All code changes must be traceable to specs and prompts
- No feature may be implemented without a corresponding spec

Functional requirements:
- Implement the five basic Todo features:
  - Add task
  - Delete task
  - Update task
  - View tasks
  - Mark task as complete or incomplete
- Build the application as a web-based, multi-user system
- All task operations must be authenticated and user-scoped

Technology constraints:
Frontend:
- Next.js 16+ using App Router
- TypeScript
- Responsive UI design

Backend:
- Python FastAPI
- RESTful API architecture

ORM:
- SQLModel

Database:
- Neon Serverless PostgreSQL

Authentication:
- Better Auth on frontend
- JWT-based authentication for backend verification

API standards:
- All API routes must be prefixed with /api/
- Required endpoints:
  - GET    /api/{user_id}/tasks
  - POST   /api/{user_id}/tasks
  - GET    /api/{user_id}/tasks/{id}
  - PUT    /api/{user_id}/tasks/{id}
  - DELETE /api/{user_id}/tasks/{id}
  - PATCH  /api/{user_id}/tasks/{id}/complete
- All endpoints must require a valid JWT token
- Requests without valid authentication must return HTTP 401 Unauthorized
- Task ownership must be enforced for every operation

Authentication and security rules:
- Better Auth must issue JWT tokens upon successful login
- Frontend must attach JWT tokens to every API request using:
  Authorization: Bearer <token>
- Backend must verify JWT tokens using a shared secret
- Backend must extract user identity from the JWT
- Backend must ensure the authenticated user matches the requested user_id
- The shared secret must be provided via environment variable BETTER_AUTH_SECRET
- Stateless authentication must be enforced

Data and persistence rules:
- All task data must be stored persistently in Neon PostgreSQL
- Each user may only access their own tasks
- Backend must filter all database queries by authenticated user
- SQLModel must be used for all database interactions

Repository and project structure constraints:
- The project must use a Spec-Kit Plus compatible monorepo structure:

  hackathon-todo/
  ├── .spec-kit/
  │   ── authentication.md
  │   │   └── chatbot.md
  │   ├── api/
  │   │   ├── rest-endpoints.md
  │   │   └── mcp-tools.md
  │   ├── database/
  │   │   └── schema.md
  │   └── ui/
  │       ├── components.md
  │       └── pages.md
  ├── CLAUDE.md
  ├── frontend/
  │   ├── CLAUDE.md
  │   └── (Next.js application)
  ├── backend/
  │   ├── CLAUDE.md
  │   └── (FastAPI application)
  ├── docker-compose.yml
  └── README.md

Docker and containerization rules:
- Docker must be part of the project architecture
- A docker-compose.yml file must be present at the repository root
- Frontend and backend must be containerizable
- Docker configuration must support running the full stack via docker-compose
- Environment variables must be configurable for Docker-based execution
- Docker usage must not alter application logic or API behavior

Spec usage rules:
- Specs are authoritative and override assumptions
- Specs must be referenced using @specs/... notation
- Specs must be updated if requirements change
- Claude Code must read relevant specs before implementation

Success criteria:
- All five Todo features function correctly in the web application
- Authentication and authorization are enforced end-to-end
- Data is persisted in the database and scoped per user
- REST API matches documented endpoints
- Project structure matches Spec-Kit Plus conventions
- Docker artifacts are present and valid
- Phase II is complete and ready for extension in Phase III, IV, and V
```

## Response snapshot

Updated the project constitution file (.specify/memory/constitution.md) with project-specific values for the Full-Stack Todo Web Application, including:

- Core Principles (Spec-Driven Development, Agentic Dev Stack Workflow, Technology Stack Compliance, Security-First Architecture, Container-First Deployment, Multi-User Data Isolation)
- Additional Constraints (Technology stack requirements)
- Development Workflow (API route patterns and authentication requirements)
- Governance (Constitution enforcement and compliance)

## Outcome

- ✅ Impact: Created initial project constitution with all required principles and constraints
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: Can proceed with spec generation using /sp.specify
- 🧠 Reflection: Constitution now properly reflects the project requirements and constraints

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate initial feature specification