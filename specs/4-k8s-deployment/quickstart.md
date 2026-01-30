# Quickstart Guide: Phase IV – Local Kubernetes Deployment of Cloud-Native Todo Chatbot

**Date**: 2026-01-29
**Feature**: 4-k8s-deployment

## Overview
This guide provides step-by-step instructions for deploying the Todo Chatbot application to a local Kubernetes cluster using AI-assisted DevOps tools.

## Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 8GB RAM (16GB recommended for smooth operation)
- **Disk Space**: 10GB available space
- **Processor**: Multi-core processor (2+ cores recommended)

### Required Tools
- **Docker Desktop**: With Kubernetes enabled or access to Docker daemon
- **Minikube**: Latest stable version installed
- **kubectl**: Kubernetes command-line tool
- **Helm**: Kubernetes package manager
- **Docker AI Agent (Gordon)**: AI-assisted containerization tool
- **kubectl-ai**: AI-enhanced kubectl with natural language support
- **kagent**: AI-powered Kubernetes analysis and optimization tool

### Configuration
- **Neon PostgreSQL Account**: Valid account with database access credentials
- **Network**: Stable internet connection for pulling images and AI tool access

## Setup Instructions

### 1. Environment Preparation
```bash
# Start Minikube cluster
minikube start --cpus=2 --memory=4g

# Verify cluster is ready
kubectl cluster-info

# Verify Helm is available
helm version
```

### 2. AI Tool Installation (if not already installed)
```bash
# Install Docker AI Agent (Gordon) - follow official installation guide
# Install kubectl-ai - follow official installation guide
# Install kagent - follow official installation guide
```

### 3. Verify AI Tools
```bash
# Test Gordon availability
# (Exact command depends on Gordon installation)

# Test kubectl-ai
kubectl-ai "show me the status of my cluster"

# Test kagent
# (Exact command depends on kagent installation)
```

## Deployment Steps

### 1. Containerize Applications with Gordon (AI-Assisted)
```bash
# Navigate to frontend directory
cd frontend

# Use Gordon to generate and build Dockerfile for frontend
# (Specific Gordon commands will vary based on Gordon's interface)
# Example:
# gordon create-dockerfile --context . --output Dockerfile
# docker build -t todo-frontend:latest .

# Navigate to backend directory
cd ../backend

# Use Gordon to generate and build Dockerfile for backend
# (Specific Gordon commands will vary based on Gordon's interface)
# Example:
# gordon create-dockerfile --context . --output Dockerfile
# docker build -t todo-backend:latest .
```

### 2. Verify Docker Images
```bash
# Check that images were created
docker images | grep todo

# Test images locally (optional)
# docker run -d -p 3000:3000 todo-frontend:latest
# docker run -d -p 8000:8000 todo-backend:latest
```

### 3. Generate Helm Charts (AI-Assisted)
```bash
# Use kubectl-ai or other AI tools to generate Helm charts
# Example commands (will vary based on tools):
# helm create todo-frontend
# helm create todo-backend

# Customize charts with appropriate configurations:
# - Resource limits: 0.5 CPU, 512MB RAM
# - NodePort service configuration
# - Environment variables from Neon PostgreSQL
# - HTTP health checks on standard ports
```

### 4. Prepare Configuration Values
```bash
# Create or update values files with your specific configuration
# In todo-frontend/values.yaml:
# image:
#   repository: todo-frontend
#   tag: latest
# service:
#   type: NodePort
#   port: 3000
# resources:
#   limits:
#     cpu: 500m
#     memory: 512Mi
#   requests:
#     cpu: 250m
#     memory: 256Mi

# In todo-backend/values.yaml:
# image:
#   repository: todo-backend
#   tag: latest
# service:
#   type: NodePort
#   port: 8000
# env:
#   DATABASE_URL: "your-neon-postgresql-connection-string"
# resources:
#   limits:
#     cpu: 500m
#     memory: 512Mi
#   requests:
#     cpu: 250m
#     memory: 256Mi
```

### 5. Deploy to Minikube
```bash
# Deploy backend first (since frontend may depend on backend)
helm install todo-backend ./todo-backend --values todo-backend/values.yaml

# Deploy frontend
helm install todo-frontend ./todo-frontend --values todo-frontend/values.yaml

# Verify deployments
kubectl get pods
kubectl get services
kubectl get deployments
```

### 6. Verify Deployment
```bash
# Check pod status
kubectl get pods -o wide

# Check service exposure
kubectl get services

# Get NodePort assignments
minikube service todo-frontend --url
minikube service todo-backend --url
```

### 7. AI-Assisted Operations
```bash
# Use kubectl-ai for deployment verification
kubectl-ai "show me the status of all deployments"

# Use kubectl-ai for scaling operations
kubectl-ai "scale the frontend deployment to 2 replicas"

# Use kagent for cluster analysis
# (Specific command depends on kagent interface)
# Example: Run health analysis on the cluster
```

## Accessing the Application

### Frontend Access
```bash
# Get the frontend NodePort URL
minikube service todo-frontend --url

# Or access through minikube tunnel (in separate terminal)
minikube tunnel
# Then access via the NodePort shown in the service details
```

### Backend Access
```bash
# Get the backend NodePort URL
minikube service todo-backend --url

# Test API endpoints
curl http://<backend-url>/health
curl http://<backend-url>/api/tasks
```

## Verification Steps

### 1. Pod Health Check
```bash
# Verify all pods are running and ready
kubectl get pods
# All pods should show STATUS as "Running" and READY as "1/1"

# Check pod details for any issues
kubectl describe pod <pod-name>
```

### 2. Service Connectivity
```bash
# Verify services are accessible
kubectl get svc

# Test service connectivity from within the cluster
kubectl run test-pod --image=curlimages/curl -it --rm --restart=Never -- curl -v <service-name>:<port>/health
```

### 3. Health Probes
```bash
# Check that liveness and readiness probes are configured and passing
kubectl describe deployment todo-frontend
kubectl describe deployment todo-backend
```

### 4. Resource Allocation
```bash
# Verify resource limits are applied
kubectl describe pod -l app=todo-frontend
kubectl describe pod -l app=todo-backend

# Check resource usage
kubectl top pods
```

## Troubleshooting

### Common Issues

#### Minikube Not Starting
```bash
# Try with specific driver
minikube start --driver=docker

# Or check status and delete/recreate
minikube status
minikube delete
minikube start
```

#### Pods in CrashLoopBackOff
```bash
# Check pod logs
kubectl logs <pod-name>

# Check pod events
kubectl describe pod <pod-name>

# Verify environment variables and database connection
kubectl exec <pod-name> -- env
```

#### Services Not Accessible
```bash
# Check if services are properly created
kubectl get svc

# Verify NodePort range and assignment
kubectl describe svc <service-name>

# Try minikube tunnel if direct access doesn't work
minikube tunnel
```

#### Database Connection Issues
```bash
# Verify database connection string is correct
kubectl get secret todo-backend-secret -o yaml

# Test database connectivity from within the pod
kubectl exec <backend-pod> -- ping <database-host>
```

## Cleanup

### Uninstall Deployments
```bash
# Uninstall Helm releases
helm uninstall todo-frontend
helm uninstall todo-backend

# Verify cleanup
kubectl get pods
kubectl get svc
```

### Stop Minikube
```bash
# Stop the Minikube cluster
minikube stop

# Or delete completely (to start fresh next time)
minikube delete
```

## Next Steps

1. **Performance Testing**: Run load tests to validate resource allocation
2. **Security Scanning**: Scan images and configurations for vulnerabilities
3. **Monitoring Setup**: Configure Prometheus and Grafana for metrics
4. **Backup Strategy**: Implement backup procedures for persistent data
5. **Scaling Tests**: Test horizontal pod autoscaling configurations