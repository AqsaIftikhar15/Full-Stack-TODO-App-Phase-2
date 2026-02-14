# Research Summary: Event-Driven Architecture with Dapr Integration

## Overview
This research document captures findings and decisions made during the planning phase for transforming the existing Todo application into an event-driven architecture using Kafka and Dapr.

## Decision: Kafka Deployment Strategy
**Rationale**: For local Minikube deployment, the Strimzi Operator approach is optimal as it provides enterprise-grade Kafka management capabilities even in resource-constrained environments. Strimzi offers declarative Kafka management through custom resources, making it ideal for Kubernetes environments.

**Alternatives considered**:
- Self-managed Kafka with manual configuration: More complex to set up and maintain
- Confluent Operator: Commercial solution that may not be necessary for local development
- Standalone Kafka pods: Less resilient and harder to manage than operator-based approach

## Decision: Dapr Runtime Integration
**Rationale**: Dapr provides the perfect abstraction layer for our event-driven architecture, offering pub/sub, state management, service invocation, and secret management through a sidecar pattern. This eliminates the need for direct Kafka client code in business logic while providing a consistent API across different infrastructure backends.

**Alternatives considered**:
- Direct Kafka client integration: Would violate the loose coupling principle and create tight dependencies
- Custom messaging layer: Would reinvent existing solutions and increase complexity
- RabbitMQ instead of Kafka: Kafka offers better durability and ordering guarantees for our use case

## Decision: Microservices Architecture
**Rationale**: Breaking down the monolithic backend into focused microservices (Notification, Recurring Task, Audit, WebSocket Sync) promotes loose coupling and allows each service to scale independently based on demand. Using Dapr pub/sub for communication ensures services remain decoupled.

**Alternatives considered**:
- Monolithic approach with internal event processing: Would create tight coupling and scaling challenges
- Serverless functions for event processing: May introduce cold start latency issues
- Shared database for communication: Would violate the microservices principle of independent data stores

## Decision: Event Schema Design
**Rationale**: Using JSON for event payloads provides flexibility and readability while maintaining compatibility with various systems. Standardized schemas for TaskEvent and ReminderEvent ensure consistency across all services consuming these events.

**Alternatives considered**:
- Avro serialization: More compact but adds schema registry complexity
- Protocol Buffers: More efficient but requires code generation and maintenance overhead
- Plain text events: Insufficient structure for complex event data

## Decision: Reminder Scheduling Approach
**Rationale**: Using Dapr's Jobs API instead of cron polling provides exact time-based scheduling and eliminates the need for services to continuously poll the database for scheduled tasks. This is more efficient and accurate than traditional cron-based approaches.

**Alternatives considered**:
- Traditional cron jobs: Less accurate timing and requires database polling
- Database-based scheduling: More complex to implement and maintain
- Third-party scheduling services: Adds external dependencies

## Technical Unknowns Resolved

### Minikube Cluster Verification
- **Issue**: How to verify existing Minikube cluster state
- **Resolution**: Use `minikube status` and `kubectl get pods --all-namespaces` to check cluster health

### Dapr Installation Process
- **Issue**: How to properly install Dapr on Minikube
- **Resolution**: Use `dapr init -k` command which installs Dapr control plane to Kubernetes

### Kafka Topic Management
- **Issue**: How to create and manage Kafka topics in Strimzi
- **Resolution**: Use KafkaTopic custom resources in Kubernetes manifests

### Service Discovery
- **Issue**: How services will discover each other with Dapr
- **Resolution**: Use Dapr service invocation which handles service discovery automatically

## Architecture Patterns Identified

### Event-Driven Architecture
- Services communicate through events published to Kafka via Dapr pub/sub
- Loose coupling between services ensures scalability and maintainability
- Event sourcing pattern supports audit trail requirements

### Sidecar Pattern
- Dapr sidecars handle infrastructure concerns (messaging, state, secrets)
- Applications remain focused on business logic
- Consistent approach across all services

### Reactive Programming
- Event consumers react to incoming events asynchronously
- Non-blocking operations improve system responsiveness
- Backpressure handling through Kafka partitions

## Best Practices Applied

### Infrastructure as Code
- All Kubernetes resources defined in YAML manifests
- Dapr components configured declaratively
- Helm charts for deployment packaging

### Security First
- Secrets managed through Dapr secret store
- Service-to-service authentication via Dapr
- No hardcoded credentials in application code

### Observability
- Dapr provides built-in tracing and metrics
- Structured logging for debugging and monitoring
- Health checks for all services

## Risks and Mitigations

### Kafka Availability
- **Risk**: Kafka downtime affects entire event-driven system
- **Mitigation**: Implement dead letter queues and retry mechanisms

### Event Ordering
- **Risk**: Events processed out of order affecting business logic
- **Mitigation**: Use Kafka partitioning by entity ID to ensure ordering within entity groups

### Service Dependencies
- **Risk**: Downstream services unavailable when events are published
- **Mitigation**: Implement proper error handling and dead letter queues

## Implementation Readiness
All technical unknowns have been resolved and the team is ready to proceed with the implementation. The architecture is well-defined with clear service boundaries and communication patterns.