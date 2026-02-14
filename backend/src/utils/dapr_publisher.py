import asyncio
import json
import os
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import httpx


def validate_task_event_schema(event_data: Dict[str, Any]) -> tuple[bool, str]:
    """
    Validate the TaskEvent schema
    
    Args:
        event_data: The event data to validate
        
    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    required_fields = ["eventType", "taskId", "userId", "taskData"]
    optional_fields = ["previousTaskData"]
    
    # Check required fields
    for field in required_fields:
        if field not in event_data:
            return False, f"Missing required field: {field}"
    
    # Validate eventType
    event_type = event_data["eventType"]
    valid_event_types = ["created", "updated", "completed", "deleted"]
    if event_type not in valid_event_types:
        return False, f"Invalid eventType: {event_type}. Must be one of {valid_event_types}"
    
    # Validate taskId
    task_id = event_data["taskId"]
    if not isinstance(task_id, str) or not task_id.strip():
        return False, "taskId must be a non-empty string"
    
    # Validate userId
    user_id = event_data["userId"]
    if not isinstance(user_id, str) or not user_id.strip():
        return False, "userId must be a non-empty string"
    
    # Validate taskData
    task_data = event_data["taskData"]
    if not isinstance(task_data, dict):
        return False, "taskData must be a dictionary"
    
    # Validate taskData fields
    required_task_fields = ["id", "title", "completed", "userId", "createdAt", "updatedAt", "priority", "status"]
    for field in required_task_fields:
        if field not in task_data:
            return False, f"Missing required field in taskData: {field}"
    
    # Validate previousTaskData if present
    if "previousTaskData" in event_data and event_data["previousTaskData"] is not None:
        prev_task_data = event_data["previousTaskData"]
        if not isinstance(prev_task_data, dict):
            return False, "previousTaskData must be a dictionary if provided"
        
        for field in required_task_fields:
            if field not in prev_task_data:
                return False, f"Missing required field in previousTaskData: {field}"
    
    return True, ""


def validate_reminder_event_schema(event_data: Dict[str, Any]) -> tuple[bool, str]:
    """
    Validate the ReminderEvent schema
    
    Args:
        event_data: The event data to validate
        
    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    required_fields = ["taskId", "title", "dueAt", "remindAt", "userId", "notificationMethod", "status"]
    
    # Check required fields
    for field in required_fields:
        if field not in event_data:
            return False, f"Missing required field: {field}"
    
    # Validate taskId
    task_id = event_data["taskId"]
    if not isinstance(task_id, str) or not task_id.strip():
        return False, "taskId must be a non-empty string"
    
    # Validate title
    title = event_data["title"]
    if not isinstance(title, str) or not title.strip():
        return False, "title must be a non-empty string"
    
    # Validate dueAt and remindAt
    due_at = event_data["dueAt"]
    remind_at = event_data["remindAt"]
    if not isinstance(due_at, str) or not isinstance(remind_at, str):
        return False, "dueAt and remindAt must be strings in ISO format"
    
    # Validate userId
    user_id = event_data["userId"]
    if not isinstance(user_id, str) or not user_id.strip():
        return False, "userId must be a non-empty string"
    
    # Validate notificationMethod
    notification_method = event_data["notificationMethod"]
    valid_notification_methods = ["email", "push", "both"]
    if notification_method not in valid_notification_methods:
        return False, f"Invalid notificationMethod: {notification_method}. Must be one of {valid_notification_methods}"
    
    # Validate status
    status = event_data["status"]
    valid_statuses = ["scheduled", "sent", "cancelled"]
    if status not in valid_statuses:
        return False, f"Invalid status: {status}. Must be one of {valid_statuses}"
    
    return True, ""


class DaprEventPublisher:
    """
    Utility class to publish events to Dapr pub/sub component
    """
    
    def __init__(self):
        # Use Dapr sidecar address - typically localhost:3500 in Kubernetes
        self.dapr_base_url = f"http://localhost:{os.getenv('DAPR_HTTP_PORT', '3500')}"
        self.client = httpx.AsyncClient(timeout=httpx.Timeout(30.0))
        
    async def publish_event(self, topic: str, event_data: Dict[str, Any]) -> bool:
        """
        Publish an event to a specific topic via Dapr
        
        Args:
            topic: The Kafka topic to publish to
            event_data: The event payload to publish
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Validate the event schema based on topic
            is_valid = False
            error_msg = ""
            
            if topic == "task-events" or topic == "task-updates":
                is_valid, error_msg = validate_task_event_schema(event_data)
            elif topic == "reminders":
                is_valid, error_msg = validate_reminder_event_schema(event_data)
            else:
                # For other topics, we won't validate
                is_valid = True
            
            if not is_valid:
                print(f"Event validation failed for topic '{topic}': {error_msg}")
                return False
            
            url = f"{self.dapr_base_url}/v1.0/publish/kafka-pubsub/{topic}"
            
            # Add common event fields
            event_payload = {
                "eventId": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **event_data
            }
            
            response = await self.client.post(
                url,
                json=event_payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print(f"Event published successfully to topic '{topic}'")
                return True
            else:
                print(f"Failed to publish event to topic '{topic}'. Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"Error publishing event to topic '{topic}': {str(e)}")
            return False
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Global instance
dapr_publisher = DaprEventPublisher()


async def publish_task_event(
    event_type: str,
    task_data: Dict[str, Any],
    user_id: str,
    task_id: str,
    previous_task_data: Optional[Dict[str, Any]] = None
) -> bool:
    """
    Publish a task-related event to the appropriate Kafka topic via Dapr
    
    Args:
        event_type: Type of event ('created', 'updated', 'completed', 'deleted')
        task_data: Current state of the task
        user_id: ID of the user who triggered the event
        task_id: ID of the task
        previous_task_data: Previous state of the task (for update events)
        
    Returns:
        bool: True if successful, False otherwise
    """
    event_payload = {
        "eventType": event_type,
        "taskId": task_id,
        "userId": user_id,
        "taskData": task_data
    }
    
    if previous_task_data is not None:
        event_payload["previousTaskData"] = previous_task_data
    
    # Select the appropriate topic based on event type
    if event_type == "updated":
        topic = "task-updates"
    elif event_type in ["created", "completed", "deleted"]:
        topic = "task-events"
    else:
        # Default to task-events for other event types
        topic = "task-events"
    
    return await dapr_publisher.publish_event(topic, event_payload)


async def publish_reminder_event(
    task_id: str,
    title: str,
    due_at: str,
    remind_at: str,
    user_id: str,
    notification_method: str = "email"
) -> bool:
    """
    Publish a reminder event to the reminders topic via Dapr
    
    Args:
        task_id: ID of the task
        title: Title of the task
        due_at: When the task is due
        remind_at: When to send the reminder
        user_id: ID of the user
        notification_method: Method to use for notification (email, push, both)
        
    Returns:
        bool: True if successful, False otherwise
    """
    event_payload = {
        "taskId": task_id,
        "title": title,
        "dueAt": due_at,
        "remindAt": remind_at,
        "userId": user_id,
        "notificationMethod": notification_method,
        "status": "scheduled"
    }
    
    return await dapr_publisher.publish_event("reminders", event_payload)


# Cleanup function to close the client when the app shuts down
async def shutdown_publisher():
    await dapr_publisher.close()