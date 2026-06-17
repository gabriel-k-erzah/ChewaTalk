from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# 1. Create the SQLAlchemy Engine
# Note: Postgres doesn't strictly need 'check_same_thread' like SQLite,
# but we configure standard pool behaviors here for production readiness.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Automatically checks if connection is alive before routing queries
    pool_size=10,        # Keeps up to 10 persistent connections open
    max_overflow=20      # Allows spiking up to an extra 20 connections under heavy load
)

# 2. Create a thread-safe Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Create the Declarative Base for models
Base = declarative_base()

# 4. Dependency Injection Helper
def get_db() -> Generator:
    """
    FastAPI dependency that provides a transactional database session context.
    Ensures the connection is always safely closed after a request finishes,
    even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()