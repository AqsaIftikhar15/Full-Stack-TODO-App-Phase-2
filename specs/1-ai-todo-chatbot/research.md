# Research: AI-powered Todo Chatbot Implementation

**Feature**: AI-powered Todo Chatbot
**Created**: 2026-01-20

## Overview
This document resolves the unknowns identified in the implementation plan for the AI-powered Todo Chatbot feature.

## Research Findings

### RF-001: Cohere API Configuration
- **Decision**: Use Cohere API with OpenAI-compatible endpoint for AI execution
- **Rationale**: The provided COHERE_API_KEY (LXy16tK2MP3C1vK6POx9RsB19xLdLJDkJe2EGNy5) suggests using Cohere's OpenAI-compatible endpoint, which allows using OpenAI Agents SDK with Cohere as the backend provider
- **Implementation approach**: Configure OpenAI SDK to use Cohere's API endpoint with the provided key
- **Alternatives considered**:
  - Direct OpenAI API: Would require different API key
  - Custom AI service: Would add complexity beyond requirements

### RF-002: MCP Server Setup
- **Decision**: Implement MCP server using the Official MCP SDK with defined task tools
- **Rationale**: MCP tools are mandated by the constitution (add_task, list_tasks, update_task, complete_task, delete_task)
- **Implementation approach**: Create an MCP server that exposes the required tools with proper parameter validation
- **Alternatives considered**:
  - Direct database access by agents: Prohibited by constitution
  - Custom API for task operations: Would violate MCP architecture compliance

### RF-003: Agent Orchestration Patterns
- **Decision**: Implement sequential agent execution with defined handoff points
- **Rationale**: The specification defines specific roles for each agent, requiring a coordinated workflow
- **Implementation approach**: Create an orchestrator that passes context between agents in the sequence: UserContextAgent → IntentParserAgent → TodoManagerAgent → MCPInvokerAgent → ConversationAgent
- **Alternatives considered**:
  - Parallel execution: Would complicate state management
  - Single agent handling all tasks: Would violate agent-first orchestration principle

### RF-004: OpenAI Agents SDK Integration with Cohere
- **Decision**: Use Cohere's OpenAI-compatible endpoint to run OpenAI Agents SDK
- **Rationale**: This satisfies the requirement to use OpenAI Agents SDK while executing via Cohere API
- **Technical details**:
  - Configure OpenAI client with Cohere's base URL
  - Use the provided COHERE_API_KEY for authentication
  - Map OpenAI function calling to MCP tool calls
- **Implementation approach**: Create a wrapper that translates OpenAI function calls to MCP tool invocations

### RF-005: Conversation Truncation Strategy
- **Decision**: Implement sliding window approach for conversation history
- **Rationale**: Need to maintain context while enforcing the 50-message limit
- **Implementation approach**: Store full conversation in database but only send last 50 messages to AI service
- **Alternatives considered**:
  - Fixed start point: Would lose recent context
  - Summary-based: Would add complexity and potentially lose important details

### RF-006: Concurrency Control Implementation
- **Decision**: Use in-memory atomic counters per user for request tracking
- **Rationale**: Need to enforce 3 concurrent requests per user as specified
- **Implementation approach**: Implement a request tracker using thread-safe data structures
- **Alternative approaches**:
  - Database locks: Higher latency
  - Redis: Additional infrastructure dependency

### RF-007: Error Handling Strategy
- **Decision**: Implement graceful degradation with user-friendly messages
- **Rationale**: Required by FR-011 for handling AI service failures
- **Implementation approach**: Create fallback responses when AI services are unavailable
- **Alternatives considered**:
  - Fail completely: Would violate graceful degradation requirement
  - Show technical errors: Would not be user-friendly

## Technical Specifications

### Cohere API Integration
- Base URL: https://api.cohere.ai/v1
- API Key: LXy16tK2MP3C1vK6POx9RsB19xLdLJDkJe2EGNy5
- Model: Compatible with OpenAI function calling for MCP tool integration

### MCP Tool Specifications
- add_task: Creates new task with title, description, priority, due_date
- list_tasks: Retrieves tasks with optional filters
- update_task: Modifies existing task properties
- complete_task: Marks task as completed
- delete_task: Removes task from user's list

### Database Schema Requirements
- Neon PostgreSQL with UUID extensions
- Proper indexing for user_id lookups
- Constraints to ensure data integrity
- Efficient querying for conversation history

## Risks and Mitigation

### AI Service Availability Risk
- **Risk**: Cohere API may be unavailable, affecting user experience
- **Mitigation**: Implement circuit breaker pattern and fallback responses

### Rate Limiting Risk
- **Risk**: High concurrent usage may exceed Cohere API limits
- **Mitigation**: Implement request queuing and user-based rate limiting

### Data Consistency Risk
- **Risk**: Concurrent operations may lead to inconsistent state
- **Mitigation**: Use database transactions for all operations

## Conclusion
All unknowns from the implementation plan have been researched and resolved. The technical approach is aligned with constitutional requirements and implementation constraints. The next step is to proceed with the detailed design and implementation of the components.