from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import crud, models, schemas
from app.api import deps
from app.models.submission import Submission, SubmissionStatus
from app.models.problem import Problem, DifficultyEnum

router = APIRouter()

@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user

@router.get("/me", response_model=schemas.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    from app.models.submission import Submission
    from sqlalchemy import Date, cast, func
    
    # Calculate coding days
    coding_days = db.query(func.count(func.distinct(cast(Submission.created_at, Date)))).filter(
        Submission.user_id == current_user.id
    ).scalar() or 0

    # Calculate total submissions (practice count)
    practice_count = db.query(Submission).filter(Submission.user_id == current_user.id).count()

    # Create schema representation
    user_schema = schemas.User.model_validate(current_user)
    user_schema.coding_days = coding_days
    user_schema.practice_count = practice_count
    return user_schema

@router.get("/me/solved", response_model=List[int])
def read_user_solved(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get list of solved problem IDs for the current user.
    """
    accepted_subs = db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.status == SubmissionStatus.ACCEPTED
    ).all()
    solved_problem_ids = list(set([s.problem_id for s in accepted_subs]))
    return solved_problem_ids

@router.get("/leaderboard")
def read_leaderboard(
    db: Session = Depends(deps.get_db),
    limit: int = 50,
) -> Any:
    """
    Get user leaderboard rankings based on accepted problem submissions and points.
    """
    users = db.query(models.User).filter(
        models.User.is_active == True,
        models.User.username != "demo-user",
        ~models.User.username.ilike("%test%")
    ).all()
    leaderboard = []

    for u in users:
        accepted_subs = db.query(Submission).filter(
            Submission.user_id == u.id,
            Submission.status == SubmissionStatus.ACCEPTED
        ).all()
        
        solved_problem_ids = list(set([s.problem_id for s in accepted_subs]))
        solved_count = len(solved_problem_ids)
        
        points = 0
        if solved_problem_ids:
            problems = db.query(Problem).filter(Problem.id.in_(solved_problem_ids)).all()
            for p in problems:
                if p.difficulty == DifficultyEnum.EASY:
                    points += 10
                elif p.difficulty == DifficultyEnum.MEDIUM:
                    points += 20
                elif p.difficulty == DifficultyEnum.HARD:
                    points += 30

        # Total submissions (practice count)
        practice_count = db.query(Submission).filter(Submission.user_id == u.id).count()

        # Coding days (calendar days with submissions)
        from sqlalchemy import Date, cast, func
        coding_days = db.query(func.count(func.distinct(cast(Submission.created_at, Date)))).filter(
            Submission.user_id == u.id
        ).scalar() or 0

        leaderboard.append({
            "id": u.id,
            "username": u.username,
            "solved_count": solved_count,
            "points": points,
            "total_submissions": len(accepted_subs),
            "login_days": u.login_days,
            "coding_days": coding_days,
            "practice_count": practice_count
        })

    leaderboard.sort(key=lambda x: (x["points"], x["solved_count"]), reverse=True)
    
    for idx, item in enumerate(leaderboard, start=1):
        item["rank"] = idx

    return leaderboard[:limit]
