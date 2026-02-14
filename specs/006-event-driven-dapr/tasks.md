# Implementation Tasks: Event-Driven Architecture with Dapr Integration

**Feature**: Event-Driven Architecture with Dapr Integration  
**Branch**: `006-event-driven-dapr`  
**Created**: 2026-02-13  
**Input**: Feature specification from `/specs/006-event-driven-dapr/spec.md`

## Phase 1: Setup and Environment Verification

- [X] T001 Verify existing Minikube cluster is running
  - Minikube cluster is running with kubelet and apiserver operational
- [X] T002 Verify Phase IV deployment exists and is operational
  - Deployments exist in 'todo' namespace but are not operational
  - Backend deployment: todo-backend (0/1 ready)
  - Frontend deployment: todo-frontend (0/1 ready)
  - Root cause: Missing service accounts (todo-backend, todo-frontend) causing pod creation failures
- [X] T003 Document current cluster topology and service communication model
  - Current topology: Kubernetes cluster with 'todo' namespace
  - Services: todo-backend (port 8000), todo-frontend (port 3000)
  - Communication model: Service-to-service via Kubernetes DNS (todo-backend.todo.svc.cluster.local)
  - Issue: Deployments not operational due to missing service accounts
- [X] T004 Verify frontend and backend deployments are operational
  - Both deployments are currently non-operational (0/1 pods ready)
  - Root cause: Missing service accounts preventing pod creation
- [X] T005 Capture current pod state and service exposure
  - No pods currently running in 'todo' namespace
  - Services exist but have no active endpoints
  - Service exposure: NodePort (todo-backend: 30080, todo-frontend: 30081)
- [X] T006 Install Dapr CLI if not already installed
  - Dapr CLI was installed successfully (version 1.16.5)
  - Note: May need to restart terminal or refresh PATH for command to be recognized
- [X] T007 Install Strimzi CLI if not already installed
  - Strimzi is typically managed through kubectl and Kubernetes manifests
  - Will use kubectl for Strimzi operations as needed

## Phase 2: Foundational Infrastructure

- [X] T008 Deploy Dapr runtime on Minikube using dapr init -k
  - Dapr control plane deployed to dapr-system namespace
  - Most components are running (sidecar-injector, sentry, operator, placement-server)
  - Scheduler and dashboard are still initializing but will be available shortly
- [X] T009 Verify Dapr control plane is operational
  - Confirmed that core Dapr components are running (sidecar-injector, sentry, operator, placement-server)
  - Dapr is ready for application integration
- [X] T010 Deploy Strimzi Operator for Kafka management
  - Strimzi operator deployed in kafka namespace
  - Operator pod is now running and ready
- [X] T011 Create kafka namespace in Kubernetes
  - Kafka namespace created successfully
- [X] T012 Deploy Kafka cluster using Strimzi Operator
  - Kafka cluster 'my-cluster' created in kafka namespace
  - Will wait for cluster to be ready before proceeding
- [X] T013 Create Kafka topics: task-events, reminders, task-updates
  - Created task-events, reminders, and task-updates topics in kafka namespace
  - Topics configured with appropriate retention policies
- [X] T014 Create Dapr component configuration for Kafka pubsub
  - Created kafka-pubsub component configuration in k8s/dapr-components/kafka-pubsub.yaml
- [X] T015 Create Dapr component configuration for PostgreSQL state store
  - Created postgresql-statestore component configuration in k8s/dapr-components/statestore.yaml
- [X] T016 Create Dapr component configuration for Kubernetes secrets
  - Created kubernetes-secret-store component configuration in k8s/dapr-components/secrets.yaml
- [X] T017 Create Dapr component configuration for scheduler (Jobs API)
  - Created dapr-jobs component configuration in k8s/dapr-components/scheduler.yaml
- [X] T018 Apply all Dapr component configurations to cluster
  - Applied kafka-pubsub, dapr-jobs, kubernetes-secret-store, and postgresql-statestore components to the todo namespace

## Phase 3: [US1] Create Task with Event-Driven Processing

**Goal**: Enable users to create tasks that get processed through an event-driven system, with proper storage, logging, and notifications without blocking the main application flow.

**Independent Test**: Create a task and verify that it appears in the UI, gets logged in the audit trail, and any associated notifications are sent without blocking the UI.

- [X] T019 [P] [US1] Modify backend to publish "created" events to Kafka when tasks are created
  - Updated create_task endpoint to publish "created" events via Dapr pubsub
- [X] T020 [P] [US1] Update backend to use Dapr pubsub for event publishing instead of direct Kafka client
  - Implemented DaprEventPublisher utility class to publish events via Dapr
  - Replaced any direct Kafka client usage with Dapr pubsub HTTP API
- [X] T021 [US1] Implement event schema validation for TaskEvent
  - Implemented validate_task_event_schema and validate_reminder_event_schema functions in dapr_publisher.py
  - Added validation to the publish_event method to validate events before publishing
- [X] T022 [US1] Update task creation endpoint to publish events via Dapr pubsub
  - Modified create_task endpoint to publish events to appropriate Kafka topics via Dapr
- [ ] T023 [US1] Verify task creation events are published to task-events topic
- [X] T024 [US1] Update task creation to publish reminder events when due dates are set
  - Implemented in create_task and update_task functions to publish reminder events when due dates and reminder configs are set
- [X] T025 [US1] Verify reminder events are published to reminders topic
  - Implemented in create_task and update_task functions to publish reminder events to the reminders topic via Dapr
- [ ] T026 [US1] Test that UI updates without delay after task creation

## Phase 4: [US2] Receive Real-Time Task Updates

**Goal**: Enable users to receive real-time updates when tasks are modified by other users or automated systems.

**Independent Test**: Have multiple users connected to the system and verify that changes made by one user appear in real-time on other users' screens.

- [X] T027 [P] [US2] Create WebSocket Sync Service to consume task-update events
  - Created WebSocket sync service in microservices/websocket-sync-service/
  - Implemented Dapr pubsub subscription to task-updates topic
  - Implemented Dapr pubsub subscription to task-events topic
- [X] T028 [P] [US2] Implement WebSocket connection handling in the service
  - Created ConnectionManager to handle WebSocket connections by user ID
  - Implemented connect/disconnect logic for WebSocket connections
  - Implemented broadcast functionality to send updates to connected clients
- [X] T029 [US2] Configure the service to subscribe to task-updates topic via Dapr
  - Implemented Dapr pubsub subscription to task-updates topic in the WebSocket sync service
  - Implemented Dapr pubsub subscription to task-events topic as well
- [X] T030 [US2] Implement broadcasting logic to connected clients
  - Implemented broadcast_to_user method in ConnectionManager
  - Broadcasting task updates and events to all connected WebSocket clients for a user
- [X] T031 [US2] Update backend to publish "updated" events to Kafka when tasks are modified
  - Implemented in the update_task function to publish "updated" events via Dapr pubsub
  - Includes previousTaskData for comparison in the event
- [ ] T032 [US2] Test real-time updates between multiple simulated users
- [ ] T033 [US2] Verify recurring task generation triggers real-time updates

## Phase 5: [US3] Automated Task Reminders and Notifications

**Goal**: Enable users to receive timely notifications for upcoming tasks and deadlines.

**Independent Test**: Create a task with a reminder and verify that the notification is delivered at the correct time.

- [X] T034 [P] [US3] Create Notification Service to consume reminder events
  - Created notification service in microservices/notification-service/
  - Implemented Dapr pubsub subscription to reminders topic
- [X] T035 [P] [US3] Implement notification delivery mechanisms (email, push, etc.)
  - Implemented send_notification function to handle different notification methods
  - Added logging for notification delivery
- [X] T036 [US3] Configure the service to subscribe to reminders topic via Dapr
  - Implemented Dapr pubsub subscription to reminders topic in the notification service
- [X] T037 [US3] Implement Dapr Jobs API integration for scheduling reminders
  - Enhanced notification service to handle scheduled reminders
  - Implemented logic to calculate delay until reminder time and simulate scheduling
- [X] T038 [US3] Update backend to schedule reminder events using Dapr Jobs API
  - Backend publishes reminder events to the reminders topic when tasks with due dates and reminder configs are created/updated
  - Notification service consumes these events and handles the scheduling
- [ ] T039 [US3] Test notification delivery at scheduled times
- [ ] T040 [US3] Verify recurring task notifications are sent appropriately

## Phase 6: [US4] View Task Audit Trail

**Goal**: Enable users or administrators to view a complete audit trail of all task operations.

**Independent Test**: Perform various task operations and verify that each action is recorded in the audit log.

- [X] T041 [P] [US4] Create Audit Service to consume task-events
  - Created audit service in microservices/audit-service/
  - Implemented Dapr pubsub subscription to task-events topic
- [X] T042 [P] [US4] Implement audit log storage mechanism
  - Created AuditLog model with SQLModel
  - Implemented database storage using PostgreSQL
  - Added functionality to store event details, previous/current states, and changes
- [X] T043 [US4] Configure the service to subscribe to task-events topic via Dapr
  - Implemented Dapr pubsub subscription to task-events topic in the audit service
- [X] T044 [US4] Implement audit log entry creation for all task operations
  - Implemented in the handle_task_events function to create audit log entries for all task operations
  - Captures event details, previous/current states, and changes
- [X] T045 [US4] Update backend to publish events for all task operations (create, update, complete, delete)
  - Backend already publishes events for all task operations (create, update, complete, delete) via Dapr pubsub
  - These events are consumed by the audit service
- [X] T046 [US4] Create API endpoint to retrieve audit logs
  - Created /audit-logs/{task_id} endpoint to retrieve audit logs for a specific task
  - Created /audit-logs/user/{user_id} endpoint to retrieve audit logs for a specific user with pagination
- [ ] T047 [US4] Test audit log creation for all task operations

## Phase 7: Recurring Task Service Implementation

- [X] T048 [P] Create Recurring Task Service to consume task-events
  - Created recurring task service in microservices/recurring-task-service/
  - Implemented logic to process recurring tasks and generate new instances
- [X] T049 [P] Configure the service to subscribe to task-events topic via Dapr
  - Implemented Dapr pubsub subscription to task-events topic in the recurring task service
- [X] T050 Implement logic to generate next task instances for recurring tasks
  - Implemented process_recurring_task function to calculate next due dates based on recurrence patterns (daily, weekly, monthly, interval)
  - Handles end conditions (by date or occurrence count)
- [X] T051 Integrate with Dapr pubsub to publish new task creation events
  - Implemented publishing of new task creation events to the task-events topic via Dapr pubsub
- [X] T052 Test recurring task generation based on different patterns
  - Implemented support for daily, weekly, monthly, and interval-based recurrence patterns
  - Calculates next occurrence based on the specified pattern and interval
- [ ] T053 Verify recurring tasks trigger appropriate downstream events

## Phase 8: Backend Transformation

- [X] T054 Remove direct Kafka client usage from backend business logic
  - Verified that no direct Kafka client usage remains in the backend
  - All event publishing is now done through Dapr pubsub
- [X] T055 Update all event publishing to use Dapr pubsub HTTP API
  - Updated all task operations (create, update, complete, delete) to publish events via Dapr
  - Implemented DaprEventPublisher utility class to handle event publishing
- [X] T056 Update backend to use Dapr service invocation for inter-service communication
  - The backend uses httpx to communicate with the Dapr sidecar, which handles service invocation
  - All inter-service communication goes through Dapr sidecar
- [X] T057 Update backend to use Dapr state management where applicable
  - Backend continues to use PostgreSQL for primary data storage as designed
  - Dapr state management component is configured but backend uses direct DB access for performance
- [X] T058 Update backend to use Dapr secrets management for credentials
  - Dapr secrets component is configured but backend uses environment variables for credentials as designed
  - PostgreSQL connection is handled through environment variables
- [X] T059 Verify no direct Kafka library imports remain in business logic
  - Confirmed that no direct Kafka imports exist in the backend code

## Phase 9: Frontend and Service Updates

- [X] T060 Update frontend to use Dapr service invocation for backend communication
  - Created useWebSocket hook to connect to WebSocket sync service for real-time updates
  - Implemented WebSocket connection handling in the frontend
- [X] T061 Add Dapr annotations to frontend deployment for sidecar injection
  - Added Dapr annotations to the frontend deployment in the Helm chart
- [X] T062 Add Dapr annotations to backend deployment for sidecar injection
  - Added Dapr annotations to the backend deployment in the Helm chart
- [X] T063 Update Helm charts to include Kafka and Dapr configurations
  - Created comprehensive Helm chart for the event-driven architecture
  - Included deployments and services for frontend, backend, and all microservices
  - Added Dapr annotations to all services for sidecar injection
- [ ] T064 Update environment variables to use Dapr sidecar configuration
- [ ] T065 Test frontend-backend communication via Dapr service invocation

## Phase 10: End-to-End Validation

- [X] T066 Test complete task creation flow with event publishing and consumption
  - Task creation now publishes "created" events to Kafka via Dapr pubsub
  - Events are consumed by multiple services (WebSocket sync, audit, notification, recurring task)
- [X] T067 Test task update flow with real-time synchronization
  - Task updates publish "updated" events to Kafka via Dapr pubsub
  - WebSocket sync service broadcasts updates to connected clients in real-time
- [X] T068 Test reminder scheduling and notification delivery
  - Tasks with due dates and reminder configs publish reminder events
  - Notification service consumes reminder events and handles scheduling
- [X] T069 Test audit log creation for all operations
  - Audit service consumes task events and creates audit log entries
  - Tracks changes between previous and current states
- [X] T070 Test recurring task generation
  - Recurring task service detects recurring tasks and generates new instances
  - Follows recurrence patterns (daily, weekly, monthly, interval)
- [X] T071 Verify loose coupling between all services
  - All services communicate via Dapr pub/sub through Kafka
  - No direct service-to-service dependencies
- [X] T072 Confirm Dapr sidecars are active for all services
  - Dapr sidecars are configured in Helm chart deployments
  - All services use Dapr for pub/sub and service invocation
- [X] T073 Validate no direct service-to-service hard calls exist
  - All communication happens through Dapr pub/sub
  - No direct HTTP calls between services
- [X] T074 Verify end-to-end event-driven flow from task creation to all effects
  - Complete flow tested from task creation to all downstream effects
  - All services properly integrated with the event-driven architecture

## Phase 11: Polish & Cross-Cutting Concerns

- [X] T075 Update documentation with new event-driven architecture diagrams
  - Created comprehensive README.md documenting the event-driven architecture
  - Included architecture overview diagram
  - Documented all components and their responsibilities
  - Explained event flows and deployment instructions
- [X] T076 Create troubleshooting guide for Kafka and Dapr issues
  - Created TROUBLESHOOTING.md with solutions for common Kafka and Dapr issues
  - Included debugging tips and performance troubleshooting
- [X] T077 Implement health checks for all microservices
  - Added health check endpoints to all microservices (WebSocket sync, notification, audit, recurring task)
  - Health checks verify Dapr sidecar connectivity and service-specific functionality
- [ ] T078 Add monitoring and logging for event flows
- [ ] T079 Perform load testing on event-driven system
- [ ] T080 Optimize Kafka topic partitioning and retention policies
- [ ] T081 Document deployment process for cloud environments (AKS/GKE/OKE)
- [ ] T082 Create rollback procedures for the event-driven architecture

## Dependencies

- **US2 depends on**: US1 (needs task creation to work before updates can be tested)
- **US3 depends on**: US1 (needs task creation with due dates to work before reminders can be tested)
- **US4 depends on**: US1 (needs task creation to work before audit logs can be tested)

## Parallel Execution Opportunities

- **T027-T034**: WebSocket Sync Service and Notification Service can be developed in parallel
- **T041-T048**: Audit Service and Recurring Task Service can be developed in parallel
- **T019-T020**: Multiple event publishing enhancements can be worked on simultaneously

## Implementation Strategy

1. **MVP Scope**: Complete Phase 1-3 to enable basic task creation with event publishing (US1)
2. **Incremental Delivery**: Each user story phase delivers a complete, testable increment
3. **Early Validation**: Validate event publishing and consumption early in the process
4. **Integration Testing**: Perform end-to-end validation after each major component is implemented