from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime


class ConversationBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")


class Conversation(ConversationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ConversationCreate(ConversationBase):
    pass


class ConversationRead(ConversationBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime