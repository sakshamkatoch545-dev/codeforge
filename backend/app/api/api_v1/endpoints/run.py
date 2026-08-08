import os
from typing import Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app import models
from app.judge.docker_runner import setup_sandbox_volume, compile_in_sandbox, execute_in_sandbox, cleanup_sandbox_volume
from app.judge.languages import get_language
from app.judge.limits import DEFAULT_LIMITS

router = APIRouter()

class RunCodeRequest(BaseModel):
    code: str
    language: str
    input_data: str = ""
    problem_id: Optional[int] = None  # If provided, driver_code is fetched from DB

class RunCodeResponse(BaseModel):
    output: str
    error: str
    status: str

@router.post("/", response_model=RunCodeResponse)
def run_code(
    *,
    db: Session = Depends(deps.get_db),
    request: RunCodeRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Execute code and return the standard output and error.
    If problem_id is provided, the user's code is wrapped with the problem's driver_code
    (same mechanism as submission) so only the function body needs to be written.
    """
    if request.language not in ["python", "javascript", "c", "cpp", "java"]:
        raise HTTPException(status_code=400, detail="Unsupported language")

    lang = get_language(request.language)
    if lang is None:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {request.language}")

    # Build the final code to run
    final_code = request.code

    # If problem_id is given, wrap user code with the problem's driver_code
    if request.problem_id is not None:
        from app.models.problem import Problem
        problem = db.query(Problem).filter(Problem.id == request.problem_id).first()
        if problem and problem.driver_code:
            driver = problem.driver_code
            if isinstance(driver, dict) and request.language in driver:
                driver_template = driver[request.language]
                if "{USER_CODE}" in driver_template:
                    final_code = driver_template.replace("{USER_CODE}", request.code)

    print("FINAL_CODE_RUN IS:\n", final_code)
    try:
        volume_name = setup_sandbox_volume(final_code, lang)
        compile_result = compile_in_sandbox(volume_name, lang, DEFAULT_LIMITS)
        
        if compile_result and (compile_result.exit_code != 0 or compile_result.timed_out):
            if compile_result.timed_out:
                return RunCodeResponse(output="", error="Compilation timed out.", status="TIMEOUT")
            else:
                return RunCodeResponse(output=compile_result.stdout, error=compile_result.stderr, status="ERROR")
                
        run = execute_in_sandbox(volume_name, request.input_data, lang, DEFAULT_LIMITS)
    finally:
        cleanup_sandbox_volume(volume_name)

    if run.timed_out:
        return RunCodeResponse(output="", error="Execution timed out.", status="TIMEOUT")
    elif run.exit_code != 0:
        return RunCodeResponse(output=run.stdout, error=run.stderr, status="ERROR")
    else:
        return RunCodeResponse(output=run.stdout, error=run.stderr, status="SUCCESS")
