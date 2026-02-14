import asyncio
import json
import os
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional

import uvicorn
from fastapi import FastAPI
from sqlmodel import Field, SQLModel, create_engine, Session, select

from dapr.ext.fastapi import DaprApp


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: str = Field(index=True)
    event_type: str
    task_id: str = Field(index=True)
    user_id: str = Field(index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    previous_state: Optional[str] = Field(default=None)  # JSON string
    current_state: Optional[str] = Field(default=None)   # JSON string
    changes: Optional[str] = Field(default=None)         # JSON string


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Audit Service...")
    # Initialize database
    global engine
    database_url = os.getenv("DATABASE_URL", "sqlite:///./audit_service.db")
    engine = create_engine(database_url, echo=True)
    SQLModel.metadata.create_all(bind=engine)
    print("Audit Service database initialized.")
    yield
    # Shutdown
    print("Shutting down Audit Service...")


app = FastAPI(
    title="Audit Service",
    description="Service to maintain audit logs of all task operations",
    lifespan=lifespan
)

# Wrap the app with Dapr extension
dapr_app = DaprApp(app)


@dapr_app.subscribe(pubsub_name='kafka-pubsub', topic='task-events')
async def handle_task_events(event_data: dict) -> None:
    """
    Handle task events from Kafka via Dapr pubsub and store in audit log
    """
    print(f"Received task event for audit: {event_data}")
    
    # Extract event details
    event_id = event_data.get("eventId", "")
    event_type = event_data.get("eventType", "")
    task_id = event_data.get("taskId", "")
    user_id = event_data.get("userId", "")
    task_data = event_data.get("taskData", {})
    previous_task_data = event_data.get("previousTaskData", None)
    
    # Convert task data to JSON strings
    current_state_json = json.dumps(task_data) if task_data else None
    previous_state_json = json.dumps(previous_task_data) if previous_task_data else None
    
    # Calculate changes if previous state exists
    changes_json = None
    if previous_task_data:
        changes = {}
        for key, new_value in task_data.items():
            old_value = previous_task_data.get(key)
            if old_value != new_value:
                changes[key] = {"old": old_value, "new": new_value}
        changes_json = json.dumps(changes) if changes else None
    
    # Save to audit log
    try:
        with Session(engine) as session:
            audit_entry = AuditLog(
                event_id=event_id,
                event_type=event_type,
                task_id=task_id,
                user_id=user_id,
                previous_state=previous_state_json,
                current_state=current_state_json,
                changes=changes_json
            )
            session.add(audit_entry)
            session.commit()
            print(f"Audit log entry created for event {event_id}")
    except Exception as e:
        print(f"Error saving audit log: {str(e)}")


@app.get("/audit-logs/{task_id}")
async def get_audit_logs(task_id: str):
    """
    Retrieve audit logs for a specific task
    """
    with Session(engine) as session:
        statement = select(AuditLog).where(AuditLog.task_id == task_id).order_by(AuditLog.timestamp.desc())
        audit_logs = session.exec(statement).all()
        
        # Convert to dict format
        result = []
        for log in audit_logs:
            result.append({
                "id": log.id,
                "event_id": log.event_id,
                "event_type": log.event_type,
                "task_id": log.task_id,
                "user_id": log.user_id,
                "timestamp": log.timestamp.isoformat(),
                "previous_state": json.loads(log.previous_state) if log.previous_state else None,
                "current_state": json.loads(log.current_state) if log.current_state else None,
                "changes": json.loads(log.changes) if log.changes else None
            })
        
        return {"audit_logs": result}


@app.get("/audit-logs/user/{user_id}")
async def get_audit_logs_by_user(user_id: str, limit: int = 50, offset: int = 0):
    """
    Retrieve audit logs for a specific user with pagination
    """
    with Session(engine) as session:
        statement = select(AuditLog)\
            .where(AuditLog.user_id == user_id)\
            .order_by(AuditLog.timestamp.desc())\
            .offset(offset)\
            .limit(limit)
        audit_logs = session.exec(statement).all()
        
        # Convert to dict format
        result = []
        for log in audit_logs:
            result.append({
                "id": log.id,
                "event_id": log.event_id,
                "event_type": log.event_type,
                "task_id": log.task_id,
                "user_id": log.user_id,
                "timestamp": log.timestamp.isoformat(),
                "previous_state": json.loads(log.previous_state) if log.previous_state else None,
                "current_state": json.loads(log.current_state) if log.current_state else None,
                "changes": json.loads(log.changes) if log.changes else None
            })
        
        return {"audit_logs": result}


@app.get("/")
async def read_root():
    return {"status": "Audit Service is running"}

@app.get("/health")
async def health_check():
    # Check if Dapr sidecar is accessible
    try:
        async with DaprClient() as client:
            # Try to communicate with Dapr
            await client.wait(5)  # Wait up to 5 seconds for Dapr to be ready
        dapr_status = "healthy"
    except Exception as e:
        dapr_status = f"unhealthy: {str(e)}"
    
    # Check database connectivity
    try:
        with Session(engine) as session:
            # Try a simple query
            session.exec(select(AuditLog).limit(1))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "checks": {
            "dapr_sidecar": dapr_status,
            "database": db_status,
            "subscription_status": "active"
        }
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)