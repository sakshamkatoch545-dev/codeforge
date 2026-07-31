from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.problem import DifficultyEnum

class ProblemBase(BaseModel):
    title: str
    slug: str
    description: str
    difficulty: DifficultyEnum
    time_limit: Optional[int] = 1000
    memory_limit: Optional[int] = 256

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(ProblemBase):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[DifficultyEnum] = None

class ProblemInDBBase(ProblemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Problem(ProblemInDBBase):
    pass

class TestCaseOut(BaseModel):
    id: int
    problem_id: int
    input_data: str
    expected_output: str

    class Config:
        from_attributes = True
