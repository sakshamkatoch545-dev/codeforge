from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Problem])
def read_problems(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve problems.
    """
    problems = crud.problem.get_multi(db, skip=skip, limit=limit)
    return problems

@router.post("/", response_model=schemas.Problem)
def create_problem(
    *,
    db: Session = Depends(deps.get_db),
    problem_in: schemas.ProblemCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new problem.
    """
    problem = crud.problem.get_by_slug(db, slug=problem_in.slug)
    if problem:
        raise HTTPException(
            status_code=400,
            detail="The problem with this slug already exists.",
        )
    problem = crud.problem.create(db=db, obj_in=problem_in)
    return problem

@router.get("/by-slug/{slug}", response_model=schemas.Problem)
def read_problem_by_slug(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get problem by slug.
    """
    problem = crud.problem.get_by_slug(db=db, slug=slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.get("/{id}", response_model=schemas.Problem)
def read_problem(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get problem by ID.
    """
    problem = crud.problem.get(db=db, id=id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.get("/{id}/testcases", response_model=List[schemas.TestCaseOut])
def read_problem_testcases(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get visible test cases for a problem.
    """
    from app.models.testcase import TestCase
    problem = crud.problem.get(db=db, id=id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    testcases = db.query(TestCase).filter(TestCase.problem_id == id, TestCase.is_hidden == False).all()
    return testcases
