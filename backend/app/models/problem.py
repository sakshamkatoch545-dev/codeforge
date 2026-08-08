from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class DifficultyEnum(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class Problem(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(Enum(DifficultyEnum), nullable=False)
    time_limit = Column(Integer, default=1000) # in ms
    memory_limit = Column(Integer, default=256) # in MB
    
    # Extended fields
    tags = Column(JSON, default=list)
    companies = Column(JSON, default=list)
    constraints = Column(JSON, default=list)
    hints = Column(JSON, default=list)
    notes = Column(Text, nullable=True)
    examples = Column(JSON, default=list)
    starter_code = Column(JSON, default=dict)
    driver_code = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    test_cases = relationship("TestCase", back_populates="problem", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="problem")
