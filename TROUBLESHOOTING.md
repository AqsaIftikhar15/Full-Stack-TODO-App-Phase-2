# Troubleshooting Guide: Event-Driven Todo Application

This guide provides solutions for common issues with Kafka and Dapr in the event-driven Todo application.

## Kafka Issues

### 1. Kafka Cluster Not Ready
**Problem**: Kafka cluster remains in "NotReady" state after deployment.
```bash
kubectl get kafka -n kafka
```

**Solution**:
1. Check the Kafka cluster resource status:
   ```bash
   kubectl describe kafka my-cluster -n kafka
   ```

2. Check the Kafka pods:
   ```bash
   kubectl get pods -n kafka
   kubectl logs -l strimzi.io/name=my-cluster-kafka -n kafka
   ```

3. Ensure your Kubernetes cluster has enough resources (CPU, memory, persistent volumes).

### 2. Kafka Topics Not Created
**Problem**: Kafka topics are not created or not accessible.

**Solution**:
1. Verify the topics were applied:
   ```bash
   kubectl get kafkatopics -n kafka
   ```

2. Check topic details:
   ```bash
   kubectl describe kafkatopic task-events -n kafka
   kubectl describe kafkatopic reminders -n kafka
   kubectl describe kafkatopic task-updates -n kafka
   ```

### 3. Kafka Connection Issues
**Problem**: Services cannot connect to Kafka.

**Solution**:
1. Verify Kafka bootstrap service:
   ```bash
   kubectl get svc -l strimzi.io/name=my-cluster-kafka -n kafka
   ```

2. Check if the service name matches what's configured in Dapr components:
   ```bash
   kubectl describe component kafka-pubsub -n todo
   ```

## Dapr Issues

### 1. Dapr Sidecar Not Injected
**Problem**: Dapr sidecar is not injected into pods.

**Solution**:
1. Verify Dapr is running:
   ```bash
   dapr status -k
   ```

2. Check if the namespace has Dapr enabled:
   ```bash
   kubectl get namespace todo -L dapr.io/enabled
   ```

3. If not enabled, enable it:
   ```bash
   kubectl label namespace todo dapr.io/enabled=true
   ```

4. Check if the deployment has Dapr annotations:
   ```bash
   kubectl describe deployment todo-backend -n todo
   ```

### 2. Dapr Component Configuration Issues
**Problem**: Dapr components are not configured correctly.

**Solution**:
1. Check component status:
   ```bash
   kubectl get components -n todo
   ```

2. Describe specific components:
   ```bash
   kubectl describe component kafka-pubsub -n todo
   kubectl describe component postgresql-statestore -n todo
   kubectl describe component kubernetes-secret-store -n todo
   ```

3. Check Dapr logs:
   ```bash
   kubectl logs -l app=todo-backend -c daprd -n todo
   ```

### 3. Dapr Service Invocation Failures
**Problem**: Services cannot communicate via Dapr service invocation.

**Solution**:
1. Verify the service is running:
   ```bash
   kubectl get svc -n todo
   ```

2. Check if the app-id matches the service name:
   ```bash
   kubectl describe deployment todo-backend -n todo
   ```

3. Check Dapr sidecar logs for errors:
   ```bash
   kubectl logs -l app=todo-backend -c daprd -n todo
   ```

## Common Application Issues

### 1. Services Not Connecting to Each Other
**Problem**: Services cannot communicate with each other.

**Solution**:
1. Verify all services are running:
   ```bash
   kubectl get pods -n todo
   ```

2. Check if Dapr sidecars are running:
   ```bash
   kubectl get pods -n todo -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{range .spec.containers[*]}{"\t"}{.name}{"\n"}{end}{range .spec.initContainers[*]}{"\t"}{.name}{" (init)\n"}{end}{"\n"}{end}'
   ```

3. Check service logs:
   ```bash
   kubectl logs -l app=todo-backend -n todo
   kubectl logs -l app=websocket-sync-service -n todo
   ```

### 2. Events Not Being Published or Consumed
**Problem**: Events are not flowing through the system as expected.

**Solution**:
1. Check if the backend is publishing events:
   ```bash
   kubectl logs -l app=todo-backend -n todo | grep -i event
   ```

2. Verify Dapr sidecar is handling pub/sub:
   ```bash
   kubectl logs -l app=todo-backend -c daprd -n todo | grep -i pubsub
   ```

3. Check consumer services:
   ```bash
   kubectl logs -l app=notification-service -n todo | grep -i reminder
   kubectl logs -l app=audit-service -n todo | grep -i audit
   ```

### 3. Database Connection Issues
**Problem**: Services cannot connect to the PostgreSQL database.

**Solution**:
1. Verify the database is running:
   ```bash
   kubectl get pods -l app=postgres
   ```

2. Check database connectivity from a service:
   ```bash
   kubectl run tmp-busybox --image=busybox -it --rm --restart=Never -- nslookup postgres-service.todo.svc.cluster.local
   ```

3. Check environment variables in the deployment:
   ```bash
   kubectl describe deployment todo-backend -n todo
   ```

## Debugging Tips

### 1. Enable Dapr Logging
Add these annotations to your deployment to increase Dapr logging:
```yaml
annotations:
  dapr.io/log-level: "debug"
  dapr.io/app-max-concurrency: "10"
```

### 2. Check Dapr Placement Service
For actor-based applications, verify the placement service:
```bash
kubectl get pods -n dapr-system | grep placement
```

### 3. Verify Dapr Configuration
Check the default Dapr configuration:
```bash
kubectl get configurations.dapr.io -n todo
kubectl get configurations.dapr.io -n dapr-system
```

### 4. Use Dapr Dashboard
Run the Dapr dashboard to visualize your application:
```bash
dapr dashboard -p 8080
```

### 5. Test Dapr Locally
Use Dapr CLI to test pub/sub locally:
```bash
dapr run --app-id test-pubsub --dapr-http-port 3500
dapr publish --pubsub kafka-pubsub -t task-events -d '{"eventType": "test", "taskId": "123"}'
```

## Performance Issues

### 1. High Latency in Event Processing
**Problem**: Events take too long to be processed.

**Solution**:
1. Check Kafka broker performance:
   ```bash
   kubectl top pods -n kafka
   ```

2. Verify consumer group lag:
   Use Kafka tools to check consumer group status:
   ```bash
   kubectl exec -it my-cluster-kafka-0 -n kafka -- bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group dapr-group
   ```

### 2. Resource Constraints
**Problem**: Services are being killed due to resource limits.

**Solution**:
1. Check resource usage:
   ```bash
   kubectl top pods -n todo
   ```

2. Adjust resource limits in your Helm chart values:
   ```yaml
   resources:
     requests:
       memory: "256Mi"
       cpu: "200m"
     limits:
       memory: "512Mi"
       cpu: "500m"
   ```