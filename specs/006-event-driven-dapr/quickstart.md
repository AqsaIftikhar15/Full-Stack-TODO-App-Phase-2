# Quickstart Guide: Event-Driven Todo Application with Dapr and Kafka

## Overview
This guide provides instructions for setting up and running the event-driven Todo application with Dapr and Kafka integration on Minikube.

## Prerequisites

### System Requirements
- Docker Desktop with Kubernetes enabled OR Minikube
- kubectl
- Helm 3+
- Dapr CLI
- Python 3.11+
- Node.js 18+

### Installation Commands
```bash
# Install Dapr CLI
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash

# Install kubectl (if not already installed)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install Helm (if not already installed)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## Setup Instructions

### 1. Start Minikube
```bash
minikube start --cpus=4 --memory=8192 --disk-size=40g
```

### 2. Install Dapr
```bash
dapr init -k
# Verify installation
dapr status -k
```

### 3. Deploy Kafka using Strimzi
```bash
# Create kafka namespace
kubectl create namespace kafka

# Install Strimzi operator
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Wait for the operator to be ready
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Deploy Kafka cluster
kubectl apply -f ./k8s/kafka-config/kafka-cluster.yaml

# Create topics
kubectl apply -f ./k8s/kafka-config/topics.yaml
```

### 4. Deploy Dapr Components
```bash
kubectl apply -f ./k8s/dapr-components/
```

### 5. Build and Deploy Application
```bash
# Build Docker images
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend

# Update Helm values for your environment
cp helm-charts/todo-app/values.yaml.example helm-charts/todo-app/values.yaml

# Install the application via Helm
helm install todo-app ./helm-charts/todo-app --set image.tag=latest
```

### 6. Verify Deployment
```bash
# Check all pods are running
kubectl get pods

# Check Dapr sidecars are injected
kubectl get pods -l app=todo-backend -o yaml | grep dapr.io/sidecar

# Port forward to access the application
kubectl port-forward svc/todo-frontend 3000:80
kubectl port-forward svc/todo-backend 8000:80
```

## Configuration

### Environment Variables
The following environment variables need to be configured:

#### Backend Service
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret for JWT token verification
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls
- `DAPR_SIDECAR_HOST`: Host for Dapr sidecar (usually "localhost")
- `DAPR_SIDECAR_PORT`: Port for Dapr sidecar (usually "3500")

#### Frontend Service
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls
- `NEXT_PUBLIC_DAPR_SIDECAR_HOST`: Host for Dapr sidecar
- `NEXT_PUBLIC_DAPR_SIDECAR_PORT`: Port for Dapr sidecar

### Dapr Component Configuration
The following Dapr components are configured:

#### Kafka Pub/Sub Component
Located at `./k8s/dapr-components/kafka-pubsub.yaml`
- Connects to the Kafka cluster deployed in the kafka namespace
- Used for task-events, reminders, and task-updates topics

#### PostgreSQL State Store
Located at `./k8s/dapr-components/statestore.yaml`
- Connects to the Neon PostgreSQL database
- Used for storing conversation state and task cache

#### Kubernetes Secret Store
Located at `./k8s/dapr-components/secrets.yaml`
- Accesses Kubernetes secrets
- Used for managing application secrets securely

## Running the Application

### Access the Application
1. Frontend: http://localhost:3000
2. Backend API: http://localhost:8000
3. Dapr Dashboard: http://localhost:8080 (run `dapr dashboard`)

### Creating Tasks
1. Navigate to the frontend application
2. Log in with your credentials
3. Create a new task using the UI or natural language commands
4. Observe that the task creation triggers events in the Kafka topics

### Testing Event Flows
1. Create a task with a due date and reminder
2. Monitor the Kafka topics for task-events and reminders
3. Verify that the Notification Service processes reminder events
4. Check that the Audit Service logs all task operations

## Troubleshooting

### Common Issues

#### Dapr Sidecar Not Injected
- Verify Dapr is installed: `dapr status -k`
- Check if the namespace has Dapr enabled: `kubectl get namespace -L dapr.io/enabled`
- Enable Dapr on the namespace: `kubectl label namespace <namespace> dapr.io/enabled=true`

#### Kafka Connection Issues
- Verify Kafka cluster is running: `kubectl get kafka -n kafka`
- Check Kafka topics exist: `kubectl get kafkatopic -n kafka`
- Verify Dapr Kafka component configuration

#### Database Connection Issues
- Verify PostgreSQL is accessible
- Check database connection string in environment variables
- Ensure Better Auth is properly configured

### Useful Commands
```bash
# Check Dapr sidecar logs
kubectl logs <pod-name> -c daprd

# Check application logs
kubectl logs <pod-name>

# Access Dapr dashboard
dapr dashboard -p 8080

# Publish a test event to Kafka via Dapr
dapr publish --pubsub kafka-pubsub -t task-events -d '{"eventType": "test", "taskId": "123"}'

# Check Dapr components
dapr components -k

# Check Dapr configurations
dapr configurations -k
```

## Scaling and Production Considerations

### Horizontal Pod Autoscaling
The application supports HPA based on CPU and memory usage. Adjust the values in the Helm chart as needed.

### Resource Limits
Default resource requests and limits are set conservatively. Increase these based on your expected load:
- Backend: 512Mi memory request, 1Gi limit
- Frontend: 256Mi memory request, 512Mi limit
- Kafka: 2Gi memory request, 4Gi limit
- Zookeeper: 1Gi memory request, 2Gi limit

### Monitoring
- Use Dapr's built-in metrics via Prometheus
- Implement distributed tracing with Zipkin/Jaeger
- Monitor Kafka topics for lag and throughput
- Set up alerts for critical services

## Next Steps

1. Explore the agent-based architecture by examining the different services
2. Customize the event processing logic in the microservices
3. Add new event types and handlers as needed
4. Implement additional business logic in the TaskManagementAgent
5. Extend the natural language processing capabilities