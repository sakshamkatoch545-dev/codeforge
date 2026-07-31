from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemUpdate

class CRUDProblem(CRUDBase[Problem, ProblemCreate, ProblemUpdate]):
    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Problem]:
        return db.query(Problem).filter(Problem.slug == slug).first()

problem = CRUDProblem(Problem)
