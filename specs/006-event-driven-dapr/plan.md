# Implementation Plan: Event-Driven Architecture with Dapr Integration

**Branch**: `006-event-driven-dapr` | **Date**: 2026-02-13 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-event-driven-dapr/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform the existing Todo application from a REST-driven CRUD architecture into an event-driven, decoupled microservices system using Kafka for messaging and Dapr for runtime abstractions. This extends the existing Phase IV Kubernetes deployment by adding Kafka cluster, Dapr runtime, and new microservices for handling recurring tasks, notifications, audit trails, and real-time synchronization. The backend will be converted to an event publisher, removing tight coupling between business logic and side effects.

## Technical Context

**Language/Version**: Python 3.11 (existing backend), TypeScript/Next.js (existing frontend)
**Primary Dependencies**: FastAPI, SQLModel, Neon PostgreSQL, Better Auth, Kafka, Dapr, Strimzi Operator
**Storage**: Neon Serverless PostgreSQL (primary), Kafka topics for event streaming
**Testing**: pytest (existing), with additional integration tests for event flows
**Target Platform**: Kubernetes (Minikube for local, AKS/GKE/OKE for cloud)
**Project Type**: Web application (frontend + backend + microservices)
**Performance Goals**: Event processing with <200ms latency, 99% uptime for core functionality
**Constraints**: Must maintain loose coupling between services, no direct Kafka client usage in business logic, all communication via Dapr
**Scale/Scope**: Support 1000+ concurrent users with event-driven processing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ I. Spec-Driven Development: Following spec-driven approach as required
- ✅ II. Agentic Dev Stack Workflow: Following spec → plan → tasks → execute flow
- ✅ III. Technology Stack Compliance: Using existing frontend, Python FastAPI backend, Neon PostgreSQL
- ✅ IV. Security-First Architecture: All communication through Dapr with proper authentication
- ✅ V. Container-First Deployment: Extending existing Docker setup with Dapr sidecars
- ✅ VIII. Agent-First Orchestration: Defining agents with clear responsibilities and event-driven communication
- ✅ IX. MCP Architecture Compliance: Maintaining stateless backend with Neon PostgreSQL persistence
- ✅ X. Kubernetes-First Deployment: Extending existing Helm charts with Kafka and Dapr components
- ✅ XIII. Agent-Based Architecture: Defining clear agent responsibilities and event-driven communication
- ✅ XIV. Event-Driven Design with Kafka: Using Kafka for asynchronous event streaming via Dapr
- ✅ XV. Dapr Runtime Integration: Using Dapr for all distributed application capabilities
- ✅ XVI. Cloud-First Deployment: Starting with Minikube, targeting cloud Kubernetes

## Project Structure

### Documentation (this feature)

```text
specs/006-event-driven-dapr/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   ├── api/
│   └── agents/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

helm-charts/
├── todo-app/
│   ├── templates/
│   │   ├── frontend/
│   │   ├── backend/
│   │   ├── kafka/
│   │   ├── dapr/
│   │   └── microservices/
│   └── values.yaml

k8s/
├── dapr-components/
│   ├── kafka-pubsub.yaml
│   ├── statestore.yaml
│   ├── secrets.yaml
│   └── scheduler.yaml
└── kafka-config/
    ├── strimzi-install.yaml
    ├── kafka-cluster.yaml
    └── topics.yaml

microservices/
├── notification-service/
├── recurring-task-service/
├── audit-service/
└── websocket-sync-service/
```

**Structure Decision**: Extending the existing web application structure with new microservices and Kubernetes configurations. The existing backend and frontend remain largely unchanged, with the addition of Dapr sidecars and event publishing capabilities. New microservices are added as separate applications that consume events from Kafka via Dapr pub/sub.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | (None) | (None) |

## Phase 0: Pre-Implementation Validation

### Cluster Verification
- Verify Minikube cluster is running
- Confirm namespace and Helm releases
- Verify existing frontend and backend deployments
- Capture current pod state
- Confirm backend endpoints are currently working

### Current Architecture Assessment
- Document current REST-based architecture
- Identify service communication patterns
- Catalog existing components and their dependencies

## Phase 1: Architecture Transformation Design

### Target Architecture Design
- Design event-driven architecture with Kafka and Dapr
- Define service boundaries and responsibilities
- Plan event flow from task creation to all downstream effects
- Document microservice separation strategy

### Event Producer/Consumer Mapping
- Identify event producers (Backend)
- Define event consumers (Notification, Recurring Task, Audit, WebSocket Sync services)
- Plan topic mapping (task-events, reminders, task-updates)

## Phase 2: Kafka Deployment Planning

### Kafka Infrastructure
- Plan Kafka deployment using Strimzi Operator
- Configure Kafka cluster for Minikube
- Define topic creation strategy for task-events, reminders, and task-updates

### Event Schema Design
- Define TaskEvent schema structure
- Define ReminderEvent schema structure
- Plan message format (JSON) and partition strategy

## Phase 3: Backend Transformation Planning

### Event Publishing Implementation
- Plan conversion of backend to event publisher
- Define event publishing points (create, update, complete, delete, due date set)
- Ensure removal of tight coupling between business logic and side effects

### Dapr Integration Points
- Plan Dapr pubsub usage for event publishing
- Ensure no direct Kafka client usage in business logic

## Phase 4: Microservices Planning

### Service Definitions
1. Notification Service
   - Subscribe to reminder events
   - Send user notifications

2. Recurring Task Service
   - Subscribe to task-events
   - Generate next task instances

3. Audit Service
   - Subscribe to task-events
   - Maintain audit logs

4. WebSocket Sync Service
   - Subscribe to task-updates
   - Broadcast updates to clients

## Phase 5: Dapr Integration Planning

### Dapr Components Configuration
- Plan Dapr installation on Kubernetes
- Define Dapr component configurations (pubsub.kafka, state.postgresql, secretstore.kubernetes, scheduler)
- Plan Dapr sidecar injection strategy

### Dapr Building Blocks Implementation
- Plan Pub/Sub usage via Dapr HTTP API
- Plan State Management for conversation state and task cache
- Plan Service Invocation for frontend-backend communication
- Plan Jobs API usage for reminder scheduling (instead of cron polling)

## Phase 6: Kubernetes Deployment Update

### Manifest Updates
- Plan updates to existing deployment manifests
- Add Dapr annotations to all services
- Update services and environment variables
- Plan rolling restart strategy

### Validation Steps
- Plan pod health verification
- Confirm sidecar presence
- Plan logs inspection
- Define event test case execution

## Phase 7: End-to-End Validation

### Test Scenarios
1. Task Creation Flow
   - Event publishing verification
   - Audit log creation
   - Recurring task reaction (if applicable)

2. Task Update Flow
   - Update event publishing
   - WebSocket update broadcasting

3. Due Date Setting
   - Reminder event scheduling via Dapr Jobs API
   - Notification service triggering

4. Task Deletion
   - Deletion event logging

### Success Criteria Validation
- Verify loose coupling between services
- Confirm no direct service-to-service hard calls
- Ensure no direct Kafka library in business layer
- Validate Dapr sidecars active for all services