#!/usr/bin/env python
"""
Database initialization script for the Todo App backend.
This script creates all SQLModel tables in the configured database.
"""

from sqlmodel import SQLModel
from src.core.database import engine
from src.models.user import User
from src.models.task import Task
from src.models.conversation import Conversation
from src.models.message import Message

def create_tables():
    """Create all tables in the database."""
    print("Creating database tables...")

    # Create all tables defined in SQLModel models
    SQLModel.metadata.create_all(bind=engine)

    print("Database tables created successfully!")
    print("Tables created:")
    print("- users")
    print("- tasks")
    print("- conversations")
    print("- messages")

if __name__ == "__main__":
    create_tables()