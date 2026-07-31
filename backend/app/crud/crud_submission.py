from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate, SubmissionUpdate

class CRUDSubmission(CRUDBase[Submission, SubmissionCreate, SubmissionUpdate]):
    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Submission]:
        return (
            db.query(Submission)
            .filter(Submission.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_multi_by_problem(
        self, db: Session, *, problem_id: int, skip: int = 0, limit: int = 100
    ) -> List[Submission]:
        return (
            db.query(Submission)
            .filter(Submission.problem_id == problem_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

submission = CRUDSubmission(Submission)
