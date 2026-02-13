#!/usr/bin/env python
"""
Database reset script for the Todo App backend.
This script drops all existing tables and recreates them.
"""

from sqlmodel import SQLModel
from src.core.database import engine
from src.models.user import User
from src.models.task import Task
from src.models.conversation import Conversation
from src.models.message import Message
from src.models.activity_log import ActivityLog

def reset_database():
    """Drop all tables and recreate them."""
    print("Dropping and recreating database tables...")

    # Drop all existing tables
    SQLModel.metadata.drop_all(bind=engine)
    print("Existing tables dropped.")

    # Create all tables again
    SQLModel.metadata.create_all(bind=engine)
    print("New tables created successfully!")

    print("Database reset completed!")
    print("Tables recreated:")
    print("- users")
    print("- tasks")
    print("- conversations")
    print("- messages")
    print("- activity_logs")


if __name__ == "__main__":
    reset_database()