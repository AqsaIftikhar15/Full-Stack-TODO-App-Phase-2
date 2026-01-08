from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_get_tasks_unauthorized():
    """Test that accessing tasks endpoint returns 401 without authentication"""
    response = client.get("/api/v1/tasks/")
    # This should return 401 because authentication is required
    assert response.status_code == 401

def test_create_task_unauthorized():
    """Test that creating a task returns 401 without authentication"""
    task_data = {
        "title": "Test Task",
        "description": "Test Description"
    }
    response = client.post("/api/v1/tasks/", json=task_data)
    # This should return 401 because authentication is required
    assert response.status_code == 401

def test_get_single_task_unauthorized():
    """Test that accessing a single task returns 401 without authentication"""
    response = client.get("/api/v1/tasks/123e4567-e89b-12d3-a456-426614174000")
    # This should return 401 because authentication is required
    assert response.status_code == 401