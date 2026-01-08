from fastapi import APIRouter
from .tasks import router as tasks_router

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {"status": "healthy"}

# Include task routes
api_router.include_router(tasks_router, prefix="/tasks", tags=["tasks"])