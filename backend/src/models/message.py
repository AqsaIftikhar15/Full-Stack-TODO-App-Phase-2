from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import JSON


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class MessageBase(SQLModel):
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")
    role: MessageRole
    content: str = Field(max_length=500)  # Max 500 characters as per spec
    tool_calls: Optional[dict] = Field(default=None, sa_type=JSON)  # JSON array of MCP tool calls


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MessageCreate(MessageBase):
    content: str = Field(min_length=1, max_length=500)


class MessageRead(MessageBase):
    id: uuid.UUID
    created_at: datetime