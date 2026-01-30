# Todo Chatbot Helm Charts

This directory contains Helm charts for deploying the Todo Chatbot application to a Kubernetes cluster.

## Charts

### todo-backend
Helm chart for the Todo Chatbot backend service (Python FastAPI application)

### todo-frontend
Helm chart for the Todo Chatbot frontend service (Next.js application)

## Deployment Instructions

1. Ensure you have a running Kubernetes cluster (e.g., Minikube)
2. Build the Docker images for frontend and backend
3. Push images to a registry accessible by your cluster (or use local images for Minikube)
4. Install the Helm charts:

```bash
# Install backend
helm install todo-backend ./todo-backend --values todo-backend/values.yaml

# Install frontend
helm install todo-frontend ./todo-frontend --values todo-frontend/values.yaml
```

## Configuration

Each chart can be customized using values in the `values.yaml` file. Key configuration options include:

- `replicaCount`: Number of pod replicas
- `image.repository`: Docker image repository
- `image.tag`: Docker image tag
- `service.type`: Service type (ClusterIP, NodePort, LoadBalancer)
- `resources`: CPU and memory limits/requests
- Probes: Health check configurations

## AI-Assisted Deployment

This deployment follows the Agentic Dev Stack methodology using AI-assisted tools:
- Docker AI Agent (Gordon) for containerization
- kubectl-ai for Kubernetes operations
- kagent for cluster analysis and optimization