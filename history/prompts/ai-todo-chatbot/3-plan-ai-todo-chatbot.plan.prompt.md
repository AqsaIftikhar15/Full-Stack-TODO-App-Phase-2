---
id: 3
title: Plan AI Todo Chatbot
stage: plan
date_iso: 2026-01-20
surface: agent
model: claude-sonnet-4-5-20250929
feature: ai-todo-chatbot
branch: phase-3-chatkit
user: user
command: /sp.plan
labels:
  - ai
  - chatbot
  - todo
  - planning
  - architecture
links:
  spec: specs/1-ai-todo-chatbot/spec.md
  plan: specs/1-ai-todo-chatbot/plan.md
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/1-ai-todo-chatbot/plan.md
  - specs/1-ai-todo-chatbot/research.md
  - specs/1-ai-todo-chatbot/data-model.md
  - specs/1-ai-todo-chatbot/contracts/chat-api.yaml
  - specs/1-ai-todo-chatbot/quickstart.md
tests_yaml: []
---

# Plan AI Todo Chatbot

## Summary

Completed comprehensive implementation planning for the AI-powered Todo Chatbot feature. The plan includes all required components: architecture sketch, agent roles, MCP server setup, backend implementation, frontend considerations, database schema, and error handling strategies.

## Details

The planning process included:

1. Created detailed implementation plan with architecture sketch showing end-to-end request lifecycle
2. Defined roles and responsibilities for each agent (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent)
3. Planned MCP server with required tools (add_task, list_tasks, update_task, complete_task, delete_task)
4. Designed backend with chat endpoint behavior and conversation persistence strategy
5. Outlined frontend requirements for ChatKit UI integration
6. Created comprehensive data model for Task, Conversation, and Message entities
7. Developed API contracts in OpenAPI format
8. Researched and resolved all unknowns regarding Cohere API integration and MCP server setup
9. Created quickstart guide for implementation team

The plan ensures compliance with all constitutional requirements including:
- Stateless architecture with all state persisted in database
- Agent-first orchestration with all task operations via MCP tools
- Natural language interface through ChatKit UI
- Maximum 50 message exchanges per conversation
- Maximum 500 characters per message
- Maximum 3 concurrent AI requests per user
- 99.5% AI service uptime target

## Prompt Text

```
Objective:
Plan the complete Phase III implementation of the AI-powered Todo Chatbot using a spec-driven, agentic workflow. The plan must strictly follow the finalized specification, constitution, and clarification updates, and be suitable for execution via Claude Code and Spec-Kit Plus with no manual coding.

Scope of planning:
- AI-powered natural language Todo Chatbot
- Stateless FastAPI backend
- OpenAI Agents SDK executed via Cohere API key (already set in backend environment)
- MCP server using Official MCP SDK
- ChatKit frontend UI (conversation-only, no manual task management)
- Neon PostgreSQL persistence
- Better Auth-based user identity

Assumptions:
- Cohere API key is securely configured in backend environment variables.
- All required environment variables from Phase II already exist and must be reused.
- No new secrets are introduced in frontend.
- Backend remains stateless at all times.

High-level architecture (must be preserved):
- ChatKit UI → FastAPI `/api/{user_id}/chat`
- FastAPI → OpenAI Agents SDK (via Cohere)
- Agents → MCP Server (task tools only)
- MCP Server → SQLModel → Neon PostgreSQL
- Conversation and message state persisted in DB

Planning deliverables:
1. Architecture sketch
   - End-to-end request lifecycle
   - Agent-to-MCP interaction flow
   - Stateless request cycle
2. Agent plan
   - Roles and responsibilities of each agent
   - Agent invocation and handoff rules
3. MCP server plan
   - Tool definitions: add_task, list_tasks, update_task, complete_task, delete_task
   - Parameter validation and error handling
4. Backend plan
   - Chat endpoint behavior
   - Conversation persistence strategy
   - Concurrency handling
5. Frontend plan
   - ChatKit UI responsibilities
   - Message length validation (500 chars)
   - Display-only task rendering
6. Database plan
   - Task, Conversation, Message models
   - Indexing and constraints
7. Error handling & edge cases
   - Graceful AI degradation (FR-011)
   - Conversation limit (50 exchanges) handling
   - Message length limit enforcement
   - Concurrent request throttling (max 3 per user)

Key constraints (must be enforced in plan):
- No manual task CRUD in UI
- No direct DB access by agents
- All task operations via MCP tools
- Backend remains stateless
- Max 50 message exchanges per conversation (FR-012)
- Max 500 characters per message (FR-013)
- Max 3 concurrent AI requests per user (FR-014)
- AI services target 99.5% uptime (SC-008)

Decisions needing documentation:
- Agent orchestration strategy and tradeoffs
- MCP tool granularity and composition
- Conversation truncation strategy beyond 50 messages
- Concurrency control approach per user
- Error messaging UX vs technical errors

Testing & validation strategy:
- Validate each natural language command maps to correct MCP tool
- Verify stateless behavior across server restarts
- Confirm conversation persistence correctness
- Test edge cases from specification
- Validate enforcement of message length, context size, and concurrency limits
- Confirm graceful degradation behavi
```

## Response Text

Completed comprehensive implementation planning for the AI-powered Todo Chatbot feature. Created five key deliverables:

1. Detailed implementation plan (plan.md) with architecture sketch, agent roles, and compliance with constitutional requirements
2. Research document (research.md) resolving all unknowns about Cohere API integration and MCP server setup
3. Data model specification (data-model.md) defining Task, Conversation, and Message entities with validation rules
4. API contracts (contracts/chat-api.yaml) in OpenAPI format for the chat endpoint and related operations
5. Quickstart guide (quickstart.md) with setup instructions and feature overview

All constitutional requirements were verified and incorporated into the plan:
- Stateless architecture with database persistence
- Agent-first orchestration using defined agents
- MCP tool-based task operations
- Natural language interface through ChatKit UI
- Enforced limits (50 messages, 500 chars, 3 concurrent requests)
- Error handling and graceful degradation

The plan is ready for the task breakdown phase (/sp.tasks).

## Outcome

The implementation plan is complete and ready for task breakdown. All architectural decisions have been documented, technical unknowns resolved, and constitutional compliance verified. The plan provides a clear roadmap for implementing the AI-powered Todo Chatbot feature using the Agentic Dev Stack workflow.