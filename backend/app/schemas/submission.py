from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.submission import SubmissionStatus, LanguageEnum

class SubmissionBase(BaseModel):
    problem_id: int
    language: LanguageEnum
    code: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    status: Optional[SubmissionStatus] = None
    execution_time: Optional[float] = None
    memory_usage: Optional[float] = None
    error_message: Optional[str] = None

class SubmissionInDBBase(SubmissionBase):
    id: int
    user_id: int
    status: SubmissionStatus
    execution_time: Optional[float]
    memory_usage: Optional[float]
    error_message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class Submission(SubmissionInDBBase):
    pass
