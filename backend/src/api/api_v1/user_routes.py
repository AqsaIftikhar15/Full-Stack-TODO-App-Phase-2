from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session
import uuid
from typing import Dict, Any, List, Optional
from ...middleware.auth import get_current_user_id
from ...core.database import get_db
from ...models.message import Message, MessageCreate
from ...models.conversation import Conversation, ConversationCreate
from datetime import datetime


# Create a router that will handle user-specific routes according to constitution
# The routes will be mounted without a prefix, so they become /{user_id}/chat directly under /api/v1/
router = APIRouter()

@router.post("/{user_id}/chat")
async def chat_endpoint(
    user_id: str,
    request: Request,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Process a natural language message and return AI-generated response with potential task operations.
    According to constitution: POST /api/{user_id}/chat

    Args:
        user_id: The ID of the authenticated user
        request: The request object containing the message
        current_user_id: The ID of the authenticated user from the token
        db: Database session

    Returns:
        Response containing AI-generated response and any tool calls
    """
    # Validate user_id format first
    try:
        uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    # Ensure the authenticated user matches the path parameter for security
    # This prevents users from accessing other users' chats
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You can only access your own chat"
        )

    # Additional validation to ensure user exists in the database
    # This double-checks that the user is valid before proceeding
    from ...models.user import User
    from sqlmodel import select
    user_uuid = uuid.UUID(user_id)
    user_exists = db.exec(select(User).where(User.id == user_uuid)).first()
    if not user_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Parse the JSON body
    try:
        body = await request.json()
        message_text = body.get("message", "").strip()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request body"
        )

    if not message_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message is required"
        )

    # Validate message length (max 500 characters)
    from ...utils.message_validator import validate_message_length
    if not validate_message_length(message_text):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message exceeds 500 character limit"
        )

    # Check rate limit for concurrent AI requests (max 3 per user)
    from ...utils.rate_limiter import check_ai_request_limit, get_remaining_ai_requests
    if not check_ai_request_limit(current_user_id):
        remaining = get_remaining_ai_requests(current_user_id)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Max 3 concurrent AI requests allowed. "
                   f"You have {remaining} requests remaining."
        )

    # Create or get conversation for this user
    conversation = get_or_create_conversation(user_id, db)

    # Retrieve conversation history (last 50 messages as per spec)
    conversation_history = get_recent_messages(conversation.id, db, limit=50)

    # Store user message in database
    user_message = create_message(conversation.id, user_id, "user", message_text, db)

    # Import the orchestrator
    from ...agents.orchestrator import orchestrator

    # Process the message through the agent orchestrator
    result = orchestrator.process_user_message(user_id, message_text, conversation_history)
    response = result["response"]
    tool_calls = result["tool_calls"]

    # Store AI response in database
    ai_message = create_message(conversation.id, user_id, "assistant", response, db, tool_calls)

    return {
        "response": response,
        "tool_calls": tool_calls,
        "message_id": str(ai_message.id),
        "conversation_id": str(conversation.id)
    }


def get_or_create_conversation(user_id: str, db: Session) -> Conversation:
    """Get an existing conversation or create a new one for the user."""
    # First verify that the user exists in the database
    from ...models.user import User
    from sqlmodel import select

    user_uuid = uuid.UUID(user_id)
    user_exists = db.exec(select(User).where(User.id == user_uuid)).first()
    if not user_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist in the database. Please ensure you are properly registered."
        )

    # Try to get the most recent conversation for this user
    statement = select(Conversation).where(Conversation.user_id == user_uuid).order_by(Conversation.created_at.desc()).limit(1)
    existing_conversation = db.exec(statement).first()

    if existing_conversation:
        # Update the conversation's updated_at timestamp
        existing_conversation.updated_at = datetime.utcnow()
        db.add(existing_conversation)
        db.commit()
        db.refresh(existing_conversation)
        return existing_conversation
    else:
        # Create a new conversation
        conversation_data = ConversationCreate(user_id=user_uuid)
        conversation = Conversation(
            user_id=conversation_data.user_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation


def get_recent_messages(conversation_id: uuid.UUID, db: Session, limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieve recent messages from a conversation."""
    from sqlmodel import select
    statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at.desc()).limit(limit)
    messages = db.exec(statement).all()

    # Return messages in chronological order (oldest first)
    return [
        {
            "id": str(msg.id),
            "role": msg.role,
            "content": msg.content,
            "timestamp": msg.created_at.isoformat(),
            "tool_calls": msg.tool_calls
        }
        for msg in reversed(messages)  # Reverse to get chronological order
    ]


def create_message(conversation_id: uuid.UUID, user_id: str, role: str, content: str, db: Session, tool_calls: Optional[List[Dict[str, Any]]] = None) -> Message:
    """Create and save a message to the database."""
    # Handle the case where tool_calls is a list but model expects dict
    # We'll store the list as a value in a dictionary under a "calls" key
    processed_tool_calls = {"calls": tool_calls} if tool_calls else {}

    message_data = MessageCreate(
        conversation_id=conversation_id,
        user_id=uuid.UUID(user_id),
        role=role,
        content=content,
        tool_calls=processed_tool_calls
    )

    message = Message(
        conversation_id=message_data.conversation_id,
        user_id=message_data.user_id,
        role=message_data.role,
        content=message_data.content,
        tool_calls=message_data.tool_calls
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    # Truncate conversation history to last 50 messages if needed
    from ...utils.conversation_manager import ensure_conversation_size_limit
    ensure_conversation_size_limit(db, str(conversation_id), max_messages=50)

    return message