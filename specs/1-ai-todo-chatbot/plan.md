# Implementation Plan: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Branch**: 1-ai-todo-chatbot
**Created**: 2026-01-20
**Status**: Draft

## Technical Context

This plan implements the AI-powered Todo Chatbot feature according to the specification. The system will use a stateless architecture with OpenAI Agents SDK executed via Cohere API, MCP server for task operations, and Neon PostgreSQL for persistence.

### Architecture Components
- **Frontend**: ChatKit UI for natural language interaction
- **Backend**: FastAPI server with stateless chat endpoint
- **AI Layer**: OpenAI Agents SDK via Cohere API
- **Agent Layer**: UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent
- **MCP Server**: Official MCP SDK with task tools
- **Database**: Neon PostgreSQL with SQLModel ORM
- **Authentication**: Better Auth with JWT-based verification

### Unknowns & Dependencies
- [RESOLVED]: Specific Cohere API configuration parameters - Using Cohere's OpenAI-compatible endpoint
- [RESOLVED]: MCP server setup and configuration details - Using Official MCP SDK with defined tools
- [RESOLVED]: OpenAI Agents SDK integration patterns with Cohere - Using Cohere's OpenAI-compatible endpoint to run OpenAI Agents SDK

## Constitution Check

Reviewing the constitution principles to ensure compliance:

### I. Spec-Driven Development (NON-NEGOTIABLE)
✅ All development must be driven by specifications
✅ No feature may be implemented without a corresponding spec
✅ Specs are authoritative and override assumptions
✅ All code changes must be traceable to specs and prompts

### II. Agentic Dev Stack Workflow
✅ Follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code
✅ All implementation must be driven by Spec-Kit Plus specifications
✅ No manual coding outside Claude Code tools

### III. Technology Stack Compliance
✅ Backend uses Python FastAPI with SQLModel + Neon PostgreSQL + Better Auth
✅ Backend remains stateless with all conversation and task state persisted in Neon PostgreSQL database

### IV. Security-First Architecture
✅ All tool calls must be idempotent, error-handled, and associated with correct user_id
✅ MCP tools must validate parameters and return structured JSON

### V. Container-First Deployment
✅ Deployment follows domain allowlist configuration for ChatKit

### VI. Multi-User Data Isolation
✅ Backend filters all database queries by authenticated user
✅ Conversation history stored in database; server holds no state

### VII. AI-Powered Chatbot Integration
✅ Natural language interface: frontend ChatKit UI accepts only natural language commands
✅ UI does not implement manual task management; only displays tasks and AI confirmations
✅ All user messages handled via agents and MCP tools
✅ Task operations fully functional through natural language commands

### VIII. Agent-First Orchestration
✅ All task operations handled by defined agents (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent)
✅ Tasks managed only via MCP tools (add_task, list_tasks, update_task, complete_task, delete_task)
✅ Agents do not execute operations directly

### IX. MCP Architecture Compliance
✅ Backend remains stateless; all conversation and task state persisted in Neon PostgreSQL database
✅ Chat API endpoint `/api/{user_id}/chat` handles messages and returns structured AI responses and tool calls
✅ All tool calls must be idempotent, error-handled, and associated with correct user_id

## Gates

### Gate 1: Architecture Compatibility
**Status**: PASS - Architecture aligns with existing stack and constitutional requirements

### Gate 2: Agent-First Compliance
**Status**: PASS - All task operations will be handled through MCP tools via agents

### Gate 3: Statelessness Verification
**Status**: PASS - Backend will remain stateless with all state stored in database

### Gate 4: Security Compliance
**Status**: PASS - All operations will be authenticated and user-scoped

## Phase 0: Outline & Research

### Research Tasks

#### RT-001: Cohere API Configuration
- **Decision**: Determine proper configuration for Cohere API with OpenAI Agents SDK
- **Rationale**: Need to understand how to properly integrate Cohere API for AI execution
- **Alternatives considered**: Direct OpenAI API vs Cohere API via proxy

#### RT-002: MCP Server Setup
- **Decision**: Determine MCP server implementation approach and configuration
- **Rationale**: MCP tools are essential for task operations per constitution
- **Alternatives considered**: Official MCP SDK vs custom implementation

#### RT-003: Agent Orchestration Patterns
- **Decision**: Determine optimal patterns for agent-to-agent communication
- **Rationale**: Need to ensure smooth handoff between agents per specification
- **Alternatives considered**: Sequential vs parallel agent execution

## Phase 1: Design & Contracts

### Data Model

#### Task Entity
- **Fields**: id (UUID), user_id (UUID), title (string), description (text), status (enum), priority (int), due_date (timestamp), created_at (timestamp), updated_at (timestamp), completed_at (timestamp)
- **Validation**: Title required, max length constraints, valid status values
- **Relationships**: Belongs to User

#### Conversation Entity
- **Fields**: id (UUID), user_id (UUID), created_at (timestamp), updated_at (timestamp)
- **Validation**: User_id required and must exist
- **Relationships**: Belongs to User, Has Many Messages

#### Message Entity
- **Fields**: id (UUID), conversation_id (UUID), user_id (UUID), role (enum), content (text), tool_calls (JSON), created_at (timestamp)
- **Validation**: Content max 500 characters, valid role values ('user'/'assistant')
- **Relationships**: Belongs to Conversation, Belongs to User

### API Contracts

#### Chat Endpoint
- **Path**: `POST /api/{user_id}/chat`
- **Request**: `{message: string}`
- **Response**: `{response: string, tool_calls: Array<Object>}`
- **Authentication**: JWT token required
- **Rate Limiting**: Max 3 concurrent requests per user

### Quickstart Guide

1. Clone the repository
2. Set up environment variables (COHERE_API_KEY, database connection, etc.)
3. Install dependencies
4. Run database migrations
5. Start the backend and MCP server
6. Access the ChatKit UI

## Phase 2: Implementation Strategy

### Implementation Order
1. MCP Server setup with task tools
2. Database schema and models
3. Agent framework implementation
4. Chat endpoint implementation
5. Frontend ChatKit integration
6. Testing and validation