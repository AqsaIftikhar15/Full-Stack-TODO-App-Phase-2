---
id: 001
title: event-driven-dapr-planning
stage: plan
date: 2026-02-13
surface: agent
model: GPT-4
feature: event-driven-dapr
branch: 006-event-driven-dapr
user: Assistant
command: /sp.plan
labels: ["planning", "event-driven", "dapr", "kafka", "kubernetes", "microservices"]
links:
  spec: "../specs/006-event-driven-dapr/spec.md"
  plan: "../specs/006-event-driven-dapr/plan.md"
  ticket: null
  adr: null
  pr: null
files:
  - ../specs/006-event-driven-dapr/plan.md
  - ../specs/006-event-driven-dapr/research.md
  - ../specs/006-event-driven-dapr/data-model.md
  - ../specs/006-event-driven-dapr/quickstart.md
  - ../specs/006-event-driven-dapr/contracts/todo-backend-api.yaml
tests: []
prompt_text: >-
  /sp.plan Objective:
  Plan and organize the implementation of Phase V for the Todo Chatbot Web Application, transforming the existing Phase IV Kubernetes-based system into a fully event-driven, Dapr-powered microservices architecture running on Minikube.

  The plan must extend the existing Phase IV deployment.
  No rewrite. No manual coding. Only structured implementation planning.

  ---

  PHASE 0: PRE-IMPLEMENTATION VALIDATION (MANDATORY)

  Plan verification steps to:

  - Confirm Minikube cluster is running.
  - Confirm namespace and Helm releases.
  - Verify:
      - Frontend deployment
      - Backend deployment
      - Service exposure
  - Capture current pod state.
  - Confirm backend endpoints currently working.

  If broken:
  - Include remediation sequence before proceeding.

  Document:
  - Current cluster topology
  - Current service communication model (REST-based)

  ---

  PHASE 1: ARCHITECTURE TRANSFORMATION DESIGN

  Create architecture sketch:

  - Current REST-based architecture
  - Target event-driven architecture
  - Service boundaries

  Define:

  - Event producers
  - Event consumers
  - Topic mapping
  - Microservice separation strategy

  Architecture must include:

  Frontend (+ Dapr sidecar)
  Backend (+ Dapr sidecar)
  Notification Service (+ Dapr sidecar)
  Recurring Task Service (+ Dapr sidecar)
  Audit Service (+ Dapr sidecar)
  Kafka Cluster
  Dapr Control Plane

  Document:

  - Event flow diagram (Task lifecycle)
  - Service invocation via Dapr
  - State flow via Dapr state store
  - Reminder scheduling via Dapr Jobs API

  ---

  PHASE 2: KAFKA DEPLOYMENT PLANNING (MINIKUBE)

  Plan:

  - Kafka deployment method (Strimzi recommended)
  - Kafka cluster configuration
  - Topic creation:
      - task-events
      - reminders
      - task-updates

  Define:

  - Event schema structure:
      - TaskEvent
      - ReminderEvent
  - Message format (JSON)
  - Partition strategy (basic)

  Validation steps:

  - Kafka pod health
  - Topic verification
  - Test producer/consumer simulation

  ---

  PHASE 3: BACKEND TRANSFORMATION PLAN

  Refactor backend behavior (conceptually):

  - Replace direct task-side effects with event publishing
  - Publish events on:
      - Task created
      - Task updated
      - Task completed
      - Task deleted
      - Due date set

  Ensure:

  - Business logic does NOT directly invoke reminder or audit logic
  - Backend becomes event publisher only

  Define:

  - Event publishing flow via Dapr pubsub
  - Removal of tight coupling

  Quality checks:

  - No direct Kafka client in business layer
  - Clean separation of responsibilities

  ---

  PHASE 4: MICROSERVICES PLANNING

  Define new services:

  1. Notification Service
     - Subscribes to reminders
     - Sends notifications

  2. Recurring Task Service
     - Subscribes to task-events
     - Creates next instance for recurring tasks

  3. Audit Service
     - Subscribes to task-events
     - Writes event logs

  4. WebSocket Sync Service (optional extension)
     - Subscribes to task-updates
     - Pushes updates to clients

  For each service:

  - Define responsibility boundary
  - Define event subscription configuration
  - Define Dapr sidecar injection strategy

  ---

  PHASE 5: DAPR INTEGRATION PLANNING

  Plan full Dapr enablement:

  1. Install Dapr on Kubernetes
     - dapr init -k

  2. Define Dapr components (YAML):

     - pubsub.kafka
     - state.postgresql
     - secretstore.kubernetes
     - scheduler (Jobs API)

  3. Pub/Sub usage:
     - All event publishing via Dapr HTTP API
     - All subscriptions via Dapr declarative subscriptions

  4. State Management:
     - Store:
          - Conversation state
          - Task cache
     - Remove direct DB calls where Dapr state applicable

  5. Service Invocation:
     - Frontend → Backend via Dapr invoke API
     - Remove hardcoded service URLs

  6. Jobs API:
     - Schedule reminder callbacks
     - No polling cron allowed

  Validation:

  - Confirm sidecars injected
  - Confirm Dapr dashboard shows apps
  - Confirm pub/sub test events flow end-to-end

  ---

  PHASE 6: KUBERNETES DEPLOYMENT UPDATE

  Plan:

  - Update Deployment manifests
  - Add Dapr annotations
  - Add Kafka dependencies
  - Update Services
  - Update environment variables

  Include:

  - Rolling restart strategy
  - Verification steps after redeploy

  Cluster validation:

  - Pod health
  - Sidecar presence
  - Logs inspection
  - Event test case execution

  ---

  PHASE 7: END-TO-END EVENT FLOW VALIDATION

  Test scenarios:

  1. Create Task
     - Event published
     - Audit log created
     - Recurring service reacts if applicable

  2. Update Task
     - Update event published
     - WebSocket service pushes update

  3. Set Due Date
     - Reminder event scheduled via Dapr Jobs API
     - Notification service triggers at correct time

  4. Delete Task
     - Deletion event logged

  Validation must confirm:

  - Loose coupling
  - No direct service-to-service hard calls
  - No direct Kafka library in business layer
  - Dapr sidecars active for all services

  ---

  DECISIONS NEEDING DOCUMENTATION

  - Topic naming strategy
  - Event schema versioning
  - Service boundaries rationale
  - Dapr vs direct Kafka design reasoning
  - State store design choice
  - Reminder scheduling strategy using Jobs API
  - Scaling considerations (future cloud deployment readiness)

  ---

  TESTING STRATEGY

  Infrastructure Validation:
  - Kafka health
  - Dapr control plane health
  - Sidecar injection validation

  Functional Validation:
  - Event publishing confirmed
  - Event consumption confirmed
  - Reminder triggered correctly
  - Audit logs written

  Failure Testing:
  - Kafka pod restart
  - Service restart
  - Network delay simulation

  Compliance Check:
  - All logic aligned with Constitution principles:
      - Agent-first orchestration
      - Event-driven design
      - Runtime abstraction via Dapr
      - Secure secret handling

  ---

  IMPLEMENTATION PHASE ORDER

  1. Cluster verification
  2. Kafka deployment
  3. Dapr installation
  4. Backend event publishing transformation
  5. Microservices creation
  6. Dapr component configuration
  7. Kubernetes manifest updates
  8. End-to-end validation
  9. Cleanup and stabilization
response_text: >-
  Successfully created the implementation plan for the event-driven architecture with Dapr integration. The plan includes:
  - A comprehensive implementation plan document (plan.md)
  - Research findings and decisions (research.md)
  - Data model definitions (data-model.md)
  - Quickstart guide for setting up the system (quickstart.md)
  - API contracts for the backend service (todo-backend-api.yaml)

  The plan covers all required phases from pre-implementation validation through end-to-end validation, with detailed information on Kafka deployment, Dapr integration, microservices architecture, and event-driven design patterns.
outcome: >-
  The implementation planning phase is complete with all required documentation created. The plan is ready to be broken down into specific tasks using the /sp.tasks command.
evaluation: >-
  The planning phase successfully produced all required artifacts with appropriate detail and alignment to the constitution principles. The documents provide clear guidance for implementing the event-driven architecture with Dapr integration while maintaining loose coupling and following agent-first orchestration patterns.
---