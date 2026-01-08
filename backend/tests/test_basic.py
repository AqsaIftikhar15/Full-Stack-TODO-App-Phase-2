from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_endpoint():
    """Test the health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_api_health_endpoint():
    """Test the API health endpoint"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}