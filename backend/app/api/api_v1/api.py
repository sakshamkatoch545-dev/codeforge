from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, problems, submissions, run

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(problems.router, prefix="/problems", tags=["problems"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(run.router, prefix="/run", tags=["run"])
