from sqlalchemy import Column, Integer, String, Text, Enum, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class SubmissionStatus(str, enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    ACCEPTED = "ACCEPTED"
    WRONG_ANSWER = "WRONG_ANSWER"
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED"
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    COMPILATION_ERROR = "COMPILATION_ERROR"
    INTERNAL_ERROR = "INTERNAL_ERROR"

class LanguageEnum(str, enum.Enum):
    PYTHON = "python"
    CPP = "cpp"
    JAVA = "java"
    JAVASCRIPT = "javascript"
    C = "c"

class Submission(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problem.id"), nullable=False)
    language = Column(Enum(LanguageEnum), nullable=False)
    code = Column(Text, nullable=False)
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING)
    execution_time = Column(Float, nullable=True) # in ms
    memory_usage = Column(Float, nullable=True) # in MB
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")
