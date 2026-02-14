# Event-Driven Todo Application with Dapr and Kafka

This project implements a fully event-driven Todo application using Dapr and Apache Kafka for messaging. The architecture transforms the original REST-driven CRUD application into a decoupled microservices system.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend          │    │   Dapr Sidecars │
│   (Next.js)     │◄──►│   (FastAPI)          │◄──►│   (Infrastructure)│
└─────────────────┘    └──────────────────────┘    └─────────────────┘
                              │                           │
                              ▼                           ▼
                    ┌──────────────────────┐    ┌─────────────────┐
                    │   Kafka (Strimzi)    │◄──►│   PostgreSQL    │
                    │   (Event Streaming)  │    │   (Persistence) │
                    └──────────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│ WebSocket Sync  │    │  Notification       │    │    Audit        │
│ Service         │    │  Service            │    │   Service       │
│ (Real-time      │    │ (Reminders &       │    │ (Event Logging) │
│  Updates)       │    │  Notifications)     │    │                 │
└─────────────────┘    └──────────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Recurring Task       │
                    │ Service              │
                    │ (Task Generation)    │
                    └──────────────────────┘
```

## Components

### 1. Frontend Service
- Built with Next.js
- Communicates with backend via REST API
- Connects to WebSocket Sync Service for real-time updates
- Uses Dapr sidecar for service invocation

### 2. Backend Service
- Built with FastAPI
- Handles all business logic
- Publishes events to Kafka via Dapr pub/sub
- Uses PostgreSQL for data persistence
- Uses Dapr sidecar for pub/sub operations

### 3. WebSocket Sync Service
- Handles real-time synchronization of task updates
- Subscribes to `task-updates` topic
- Broadcasts updates to connected WebSocket clients
- Uses Dapr sidecar for pub/sub operations

### 4. Notification Service
- Handles task reminders and notifications
- Subscribes to `reminders` topic
- Sends notifications via email, push, or other methods
- Uses Dapr sidecar for pub/sub operations

### 5. Audit Service
- Maintains audit logs of all task operations
- Subscribes to `task-events` topic
- Stores audit information in PostgreSQL
- Provides API for retrieving audit logs
- Uses Dapr sidecar for pub/sub operations

### 6. Recurring Task Service
- Generates new task instances for recurring tasks
- Subscribes to `task-events` topic
- Creates new tasks based on recurrence patterns
- Uses Dapr sidecar for pub/sub operations

## Event Flow

### Task Creation Flow
1. User creates a task via the frontend
2. Backend receives the request and validates the task
3. Backend creates the task in the database
4. Backend publishes a "created" event to the `task-events` topic via Dapr
5. Multiple services consume the event:
   - WebSocket Sync Service: Broadcasts to connected clients
   - Audit Service: Creates an audit log entry
   - Notification Service: Schedules reminders if applicable
   - Recurring Task Service: Processes recurring tasks if applicable

### Task Update Flow
1. User updates a task via the frontend
2. Backend receives the request and validates the changes
3. Backend updates the task in the database
4. Backend publishes an "updated" event to the `task-updates` topic via Dapr
5. WebSocket Sync Service broadcasts the update to connected clients in real-time

### Reminder Flow
1. When a task with a due date and reminder configuration is created/updated
2. Backend publishes a reminder event to the `reminders` topic
3. Notification Service consumes the event and schedules the notification
4. At the specified time, the notification is delivered to the user

## Deployment

### Prerequisites
- Kubernetes cluster (tested with Minikube)
- Helm 3+
- Dapr CLI
- kubectl

### Deployment Steps

1. Install Dapr in your Kubernetes cluster:
   ```bash
   dapr init -k
   ```

2. Install Strimzi Kafka operator:
   ```bash
   kubectl create namespace kafka
   kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
   kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s
   ```

3. Deploy Kafka cluster:
   ```bash
   kubectl apply -f k8s/kafka-config/kafka-cluster.yaml
   kubectl wait --for=condition=ready kafka/my-cluster -n kafka --timeout=600s
   ```

4. Create Kafka topics:
   ```bash
   kubectl apply -f k8s/kafka-config/topics.yaml
   ```

5. Apply Dapr component configurations:
   ```bash
   kubectl apply -f k8s/dapr-components/
   ```

6. Build and deploy the application using the Helm chart:
   ```bash
   # Build Docker images
   docker build -t todo-frontend:latest ./frontend
   docker build -t todo-backend:latest ./backend
   docker build -t websocket-sync-service:latest ./microservices/websocket-sync-service
   docker build -t notification-service:latest ./microservices/notification-service
   docker build -t audit-service:latest ./microservices/audit-service
   docker build -t recurring-task-service:latest ./microservices/recurring-task-service

   # Deploy with Helm
   helm install todo-app ./helm-charts/todo-app-event-driven
   ```

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **Messaging**: Apache Kafka (via Strimzi)
- **Runtime**: Dapr (Distributed Application Runtime)
- **Orchestration**: Kubernetes
- **Packaging**: Helm

## Benefits of Event-Driven Architecture

1. **Loose Coupling**: Services communicate through events rather than direct calls
2. **Scalability**: Each service can scale independently
3. **Resilience**: Failure in one service doesn't affect others
4. **Extensibility**: Easy to add new services that consume events
5. **Real-time Updates**: WebSocket sync service provides live updates to clients

## Development

To run the application locally for development:

1. Start the backend:
   ```bash
   cd backend
   poetry install
   poetry run python -m src.main
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Start the microservices:
   ```bash
   # For each microservice in the microservices directory
   cd microservices/[service-name]
   pip install -r requirements.txt
   python main.py
   ```