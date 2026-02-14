import asyncio
import json
import os
from datetime import datetime
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
import httpx

from dapr.ext.fastapi import DaprApp
from dapr.clients import DaprClient


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Notification Service...")
    yield
    # Shutdown
    print("Shutting down Notification Service...")


app = FastAPI(
    title="Notification Service",
    description="Service to handle task reminders and notifications",
    lifespan=lifespan
)

# Wrap the app with Dapr extension
dapr_app = DaprApp(app)


@dapr_app.subscribe(pubsub_name='kafka-pubsub', topic='reminders')
async def handle_reminder_events(event_data: dict) -> None:
    """
    Handle reminder events from Kafka via Dapr pubsub
    """
    print(f"Received reminder event: {event_data}")
    
    # Extract reminder details from the event
    task_id = event_data.get("taskId", "")
    title = event_data.get("title", "")
    due_at = event_data.get("dueAt", "")
    remind_at = event_data.get("remindAt", "")
    user_id = event_data.get("userId", "")
    notification_method = event_data.get("notificationMethod", "email")
    
    # Schedule the notification using Dapr's scheduler
    try:
        # Calculate delay until reminder time
        remind_time = datetime.fromisoformat(remind_at.replace('Z', '+00:00'))
        current_time = datetime.now(remind_time.tzinfo)
        delay_seconds = max(0, int((remind_time - current_time).total_seconds()))

        # Create a job to send the notification at the specified time
        job_name = f"reminder-{task_id}-{user_id}"

        # For now, we'll just log that we would schedule a notification
        print(f"Scheduled notification for task {task_id} to user {user_id} via {notification_method} at {remind_at}")

        # In a real implementation, we would use Dapr's Jobs API to schedule the notification
        # For now, we'll simulate the scheduling by sleeping until the reminder time
        # and then sending the notification
        if delay_seconds > 0:
            print(f"Notification scheduled for {delay_seconds} seconds from now")
            await asyncio.sleep(delay_seconds)

        await send_notification(task_id, title, user_id, notification_method)

    except Exception as e:
        print(f"Error scheduling notification: {str(e)}")


async def send_notification(task_id: str, title: str, user_id: str, method: str):
    """
    Send a notification to the user via the specified method
    """
    print(f"Sending {method} notification for task '{title}' (ID: {task_id}) to user {user_id}")
    
    # In a real implementation, we would send actual notifications
    # For now, we'll just log the notification
    notification_data = {
        "taskId": task_id,
        "title": title,
        "userId": user_id,
        "method": method,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "sent"
    }
    
    # Optionally, publish an event to indicate the notification was sent
    try:
        async with DaprClient() as client:
            # Publish notification sent event
            await client.publish_event(
                pubsub_name='kafka-pubsub',
                topic='notifications',
                data=json.dumps(notification_data),
                data_content_type='application/json'
            )
            print(f"Notification sent event published for task {task_id}")
    except Exception as e:
        print(f"Error publishing notification sent event: {str(e)}")


@app.get("/")
async def read_root():
    return {"status": "Notification Service is running"}

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
    
    return {
        "status": "healthy",
        "checks": {
            "dapr_sidecar": dapr_status,
            "subscription_status": "active"
        }
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)