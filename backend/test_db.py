import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

# Set the database URL
os.environ['DATABASE_URL'] = 'sqlite:///./todo_local.db'

from sqlmodel import SQLModel, create_engine, Session
from src.models.user import User
from src.core.config import settings

# Create engine with SQLite
engine = create_engine(settings.DATABASE_URL)

# Create tables
print("Creating database tables...")
SQLModel.metadata.create_all(bind=engine)
print("Database tables created successfully!")

# Test inserting a user
with Session(engine) as session:
    from sqlmodel import select
    
    # Check if admin user already exists
    existing_user = session.exec(select(User).where(User.email == "admin@example.com")).first()
    
    if not existing_user:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        hashed_password = pwd_context.hash("pass")
        admin_user = User(
            email="admin@example.com",
            username="admin",
            hashed_password=hashed_password,
            is_active=True
        )
        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)
        print(f"Admin user created with ID: {admin_user.id}")
    else:
        print(f"Admin user already exists with ID: {existing_user.id}")