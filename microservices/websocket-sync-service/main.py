import asyncio
import json
import os
from typing import Dict, List
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

from dapr.ext.fastapi import DaprApp
from dapr.clients import DaprClient


# Store active WebSocket connections
connections: Dict[str, List[WebSocket]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting WebSocket Sync Service...")
    yield
    # Shutdown
    print("Shutting down WebSocket Sync Service...")


app = FastAPI(
    title="WebSocket Sync Service",
    description="Service to broadcast task updates to connected clients via WebSocket",
    lifespan=lifespan
)

# Wrap the app with Dapr extension
dapr_app = DaprApp(app)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}  # userId -> [WebSocket connections]

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)

    async def broadcast_to_user(self, message: str, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except WebSocketDisconnect:
                    # Remove disconnected connections
                    self.active_connections[user_id].remove(connection)


manager = ConnectionManager()


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Just keep the connection alive, we'll send messages from the subscriber
            data = await websocket.receive_text()
            # Optionally handle messages from client if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)


@dapr_app.subscribe(pubsub_name='kafka-pubsub', topic='task-updates')
async def handle_task_updates(event_data: dict) -> None:
    """
    Handle task update events from Kafka via Dapr pubsub
    """
    print(f"Received task update event: {event_data}")
    
    # Extract user ID from the event
    user_id = event_data.get("userId", "")
    
    if user_id:
        # Broadcast the update to all connected clients for this user
        message = json.dumps({
            "type": "task_update",
            "data": event_data
        })
        await manager.broadcast_to_user(message, user_id)
    else:
        print("No user ID found in event, skipping broadcast")


@dapr_app.subscribe(pubsub_name='kafka-pubsub', topic='task-events')
async def handle_task_events(event_data: dict) -> None:
    """
    Handle task events (created, completed, deleted) from Kafka via Dapr pubsub
    """
    print(f"Received task event: {event_data}")
    
    # Extract user ID from the event
    user_id = event_data.get("userId", "")
    
    if user_id:
        # Broadcast the event to all connected clients for this user
        message = json.dumps({
            "type": "task_event",
            "data": event_data
        })
        await manager.broadcast_to_user(message, user_id)
    else:
        print("No user ID found in event, skipping broadcast")


@app.get("/")
async def read_root():
    return {"status": "WebSocket Sync Service is running"}

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
            "websocket_connections": len(manager.active_connections)
        }
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)