# Data Model: Phase IV – Local Kubernetes Deployment of Cloud-Native Todo Chatbot

**Date**: 2026-01-29
**Feature**: 4-k8s-deployment

## Overview
This document describes the data structures and configurations used in the Kubernetes deployment of the Todo Chatbot application. These represent the Kubernetes-native resources and configuration entities.

## Kubernetes Resources

### Docker Images
**Entity**: Docker Images
**Description**: Containerized versions of frontend and backend applications built using AI-assisted tools
**Fields**:
- Image name (unique identifier)
- Image tag/version
- Build timestamp
- Base image
- Size
**Relationships**: Referenced by Deployments in Helm charts

### Helm Charts
**Entity**: Helm Charts
**Description**: Packaged Kubernetes manifests for deploying the applications to the cluster
**Fields**:
- Chart name
- Version
- Description
- AppVersion
- Maintainers
- Dependencies
**Relationships**: Contains Deployments, Services, ConfigMaps, Secrets

### Kubernetes Deployments
**Entity**: Deployments
**Description**: Kubernetes resource defining how application containers should be deployed and managed
**Fields**:
- Name
- Namespace
- Replica count
- Container image reference
- Resource limits (CPU, memory)
- Environment variables
- Volume mounts
- Health check configurations
**Relationships**: Associated with Services and ConfigMaps/Secrets

### Kubernetes Services
**Entity**: Services
**Description**: Kubernetes resource exposing applications to network traffic
**Fields**:
- Name
- Type (NodePort, ClusterIP, etc.)
- Port mappings
- Selector (matching Deployment pods)
- External IP (for NodePort)
**Relationships**: Routes traffic to Deployment pods

### ConfigMaps
**Entity**: ConfigMaps
**Description**: Kubernetes resource for storing non-sensitive configuration data
**Fields**:
- Name
- Data (key-value pairs)
- BinaryData
**Relationships**: Referenced by Deployments for environment variables

### Secrets
**Entity**: Secrets
**Description**: Kubernetes resource for storing sensitive configuration data
**Fields**:
- Name
- Data (base64 encoded key-value pairs)
- StringData (plaintext, converted to base64)
- Type (Opaque, kubernetes.io/tls, etc.)
**Relationships**: Referenced by Deployments for sensitive environment variables

### Persistent Volumes (if needed)
**Entity**: Persistent Volumes
**Description**: Kubernetes resource for persistent storage (if required)
**Fields**:
- Name
- Capacity
- Access Modes
- Storage Class
- Claim Reference
**Relationships**: Bound to PersistentVolumeClaims

## Configuration Parameters

### Environment Variables
**Entity**: Environment Variables
**Description**: Configuration parameters passed to containers at runtime
**Fields**:
- Key (variable name)
- Value (or reference to ConfigMap/Secret)
- Purpose (description of what the variable controls)
**Validation Rules**:
- Keys must follow standard environment variable naming conventions
- Sensitive values must come from Secrets, not ConfigMaps

### Resource Limits
**Entity**: Resource Limits
**Description**: CPU and memory allocation for containers
**Fields**:
- CPU request/limit (e.g., "0.5", "500m")
- Memory request/limit (e.g., "512Mi", "1Gi")
- Unit type (CPU: cores/millicores, Memory: bytes/B/KB/MB/GB)
**Validation Rules**:
- Limits must be greater than or equal to requests
- Values must be within cluster capacity

### Health Check Configuration
**Entity**: Health Checks
**Description**: HTTP liveness and readiness probe definitions
**Fields**:
- Path (HTTP endpoint to check)
- Port (port to connect to)
- Initial delay (seconds)
- Period (seconds between checks)
- Timeout (connection timeout)
- Success threshold
- Failure threshold
**Validation Rules**:
- Paths must be valid endpoints on the application
- Ports must match application listening ports
- Timeouts must be reasonable for application response time

## State Transitions

### Pod Lifecycle States
**States**: Pending → Running → Succeeded/Failed
**Transitions**:
- Pending: Pod scheduled but not all containers created
- Running: Pod bound to node and all containers running
- Succeeded: All containers terminated successfully
- Failed: At least one container terminated with failure

### Deployment States
**States**: Active → Progressing → Complete/Failed
**Transitions**:
- Active: Deployment created, monitoring pods
- Progressing: Rolling update in progress
- Complete: New replica set successfully scaled up
- Failed: Update exceeded deadline or health checks failing

## Validation Rules

### Helm Chart Validation
- Chart.yaml must contain valid semantic version
- Templates must be syntactically correct
- Values must be referenced properly in templates
- Required parameters must be documented

### Kubernetes Resource Validation
- Names must follow DNS-1123 naming conventions
- Resource limits must be within cluster capacity
- Service selectors must match Deployment labels
- Health check endpoints must exist on the application

### Security Validation
- Secrets must not be stored in plain text
- Database passwords must come from Secrets
- API keys must come from Secrets
- Environment variables with "password" or "secret" in name must use Secrets