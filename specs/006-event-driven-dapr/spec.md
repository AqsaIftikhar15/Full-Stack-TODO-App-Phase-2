# Feature Specification: Event-Driven Architecture with Dapr Integration

**Feature Branch**: `006-event-driven-dapr`
**Created**: 2026-02-13
**Status**: Draft
**Input**: User description: "Todo Chatbot Web Application – Phase V (Remaining Scope) Event-Driven Architecture + Dapr Integration + Local Kubernetes Deployment Target: Extend the EXISTING Todo Chatbot system (already containing Intermediate and Advanced features) by implementing: 1) Event-Driven Architecture using Kafka 2) Full Dapr integration 3) Local deployment on Minikube with Dapr enabled This must be an extension of the current Phase IV Kubernetes deployment. No rewriting. No new project. No manual coding. The agent MUST first verify the current Minikube deployment from Phase IV before proceeding. --- PRIMARY OBJECTIVE Transform the Todo application from REST-driven CRUD architecture into an event-driven, decoupled microservices system using: - Kafka (inside Kubernetes cluster) - Dapr sidecars - Dapr components (Pub/Sub, State, Jobs/Bindings, Secrets, Service Invocation) All existing Intermediate and Advanced features must now operate through event-driven patterns where appropriate. --- PRE-IMPLEMENTATION VERIFICATION (MANDATORY) Before specification: 1. Verify Minikube cluster is running. 2. Verify Phase IV deployment exists. 3. Verify: - Frontend pod - Backend pod - Service exposure 4. Confirm current namespace and Helm deployment status. 5. Document cluster state before modifications. If deployment is missing or broken: → Specify remediation steps before continuing. --- PART A: EVENT-DRIVEN ARCHITECTURE (Kafka) Add Kafka inside Kubernetes cluster. Recommended: Self-hosted Kafka via Strimzi Operator. Scope: 1. Deploy Kafka cluster inside Minikube. 2. Create topics: - task-events - reminders - task-updates 3. Convert backend to Event Publisher: - On task created → publish "created" event - On task updated → publish "updated" - On task completed → publish "completed" - On task deleted → publish "deleted" - On due date set → publish reminder event 4. Create separate microservices: - Recurring Task Service (consumer of task-events) - Notification Service (consumer of reminders) - Audit Service (consumer of task-events) - WebSocket Sync Service (consumer of task-updates) 5. Define event schemas for: - Task Event - Reminder Event 6. Ensure: - Backend no longer tightly couples reminder logic - Recurring tasks processed asynchronously - Audit logs fully event-driven --- PART B: DAPR INTEGRATION (FULL) Deploy Dapr on Minikube using: dapr init -k Dapr must be used for ALL building blocks: 1. Pub/Sub - Use Dapr pubsub.kafka component - Replace direct Kafka client usage with Dapr HTTP API 2. State Management - Use state.postgresql - Store conversation state and task cache via Dapr 3. Service Invocation - Frontend → Backend through Dapr invoke API - Remove hardcoded service URLs 4. Jobs API (NOT polling cron) - Use Dapr Jobs API for scheduled reminders - Exact time-based scheduling - Trigger callback endpoint 5. Secrets Management - Use Kubernetes Secrets via Dapr secret store - No credentials directly in code Define required Dapr components: - kafka-pubsub - statestore - kubernetes-secrets - scheduler (Jobs API) All components must be defined via YAML and deployed to cluster. --- ARCHITECTURE REQUIREMENTS Final architecture must contain: Frontend Pod (+ Dapr sidecar) Backend Pod (+ Dapr sidecar) Notification Pod (+ Dapr sidecar) Recurring Task Pod (+ Dapr sidecar) Audit Pod (+ Dapr sidecar) Kafka cluster Dapr components Loose coupling mandatory. No direct Kafka library imports in business logic. --- CONSTRAINTS - Must follow Agentic Dev Stack workflow - No manual coding - Spec only - Must align with Constitution: - Agent-first orchestration - Event-driven design - Dapr runtime compliance - MCP tool integration - Security-first architecture --- SUCCESS CRITERIA 1. All task operations publish events. 2. Recurring logic processed asynchronously. 3. Reminder scheduling uses Dapr Jobs API. 4. No direct Kafka code in business layer. 5. Dapr sidecars injected into all relevant pods. 6. Minikube deployment confirmed working. 7. Event-driven flow demonstrable end-to-end."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Task with Event-Driven Processing (Priority: P1)

As a user, I want to create a task that gets processed through an event-driven system so that the task is properly stored, logged, and notifications are triggered without blocking the main application flow.

**Why this priority**: This is the core functionality that all other features depend on. Without proper task creation and event processing, the entire system fails.

**Independent Test**: Can be fully tested by creating a task and verifying that it appears in the UI, gets logged in the audit trail, and any associated notifications are sent without blocking the UI.

**Acceptance Scenarios**:

1. **Given** user is on the task creation page, **When** user submits a new task, **Then** the task is created, an event is published to Kafka, and the UI updates without delay.
2. **Given** user creates a task with a due date and reminder, **When** the task is saved, **Then** a reminder event is published to Kafka for later processing.

---

### User Story 2 - Receive Real-Time Task Updates (Priority: P2)

As a user, I want to receive real-time updates when tasks are modified by other users or automated systems so that I always have the most current information.

**Why this priority**: Essential for collaborative environments where multiple users interact with the same tasks.

**Independent Test**: Can be tested by having multiple users connected to the system and verifying that changes made by one user appear in real-time on other users' screens.

**Acceptance Scenarios**:

1. **Given** user A and user B are viewing the same task list, **When** user A modifies a task, **Then** user B sees the update in real-time without refreshing.
2. **Given** a recurring task is completed, **When** the system generates the next occurrence, **Then** all users see the new task appear in real-time.

---

### User Story 3 - Automated Task Reminders and Notifications (Priority: P3)

As a user, I want to receive timely notifications for upcoming tasks and deadlines so that I don't miss important activities.

**Why this priority**: Enhances user productivity and ensures important tasks are completed on time.

**Independent Test**: Can be tested by creating a task with a reminder and verifying that the notification is delivered at the correct time.

**Acceptance Scenarios**:

1. **Given** user creates a task with a due date and reminder, **When** the reminder time arrives, **Then** the user receives a notification via their preferred method.
2. **Given** a recurring task is completed, **When** the next occurrence is due, **Then** the system automatically creates the new task and sends a notification.

---

### User Story 4 - View Task Audit Trail (Priority: P4)

As a user or administrator, I want to view a complete audit trail of all task operations so that I can track changes and troubleshoot issues.

**Why this priority**: Important for accountability and debugging purposes, though not as critical as core functionality.

**Independent Test**: Can be tested by performing various task operations and verifying that each action is recorded in the audit log.

**Acceptance Scenarios**:

1. **Given** user performs various task operations (create, update, delete), **When** they view the audit trail, **Then** all operations are recorded with timestamps and user information.

### Edge Cases

- What happens when Kafka is temporarily unavailable during task creation?
- How does the system handle malformed events in the Kafka queue?
- What occurs when the Dapr sidecar is not available for a service?
- How does the system behave when scheduled reminders fail to trigger?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST deploy Kafka cluster inside Minikube using Strimzi Operator
- **FR-002**: System MUST create Kafka topics: task-events, reminders, task-updates
- **FR-003**: System MUST publish events to Kafka when tasks are created, updated, completed, or deleted
- **FR-004**: System MUST deploy Dapr runtime on Minikube using dapr init -k
- **FR-005**: System MUST configure Dapr components: kafka-pubsub, statestore, kubernetes-secrets, scheduler
- **FR-006**: System MUST inject Dapr sidecars into all relevant pods (Frontend, Backend, Notification, Recurring Task, Audit)
- **FR-007**: System MUST use Dapr pubsub building block for Kafka messaging instead of direct Kafka client usage
- **FR-008**: System MUST use Dapr state management for storing conversation state and task cache
- **FR-009**: System MUST use Dapr service invocation for communication between frontend and backend
- **FR-010**: System MUST use Dapr Jobs API for scheduling reminders instead of cron polling
- **FR-011**: System MUST use Dapr secrets management to store credentials securely
- **FR-012**: System MUST implement Recurring Task Service that consumes task-events and creates new tasks
- **FR-013**: System MUST implement Notification Service that consumes reminder events and sends notifications
- **FR-014**: System MUST implement Audit Service that consumes task-events and maintains audit logs
- **FR-015**: System MUST implement WebSocket Sync Service that consumes task-update events and broadcasts to clients
- **FR-016**: System MUST verify existing Phase IV deployment before making modifications
- **FR-017**: System MUST define event schemas for Task Events and Reminder Events
- **FR-018**: System MUST ensure loose coupling between services with no direct Kafka library imports in business logic

### Key Entities

- **Task Event**: Represents a task operation (create, update, complete, delete) with metadata including task ID, user ID, timestamp, and operation type
- **Reminder Event**: Contains information about scheduled notifications including task ID, due time, reminder time, and user to notify
- **Dapr Component**: Configuration files defining how Dapr integrates with underlying infrastructure (Kafka, PostgreSQL, Kubernetes secrets)
- **Microservice**: Independent services (Recurring Task, Notification, Audit, WebSocket Sync) that consume events from Kafka

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All task operations successfully publish events to Kafka without blocking the main application flow
- **SC-002**: Recurring tasks are processed asynchronously by the Recurring Task Service with 99% success rate
- **SC-003**: Reminder scheduling uses Dapr Jobs API with 99% accuracy in triggering notifications at the exact scheduled time
- **SC-004**: No direct Kafka client code remains in business logic layers
- **SC-005**: Dapr sidecars are successfully injected into all relevant pods (Frontend, Backend, Notification, Recurring Task, Audit)
- **SC-006**: Minikube deployment is confirmed working with all services operational
- **SC-007**: End-to-end event-driven flow is demonstrable from task creation to all downstream effects (notifications, recurring tasks, audit logs)
- **SC-008**: System maintains loose coupling between services with zero direct dependencies on Kafka client libraries
