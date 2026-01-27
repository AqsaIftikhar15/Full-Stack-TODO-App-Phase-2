<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Added sections: VII. AI-Powered Chatbot Integration, VIII. Agent-First Orchestration, IX. MCP Architecture Compliance
Modified principles: III. Technology Stack Compliance, IV. Security-First Architecture, VI. Multi-User Data Isolation
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md, ⚠️ .specify/templates/commands/*.md
Follow-up TODOs: None
-->

# Full-Stack Todo Web Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development must be driven by specifications; No feature may be implemented without a corresponding spec; Specs are authoritative and override assumptions; All code changes must be traceable to specs and prompts.

### II. Agentic Dev Stack Workflow
Strictly follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code; All implementation must be driven by Spec-Kit Plus specifications; No manual coding outside Claude Code tools.

### III. Technology Stack Compliance
Frontend must use Next.js 16+ with TypeScript and App Router; Backend must use Python FastAPI with SQLModel + Neon PostgreSQL + Better Auth; Database must use Neon Serverless PostgreSQL with SQLModel ORM; Authentication must use Better Auth with JWT-based verification; Backend must remain stateless with all conversation and task state persisted in Neon PostgreSQL database.

### IV. Security-First Architecture
All API routes must be prefixed with /api/ and require valid JWT tokens; Task ownership must be enforced for every operation; User data must be isolated and scoped per authenticated user; Stateless authentication must be enforced throughout the application; MCP tools must validate parameters and return structured JSON; All tool calls must be idempotent, error-handled, and associated with correct user_id.

### V. Container-First Deployment
Docker must be part of the project architecture; A docker-compose.yml file must be present at repository root; Frontend and backend must be containerizable; Docker configuration must support running the full stack via docker-compose; Deployment must follow domain allowlist configuration for ChatKit.

### VI. Multi-User Data Isolation
All task operations must be authenticated and user-scoped; Each user may only access their own tasks; Backend must filter all database queries by authenticated user; SQLModel must be used for all database interactions with proper user filtering; Conversation history stored in database; server holds no state.

### VII. AI-Powered Chatbot Integration
Natural language interface: frontend ChatKit UI accepts only natural language commands; no manual CRUD functionality; UI must not implement manual task management; only display tasks and AI confirmations; All user messages handled via agents and MCP tools; Task operations fully functional through natural language commands; UI renders tasks, confirmations, and errors correctly without manual CRUD functionality.

### VIII. Agent-First Orchestration
All task operations handled by defined agents (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent); Deterministic execution: tasks are managed only via MCP tools (add_task, list_tasks, update_task, complete_task, delete_task); agents do not execute operations directly; ConversationAgent manages conversational flow and user-facing responses; IntentParserAgent analyzes user messages to detect task-related intent; TodoManagerAgent handles all task-related actions; UserContextAgent manages and validates user identity and context.

### IX. MCP Architecture Compliance
Stateless architecture: backend remains stateless; all conversation and task state persisted in Neon PostgreSQL database; MCP tools must validate parameters and return structured JSON; Chat API endpoint `/api/{user_id}/chat` handles messages and returns structured AI responses and tool calls; API integration: OpenAI Agents SDK code executed via Cohere API key for AI reasoning and agent orchestration; All tool calls must be idempotent, error-handled, and associated with correct user_id; Conversation state must persist; backend must remain stateless and horizontally scalable; Cohere API key used for executing OpenAI Agents SDK securely.

## Additional Constraints

Technology stack requirements:
- Frontend: Next.js 16+, TypeScript, Responsive UI design, ChatKit UI for natural language interaction
- Backend: Python FastAPI, SQLModel + Neon PostgreSQL + Better Auth, stateless architecture
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth on frontend, JWT-based authentication for backend verification
- API standards: All endpoints must follow documented REST patterns
- AI Integration: OpenAI Agents SDK via Cohere API key for AI reasoning
- Agent Architecture: Defined agents (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent)
- MCP Tools: add_task, list_tasks, update_task, complete_task, delete_task for deterministic execution
- State Management: Conversation and task state persisted in Neon PostgreSQL database; server holds no state

## Development Workflow

All API routes must be prefixed with /api/ and follow these patterns:
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete
- POST   /api/{user_id}/chat (handles natural language messages and returns structured AI responses and tool calls)

Frontend must attach JWT tokens to every API request using: Authorization: Bearer <token>
Backend must verify JWT tokens using a shared secret provided via environment variable BETTER_AUTH_SECRET
All requests without valid authentication must return HTTP 401 Unauthorized
No manual coding for AI logic; all agents and workflows generated via Claude Code / Spec-Kit Plus
Conversation state must persist; backend must remain stateless and horizontally scalable
Cohere API key used securely to execute OpenAI Agents SDK logic

## Governance

Constitution supersedes all other practices; Amendments require documentation and approval; All development must verify compliance with these principles; Use CLAUDE.md for runtime development guidance; No manual coding for AI logic; all agents and workflows generated via Claude Code / Spec-Kit Plus; All task operations handled by defined agents and MCP tools; Backend must remain stateless with all conversation and task state persisted in Neon PostgreSQL database.

**Version**: 1.1.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-20