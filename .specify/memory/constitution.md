<!--
Sync Impact Report:
Version change: N/A (initial constitution) → 1.0.0
Added sections: Full project constitution with all principles
Templates requiring updates: N/A (this is the initial version)
-->

# Full-Stack Todo Web Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development must be driven by specifications; No feature may be implemented without a corresponding spec; Specs are authoritative and override assumptions; All code changes must be traceable to specs and prompts.

### II. Agentic Dev Stack Workflow
Strictly follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code; All implementation must be driven by Spec-Kit Plus specifications; No manual coding outside Claude Code tools.

### III. Technology Stack Compliance
Frontend must use Next.js 16+ with TypeScript and App Router; Backend must use Python FastAPI with RESTful API architecture; Database must use Neon Serverless PostgreSQL with SQLModel ORM; Authentication must use Better Auth with JWT-based verification.

### IV. Security-First Architecture
All API routes must be prefixed with /api/ and require valid JWT tokens; Task ownership must be enforced for every operation; User data must be isolated and scoped per authenticated user; Stateless authentication must be enforced throughout the application.

### V. Container-First Deployment
Docker must be part of the project architecture; A docker-compose.yml file must be present at repository root; Frontend and backend must be containerizable; Docker configuration must support running the full stack via docker-compose.

### VI. Multi-User Data Isolation
All task operations must be authenticated and user-scoped; Each user may only access their own tasks; Backend must filter all database queries by authenticated user; SQLModel must be used for all database interactions with proper user filtering.

## Additional Constraints

Technology stack requirements:
- Frontend: Next.js 16+, TypeScript, Responsive UI design
- Backend: Python FastAPI, RESTful API architecture
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth on frontend, JWT-based authentication for backend verification
- API standards: All endpoints must follow documented REST patterns

## Development Workflow

All API routes must be prefixed with /api/ and follow these patterns:
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

Frontend must attach JWT tokens to every API request using: Authorization: Bearer <token>
Backend must verify JWT tokens using a shared secret provided via environment variable BETTER_AUTH_SECRET
All requests without valid authentication must return HTTP 401 Unauthorized

## Governance

Constitution supersedes all other practices; Amendments require documentation and approval; All development must verify compliance with these principles; Use CLAUDE.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03