"""Conversation management utilities for the AI-powered Todo Chatbot"""

from sqlmodel import Session, select
from ..models.message import Message
from datetime import datetime
from typing import List


def truncate_conversation_history(db: Session, conversation_id: str, max_messages: int = 50) -> int:
    """
    Truncate conversation history to keep only the most recent messages.

    Args:
        db: Database session
        conversation_id: ID of the conversation to truncate
        max_messages: Maximum number of messages to keep (default 50)

    Returns:
        Number of messages deleted
    """
    # Get all messages in the conversation ordered by creation time
    statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
    all_messages = db.exec(statement).all()

    if len(all_messages) <= max_messages:
        # No need to truncate
        return 0

    # Calculate how many messages to delete
    messages_to_delete = len(all_messages) - max_messages

    # Get the messages to delete (the oldest ones)
    messages_for_deletion = all_messages[:messages_to_delete]

    # Delete the oldest messages
    for message in messages_for_deletion:
        db.delete(message)

    db.commit()

    return len(messages_for_deletion)


def ensure_conversation_size_limit(db: Session, conversation_id: str, max_messages: int = 50) -> bool:
    """
    Ensure that the conversation doesn't exceed the maximum message count.

    Args:
        db: Database session
        conversation_id: ID of the conversation to check
        max_messages: Maximum number of messages allowed (default 50)

    Returns:
        True if truncation was performed, False otherwise
    """
    # Get the count of messages in the conversation
    from sqlalchemy import func
    count_statement = select(func.count(Message.id)).where(Message.conversation_id == conversation_id)
    message_count = db.exec(count_statement).one()

    if message_count > max_messages:
        truncate_conversation_history(db, conversation_id, max_messages)
        return True

    return False