---
id: 1
title: Amend Constitution v1.1.0
stage: constitution
date_iso: 2026-01-20
surface: agent
model: claude-sonnet-4-5-20250929
feature: phase-3-chatbot
branch: phase-3-chatkit
user: user
command: /sp.constitution
labels:
  - constitution
  - ai-chatbot
  - mcp
  - agents
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - .specify/memory/constitution.md
tests_yaml: []
---

# Amend Constitution v1.1.0

## Summary

Updated the project constitution to version 1.1.0 to incorporate requirements for Phase III - AI-powered Todo Chatbot. The update adds new principles for AI integration, agent-first orchestration, and MCP architecture compliance while modifying existing principles to accommodate the new functionality.

## Details

The constitution was updated to include:

1. Added VII. AI-Powered Chatbot Integration principle
2. Added VIII. Agent-First Orchestration principle
3. Added IX. MCP Architecture Compliance principle
4. Modified existing principles to include AI/chatbot requirements
5. Updated technology stack requirements to include AI components
6. Added new API endpoint for chat functionality
7. Updated governance section with new requirements

## Prompt Text

```
/sp.constitution

Project: Phase III – AI-powered Todo Chatbot integrated into existing full-stack application

Core principles:
- Spec-driven development: strictly follow Phase III documentation, Agentic Dev Stack workflow, and MCP architecture.
- Stateless architecture: backend remains stateless; all conversation and task state persisted in Neon PostgreSQL database.
- Agent-first orchestration: all task operations handled by defined agents (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent).
- Deterministic execution: tasks are managed only via MCP tools (add_task, list_tasks, update_task, complete_task, delete_task); agents do not execute operations directly.
- Natural language interface: frontend ChatKit UI accepts only natural language commands; no manual CRUD functionality.
- API integration: OpenAI Agents SDK code executed via Cohere API key for AI reasoning and agent orchestration.

Key standards:
- Backend fully compatible with existing stack: FastAPI + SQLModel + Neon PostgreSQL + Better Auth.
- MCP tools must validate parameters and return structured JSON.
- Agents follow Phase III behavior spec for task creation, listing, updating, completion, deletion, confirmations, and error handling.
- Chat API endpoint `/api/{user_id}/chat` handles messages and returns structured AI responses and tool calls.
- Conversation history stored in database; server holds no state.
- Cohere API key used securely to execute OpenAI Agents SDK logic.

Architecture (full inline sketch):
┌─────────────────┐     ┌──────────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │              FastAPI Server                   │     │                 │
│  ChatKit UI     │────▶│  │         Chat Endpoint                  │  │     │    Neon DB      │
│  (Frontend)     │     │  │  POST /api/chat                        │  │     │  (PostgreSQL)   │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │  - tasks        │
│                 │     │                  ▼                           │     │  - conversations│
│                 │     │  ┌────────────────────────────────────────┐  │     │  - messages     │
│                 │◀────│  │      OpenAI Agents SDK                 │  │     │                 │
│                 │     │  │      (Agent + Runner)                  │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │                 │
│                 │     │                  ▼                           │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │────▶│                 │
│                 │     │  │         MCP Server                 │  │     │                 │
│                 │     │  │  (MCP Tools for Task Operations)       │  │◀────│                 │
│                 │     │  └────────────────────────────────────────┘  │     │                 │
└─────────────────┘     └──────────────────────────────────────────────┘     └─────────────────┘

Constraints:
- No manual coding for AI logic; all agents and workflows generated via Claude Code / Spec-Kit Plus.
- UI must not implement manual task management; only display tasks and AI confirmations.
- All tool calls must be idempotent, error-handled, and associated with correct user_id.
- Deployment must follow domain allowlist configuration for ChatKit.
- Cohere API key used for executing OpenAI Agents SDK securely.
- Conversation state must persist; backend must remain stateless and horizontally scalable.

Success criteria:
- All user messages handled via agents and MCP tools.
- Task operations fully functional through natural language commands.
- AI reasoning executed via Cohere API key using OpenAI Agents SDK.
- UI renders tasks, confirmations, and errors correctly without manual CRUD functionality.
- Backend remains stateless, secure, and scalable, consistent with full-stack architecture.
- Project passes spec-driven evaluation with no deviations from Phase III workflow.
```

## Response Text

Updated the constitution file to include new principles for the AI-powered Todo Chatbot, including AI integration, agent-first orchestration, and MCP architecture compliance. Modified existing principles to incorporate the new requirements while maintaining the existing structure and guidelines. The version was incremented from 1.0.0 to 1.1.0 to reflect these changes.

## Outcome

The constitution now properly reflects the requirements for Phase III - AI-powered Todo Chatbot integration while maintaining compatibility with the existing full-stack application architecture.