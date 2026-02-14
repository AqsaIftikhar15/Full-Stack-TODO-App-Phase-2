---
id: 001
title: event-driven-dapr-specification
stage: spec
date: 2026-02-13
surface: agent
model: GPT-4
feature: event-driven-dapr
branch: 006-event-driven-dapr
user: Assistant
command: /sp.specify
labels: ["specification", "event-driven", "dapr", "kafka", "kubernetes"]
links:
  spec: "../specs/006-event-driven-dapr/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - ../specs/006-event-driven-dapr/spec.md
  - ../specs/006-event-driven-dapr/checklists/requirements.md
tests: []
prompt_text: >-
  Todo Chatbot Web Application – Phase V (Remaining Scope) Event-Driven Architecture + Dapr Integration + Local Kubernetes Deployment Target: Extend the EXISTING Todo Chatbot system (already containing Intermediate and Advanced features) by implementing: 1) Event-Driven Architecture using Kafka 2) Full Dapr integration 3) Local deployment on Minikube with Dapr enabled This must be an extension of the current Phase IV Kubernetes deployment. No rewriting. No new project. No manual coding. The agent MUST first verify the current Minikube deployment from Phase IV before proceeding. --- PRIMARY OBJECTIVE Transform the Todo application from REST-driven CRUD architecture into an event-driven, decoupled microservices system using: - Kafka (inside Kubernetes cluster) - Dapr sidecars - Dapr components (Pub/Sub, State, Jobs/Bindings, Secrets, Service Invocation) All existing Intermediate and Advanced features must now operate through event-driven patterns where appropriate. --- PRE-IMPLEMENTATION VERIFICATION (MANDATORY) Before specification: 1. Verify Minikube cluster is running. 2. Verify Phase IV deployment exists. 3. Verify: - Frontend pod - Backend pod - Service exposure 4. Confirm current namespace and Helm deployment status. 5. Document cluster state before modifications. If deployment is missing or broken: → Specify remediation steps before continuing. --- PART A: EVENT-DRIVEN ARCHITECTURE (Kafka) Add Kafka inside Kubernetes cluster. Recommended: Self-hosted Kafka via Strimzi Operator. Scope: 1. Deploy Kafka cluster inside Minikube. 2. Create topics: - task-events - reminders - task-updates 3. Convert backend to Event Publisher: - On task created → publish "created" event - On task updated → publish "updated" - On task completed → publish "completed" - On task deleted → publish "deleted" - On due date set → publish reminder event 4. Create separate microservices: - Recurring Task Service (consumer of task-events) - Notification Service (consumer of reminders) - Audit Service (consumer of task-events) - WebSocket Sync Service (consumer of task-updates) 5. Define event schemas for: - Task Event - Reminder Event 6. Ensure: - Backend no longer tightly couples reminder logic - Recurring tasks processed asynchronously - Audit logs fully event-driven --- PART B: DAPR INTEGRATION (FULL) Deploy Dapr on Minikube using: dapr init -k Dapr must be used for ALL building blocks: 1. Pub/Sub - Use Dapr pubsub.kafka component - Replace direct Kafka client usage with Dapr HTTP API 2. State Management - Use state.postgresql - Store conversation state and task cache via Dapr 3. Service Invocation - Frontend → Backend through Dapr invoke API - Remove hardcoded service URLs 4. Jobs API (NOT polling cron) - Use Dapr Jobs API for scheduled reminders - Exact time-based scheduling - Trigger callback endpoint 5. Secrets Management - Use Kubernetes Secrets via Dapr secret store - No credentials directly in code Define required Dapr components: - kafka-pubsub - statestore - kubernetes-secrets - scheduler (Jobs API) All components must be defined via YAML and deployed to cluster. --- ARCHITECTURE REQUIREMENTS Final architecture must contain: Frontend Pod (+ Dapr sidecar) Backend Pod (+ Dapr sidecar) Notification Pod (+ Dapr sidecar) Recurring Task Pod (+ Dapr sidecar) Audit Pod (+ Dapr sidecar) Kafka cluster Dapr components Loose coupling mandatory. No direct Kafka library imports in business logic. --- CONSTRAINTS - Must follow Agentic Dev Stack workflow - No manual coding - Spec only - Must align with Constitution: - Agent-first orchestration - Event-driven design - Dapr runtime compliance - MCP tool integration - Security-first architecture --- SUCCESS CRITERIA 1. All task operations publish events. 2. Recurring logic processed asynchronously. 3. Reminder scheduling uses Dapr Jobs API. 4. No direct Kafka code in business layer. 5. Dapr sidecars injected into all relevant pods. 6. Minikube deployment confirmed working. 7. Event-driven flow demonstrable end-to-end.
response_text: >-
  Created feature specification for Event-Driven Architecture with Dapr Integration. The specification includes user scenarios, functional requirements, and success criteria for transforming the Todo application from a REST-driven CRUD architecture to an event-driven, decoupled microservices system using Kafka and Dapr components. The specification covers all required elements including Kafka deployment, Dapr integration, and the necessary microservices for handling recurring tasks, notifications, audit trails, and real-time synchronization.
outcome: >-
  Successfully created the feature specification for event-driven architecture with Dapr integration. The specification is complete and ready for the planning phase.
evaluation: >-
  The specification meets all requirements with clearly defined user scenarios, functional requirements, and success criteria. The checklist confirms all validation points have been met.
---