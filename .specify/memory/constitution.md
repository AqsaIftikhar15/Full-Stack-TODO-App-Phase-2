<!--
Sync Impact Report:
Version change: 1.2.0 → 2.0.0
Added sections: XIII. Agent-Based Architecture, XIV. Event-Driven Design with Kafka, XV. Dapr Runtime Integration, XVI. Cloud-First Deployment
Modified principles: II. Agentic Dev Stack Workflow, III. Technology Stack Compliance, X. Kubernetes-First Deployment, VIII. Agent-First Orchestration, IX. MCP Architecture Compliance
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md, ⚠️ .specify/templates/commands/*.md
Follow-up TODOs: None
-->

# Full-Stack Todo Web Application Constitution - Phase V: Agent-Based, Event-Driven Architecture

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development must be driven by specifications; No feature may be implemented without a corresponding spec; Specs are authoritative and override assumptions; All code changes must be traceable to specs and prompts; All architectural decisions must be documented in ADRs when significant impact is present.

### II. Agentic Dev Stack Workflow
Strictly follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code; All implementation must be driven by Spec-Kit Plus specifications; No manual coding outside Claude Code tools; For Phase V, follow the Spec → Plan → Tasks → Execute flow using AI-assisted tools only; All code, configs, and changes must be AI-generated; Evaluation is based on architecture, process, and reasoning, not just features; All outputs strictly follow the user intent; PHRs are created automatically and accurately for every user prompt; Architectural Decision Records (ADRs) must be created for all significant architectural decisions with impact, alternatives considered, and rationale documented when multiple viable options exist and influence system design across multiple components or teams.

### III. Technology Stack Compliance
Frontend must use existing frontend from Phase II-IV (no rewrite); Backend must use Python FastAPI with SQLModel + Neon PostgreSQL + Better Auth; Database must use Neon Serverless PostgreSQL with SQLModel ORM; Authentication must use Better Auth with JWT-based verification; Backend must remain stateless with all conversation and task state persisted in Neon PostgreSQL database; Messaging/Event Streaming must use Kafka (via Dapr Pub/Sub); Runtime Abstraction must use Dapr; Deployment must extend existing Helm charts from Phase IV (not rewritten) and add Kafka and Dapr configurations; CI/CD must use GitHub Actions for automated deployments to cloud platforms (AKS/GKE/OKE); Containerization must be executed by ContainerAgent using Docker AI (Gordon); Kubernetes deployment and Helm chart management must be executed by KubernetesAgent; Cluster health, optimization, and troubleshooting must be executed by AIOpsAgent.

### IV. Security-First Architecture
All API routes must be prefixed with /api/ and require valid JWT tokens; Task ownership must be enforced for every operation; User data must be isolated and scoped per authenticated user; Stateless authentication must be enforced throughout the application; MCP tools must validate parameters and return structured JSON; All tool calls must be idempotent, error-handled, and associated with correct user_id; All inter-service communication must go through Dapr service invocation with proper authentication; Secrets must be managed through Dapr secret management and never stored in plain text; All agent communications must be secured and validated through Dapr pub/sub mechanisms.

### V. Container-First Deployment
Docker must be part of the project architecture; A docker-compose.yml file must be present at repository root; Frontend and backend must be containerizable; Docker configuration must support running the full stack via docker-compose; For Phase V, Docker images must be created through Gordon-assisted workflows; Containerization must be executed by ContainerAgent using Docker AI (Gordon); All containers must be built using AI-assisted tooling; Docker images must include Dapr sidecar configurations and support Kafka connectivity through Dapr pub/sub component configurations; Zero Manual Coding: No handwritten Dockerfiles, YAML, or scripts unless generated through AI assistance.

### VI. Multi-User Data Isolation
All task operations must be authenticated and user-scoped; Each user may only access their own tasks; Backend must filter all database queries by authenticated user; SQLModel must be used for all database interactions with proper user filtering; Conversation history stored in database; server holds no state; All agent states must be maintained through Dapr state management with user isolation; Event streams must be properly partitioned by user context where applicable; All user-specific reminders and recurring tasks must be scoped to the appropriate user context only.

### VII. AI-Powered Chatbot Integration
Natural language interface: frontend ChatKit UI accepts only natural language commands; no manual CRUD functionality; UI must not implement manual CRUD functionality; only display tasks and AI confirmations; All user messages handled via agents and MCP tools; Task operations fully functional through natural language commands; UI renders tasks, confirmations, and errors correctly without manual CRUD functionality; UI must remain unchanged from Phase II-IV and integrate with new agent-based backend through existing interfaces; All advanced features (priorities, tags, search, filter, sort, due dates, reminders, recurring tasks) must be accessible through natural language commands processed by agents; Frontend must properly display all advanced feature capabilities without direct implementation changes to the UI itself.

### VIII. Agent-First Orchestration
All task operations handled by defined agents (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent, TaskManagementAgent, ReminderAgent, RecurringTaskAgent, NotificationAgent, AuditAgent); Deterministic execution: tasks are managed only via MCP tools (add_task, list_tasks, update_task, complete_task, delete_task) and new agent-specific tools; agents do not execute operations directly without proper validation; ConversationAgent manages conversational flow and user-facing responses; IntentParserAgent analyzes user messages to detect task-related intent; TodoManagerAgent handles all task-related actions; UserContextAgent manages and validates user identity and context; TaskManagementAgent owns task lifecycle (create, update, delete, complete) and publishes all task-related events; ReminderAgent schedules and triggers reminders using Dapr Jobs API; RecurringTaskAgent generates next task instances for recurring tasks; NotificationAgent sends user notifications asynchronously; AuditAgent maintains immutable activity and event logs; Each agent has a single responsibility; Agents communicate only via Dapr Pub/Sub and events; No direct agent-to-agent REST calls; No shared databases between agents; All side effects must be event-driven; Agent interactions must be clear, decoupled, and scalable; Agents must be resilient to failures and maintain consistent state through Dapr state management and event sourcing patterns; All agent implementations must be generated through AI-assisted tools only and follow event-driven, autonomous operation patterns with no tight coupling to other services or agents; Each agent must have well-defined contracts for events published and consumed through Dapr pub/sub; All agent interactions must be observable through Dapr telemetry and logging capabilities; Agent state must be managed consistently through Dapr state management for reliability and scalability across multiple instances; All agents must implement proper error handling and circuit breaker patterns to ensure system resilience and graceful degradation in case of individual agent failures; Agent event processing must be idempotent to ensure reliable processing even in the presence of duplicate events or retries.

### IX. MCP Architecture Compliance
Stateless architecture: backend remains stateless; all conversation and task state persisted in Neon PostgreSQL database; MCP tools must validate parameters and return structured JSON; Chat API endpoint `/api/{user_id}/chat` handles messages and returns structured AI responses and tool calls; API integration: OpenAI Agents SDK code executed via Cohere API key for AI reasoning and agent orchestration; All tool calls must be idempotent, error-handled, and associated with correct user_id; Conversation state must persist; backend must remain stateless and horizontally scalable; Cohere API key used for executing OpenAI Agents SDK securely; All new MCP tools for advanced features (task priorities, tags, search, filter, sort, due dates, reminders, recurring tasks) must follow the same stateless, validated, and secure patterns as existing tools; MCP tools must integrate seamlessly with Dapr pub/sub and state management to maintain consistent behavior across all agent interactions.

### X. Kubernetes-First Deployment
Minikube must be used as the local Kubernetes cluster for initial deployments; Helm Charts must be used for packaging and deploying applications; Raw Kubernetes YAML files must not be applied directly without Helm; All deployments must target the Minikube cluster context initially; Kubernetes deployment and Helm chart management must be executed by KubernetesAgent; For Phase V, all deployments must include Dapr and Kafka components with proper configurations; Helm charts must be extended to include Kafka (Strimzi or equivalent) and Dapr components with pub/sub, state management, jobs bindings, secrets management, and service invocation configurations; Dapr must be installed and configured on Kubernetes clusters with full feature set enabled; Kafka must be deployed and integrated with Dapr pub/sub component configurations; All deployments must support both local Minikube and cloud Kubernetes environments (AKS/GKE/OKE) through configurable Helm values; No environment-specific values must be hardcoded in charts; Helm charts must support Dapr sidecar injection and configuration for all application pods; Kubernetes deployments must include proper resource limits, health checks, and scaling configurations that account for the additional Dapr sidecars and Kafka connectivity requirements; All Kubernetes resources must follow best practices for production readiness including proper resource requests, limits, readiness and liveness probes, and security contexts.

### XI. AI-Assisted DevOps Operations
kubectl-ai must be used for deployment, scaling, and debugging operations; kagent must be used for cluster health analysis and optimization; Prefer natural language CLI commands over imperative instructions; Use kubectl-ai before kagent unless advanced analysis is required; All Docker and Kubernetes actions must be AI-assisted; AI DevOps tools (kubectl-ai, kagent) must be used for all operations; Cluster health, optimization, and troubleshooting must be executed by AIOpsAgent; For Phase V, DevOps operations must include Dapr and Kafka cluster management and monitoring; Dapr components and pub/sub configurations must be validated and monitored through AI-assisted tools; Kafka topic configurations and event stream health must be verified through AI-assisted tools; All cloud deployment operations to AKS/GKE/OKE must be managed through AI-assisted tools with proper authentication and security considerations.

### XII. Container-First Architecture
Docker AI Agent (Gordon) must be used as the primary containerization tool; Standard Docker CLI may only be used as a fallback if Gordon is unavailable; Containerization must be executed by ContainerAgent using Docker AI (Gordon); Docker images must be created through Gordon-assisted workflows; All containers must be built using AI-assisted tooling; Zero Manual Coding: No handwritten Dockerfiles, YAML, or scripts; Docker images must be designed to work with Dapr sidecar injection and Kafka connectivity through Dapr pub/sub; Container networking and service discovery must leverage Dapr service invocation for inter-service communication; All containers must be designed for Kubernetes deployment with proper Dapr sidecar configurations and Kafka connectivity requirements.

### XIII. Agent-Based Architecture
TaskManagementAgent must own task lifecycle (create, update, delete, complete) and publish all task-related events; Supporting agents must include: ReminderAgent (schedules and triggers reminders using Dapr Jobs API), RecurringTaskAgent (generates next task instances for recurring tasks), NotificationAgent (sends user notifications asynchronously), AuditAgent (maintains immutable activity and event logs); Each agent must have a single responsibility; Agents must communicate only via Dapr Pub/Sub and events; No direct agent-to-agent REST calls; No shared databases between agents; All side effects must be event-driven; Agent interactions must be clear, decoupled, and scalable; All agents must be implemented following the agentic dev stack workflow with specs, plans, and AI-generated implementations; Agents must be independently deployable and scalable; Agent implementations must use proper event sourcing patterns and maintain idempotent event processing to ensure reliable operation in distributed environments; Each agent must implement proper logging and monitoring to enable debugging and observability across the distributed system.

### XIV. Event-Driven Design with Kafka
Kafka must be used strictly for asynchronous event streaming; Kafka access must be abstracted via Dapr (no direct Kafka clients); Required topics: task-events, reminders, task-updates; All task lifecycle actions must emit events; Event schemas must be explicit and consistent; Events must be published through Dapr pub/sub components; Event consumers must process events asynchronously; Event-driven architecture must support loose coupling between system components; Event persistence and replay capabilities must be maintained for reliability; All events must include proper metadata for correlation, user context, and traceability; Event schemas must be versioned and backward compatible to support system evolution; Event processing must be idempotent to handle duplicate events gracefully; Event delivery must guarantee at-least-once semantics to prevent loss of important business operations.

### XV. Dapr Runtime Integration
Dapr must be used as the distributed application runtime for all services; Dapr Pub/Sub must be used for all inter-service communication and event streaming; Dapr State Management must be used for maintaining task and agent state; Dapr Jobs API / Bindings must be used for reminders and recurring task scheduling; Dapr Service Invocation must be used for frontend to backend communication; Dapr Secrets Management must be used for all credentials and keys; Dapr must be configured with proper Kafka pub/sub component for event streaming; Dapr must be configured with appropriate state store component for persistent storage; Dapr components must be properly secured and authenticated across all service interactions; Dapr must be configured with proper tracing and monitoring to enable system observability and debugging; Dapr sidecars must be properly configured for all application containers to enable seamless integration with distributed system capabilities; Dapr configurations must support both local Minikube and cloud Kubernetes environments.

### XVI. Cloud-First Deployment
Deployment must work on local Minikube first; Final deployment must target one cloud provider only: Azure (AKS) OR Google Cloud (GKE) OR Oracle Cloud (OKE); Dapr must be deployed with full feature set on cloud Kubernetes; Use managed Kafka (Redpanda/Confluent) or self-hosted Kafka depending on cloud provider; CI/CD pipeline must use GitHub Actions for automated deployments; Monitoring and logging must be enabled in cloud environments; No environment-specific values hardcoded in configurations; Cloud deployment must maintain the same functionality as local deployment; Cloud deployment must include proper scaling, availability, and security configurations appropriate for production use; Cloud deployments must include proper backup, disaster recovery, and monitoring configurations; All cloud resources must be provisioned and managed through infrastructure-as-code patterns and AI-assisted tools.

### XVII. Phase-Aware Architecture Compliance
Kafka, Dapr, MCP tools, and event-driven pub/sub are MANDATORY by Phase V.2 and beyond; Early phases (including Phase V.1) MAY use synchronous implementations provided: Domain events are logically defined, Event contracts are documented, Code structure is migration-ready for Kafka/Dapr; Clarify that "agent-first" refers to logical ownership and orchestration, not mandatory infrastructure per phase; Phase V.1 implementations must have explicit event and agent boundaries that will connect to Kafka/Dapr in Phase V.2; All domain events must be defined and documented even if implemented synchronously in Phase V.1; Agent responsibilities must be clearly defined even if implemented as logical modules in Phase V.1.

## Additional Constraints

Technology stack requirements:
- Frontend: Existing frontend from Phase II-IV (no rewrite)
- Backend: Python FastAPI, SQLModel + Neon PostgreSQL + Better Auth, stateless architecture
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth on frontend, JWT-based authentication for backend verification
- API standards: All endpoints must follow documented REST patterns
- Agent Architecture: Defined agents (UserContextAgent, IntentParserAgent, TodoManagerAgent, MCPInvokerAgent, ConversationAgent, TaskManagementAgent, ReminderAgent, RecurringTaskAgent, NotificationAgent, AuditAgent) with logical ownership in Phase V.1, infrastructure implementation in Phase V.2
- MCP Tools: Extended to include advanced features (priorities, tags, search, filter, sort, due dates, reminders, recurring tasks)
- State Management: Conversation and task state persisted in Neon PostgreSQL database; agent state managed through Dapr; server holds no state
- Containerization: Docker AI Agent (Gordon) for container creation with Dapr integration
- Orchestration: Kubernetes with Minikube and Helm Charts extended for Dapr and Kafka
- Messaging: Kafka (via Dapr Pub/Sub) for event streaming in Phase V.2 and beyond
- Runtime: Dapr for distributed application capabilities (pub/sub, state management, jobs, secrets, service invocation) in Phase V.2 and beyond
- DevOps: kubectl-ai for deployment operations, kagent for cluster analysis
- CI/CD: GitHub Actions for automated cloud deployments to AKS/GKE/OKE

Advanced Features Implementation Requirements:
- Task priorities: Implemented through agent-based logic with proper event publishing
- Tags/categories: Integrated into task management with search capabilities
- Search functionality: Available through agent tools with efficient querying
- Filtering: Implemented through agent query mechanisms
- Sorting: Available through agent data retrieval methods
- Due dates with time: Properly handled in task lifecycle with timezone considerations
- Time-based reminders: Managed through ReminderAgent using Dapr Jobs API
- Recurring tasks: Handled by RecurringTaskAgent with proper recurrence patterns
- All advanced features must be accessible through natural language interface

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

For Phase V deployments:
- Containerization must be executed by ContainerAgent using Docker AI (Gordon) with Dapr integration
- Kubernetes deployment and Helm chart management must be executed by KubernetesAgent with Kafka/Dapr components
- Cluster health, optimization, and troubleshooting must be executed by AIOpsAgent for both local and cloud environments
- Spec → Plan → Tasks flow must be managed by SpecOrchestratorAgent following agentic dev stack workflow
- No manual execution is allowed outside of these agents
- Helm charts must be extended via AI tooling to include Dapr and Kafka components
- All deployments must support both Minikube and cloud Kubernetes contexts
- kubectl-ai must be used for deployment, scaling, and debugging across all environments
- kagent must be used for cluster-level analysis and optimization
- Dapr and Kafka components must be properly configured and validated in all deployments
- All advanced features must be tested and validated through the AI-assisted chat interface

## Governance

Constitution supersedes all other practices; Amendments require documentation and approval; All development must verify compliance with these principles; Use CLAUDE.md for runtime development guidance; No manual coding for AI logic; all agents and workflows generated via Claude Code / Spec-Kit Plus; All task operations handled by defined agents and MCP tools; Backend must remain stateless with all conversation and task state persisted in Neon PostgreSQL database; For Phase V: All Docker and Kubernetes actions must be AI-assisted; Containerization must be executed by ContainerAgent using Docker AI (Gordon); Kubernetes deployment and Helm chart management must be executed by KubernetesAgent; Cluster health, optimization, and troubleshooting must be executed by AIOpsAgent; Spec → Plan → Tasks flow must be managed by SpecOrchestratorAgent; All agent-based architecture components must be implemented following the defined principles with Dapr and Kafka integration; Event-driven design must be maintained throughout the system with proper separation of concerns between agents; Cloud deployment must maintain the same functionality and quality as local deployment while following cloud-native best practices; All advanced features must be fully functional through the AI-powered chatbot interface without requiring direct UI changes to the existing frontend implementation.

**Version**: 2.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-02-07