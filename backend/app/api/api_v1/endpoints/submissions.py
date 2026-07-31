from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
import subprocess
import os
import tempfile
import time

router = APIRouter()

def judge_submission_task(submission_id: int):
    from app.db.session import SessionLocal
    from app.models.testcase import TestCase
    db = SessionLocal()
    try:
        submission = crud.submission.get(db=db, id=submission_id)
        if not submission:
            return
        
        submission.status = "RUNNING"
        db.commit()

        testcases = db.query(TestCase).filter(TestCase.problem_id == submission.problem_id).all()
        if not testcases:
            submission.status = "ACCEPTED"
            db.commit()
            return
            
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = ""
            cmd = []
            if submission.language == "python":
                file_path = os.path.join(temp_dir, "script.py")
                cmd = ["python", file_path]
                with open(file_path, "w") as f:
                    f.write(submission.code)
            elif submission.language == "javascript":
                file_path = os.path.join(temp_dir, "script.js")
                cmd = ["node", file_path]
                with open(file_path, "w") as f:
                    f.write(submission.code)
            elif submission.language == "c":
                file_path = os.path.join(temp_dir, "main.c")
                out_path = os.path.join(temp_dir, "a.exe")
                with open(file_path, "w") as f:
                    f.write(submission.code)
                compile_res = subprocess.run(["gcc", "-O2", "-o", out_path, file_path], capture_output=True, text=True)
                if compile_res.returncode != 0:
                    submission.status = "COMPILATION_ERROR"
                    submission.error_message = compile_res.stderr
                    db.commit()
                    return
                cmd = [out_path]
            elif submission.language == "cpp":
                file_path = os.path.join(temp_dir, "main.cpp")
                out_path = os.path.join(temp_dir, "a.exe")
                with open(file_path, "w") as f:
                    f.write(submission.code)
                compile_res = subprocess.run(["g++", "-O2", "-o", out_path, file_path], capture_output=True, text=True)
                if compile_res.returncode != 0:
                    submission.status = "COMPILATION_ERROR"
                    submission.error_message = compile_res.stderr
                    db.commit()
                    return
                cmd = [out_path]
            elif submission.language == "java":
                file_path = os.path.join(temp_dir, "Main.java")
                with open(file_path, "w") as f:
                    f.write(submission.code)
                compile_res = subprocess.run(["javac", file_path], capture_output=True, text=True)
                if compile_res.returncode != 0:
                    submission.status = "COMPILATION_ERROR"
                    submission.error_message = compile_res.stderr
                    db.commit()
                    return
                cmd = ["java", "-cp", temp_dir, "Main"]
            else:
                submission.status = "INTERNAL_ERROR"
                submission.error_message = "Language not supported for judging"
                db.commit()
                return

            start_time = time.time()
            all_passed = True
            judge_log = ""
            
            for i, tc in enumerate(testcases, 1):
                try:
                    result = subprocess.run(cmd, input=tc.input_data, capture_output=True, text=True, timeout=submission.problem.time_limit / 1000.0)
                    actual_output = result.stdout.strip()
                    expected_output = tc.expected_output.strip()
                    
                    if result.returncode != 0:
                        submission.status = "RUNTIME_ERROR"
                        judge_log += f"Test Case {i} Failed (Runtime Error)\n\n"
                        submission.error_message = judge_log + result.stderr
                        all_passed = False
                        break
                        
                    if actual_output != expected_output:
                        submission.status = "WRONG_ANSWER"
                        judge_log += f"Test Case {i} Failed\nInput:\n{tc.input_data}\nExpected:\n{expected_output}\nGot:\n{actual_output}"
                        submission.error_message = judge_log
                        all_passed = False
                        break
                        
                    # It passed this test case!
                    tc_type = "Hidden" if tc.is_hidden else "Visible"
                    judge_log += f"Test Case {i} ({tc_type}): Passed\n"
                    if not tc.is_hidden:
                        judge_log += f"Input:\n{tc.input_data}\nOutput:\n{actual_output}\n\n"
                    else:
                        judge_log += "\n"

                except subprocess.TimeoutExpired:
                    submission.status = "TIME_LIMIT_EXCEEDED"
                    judge_log += f"Test Case {i} Failed (Time Limit Exceeded)\nInput:\n{tc.input_data}"
                    submission.error_message = judge_log
                    all_passed = False
                    break
                except Exception as e:
                    submission.status = "INTERNAL_ERROR"
                    judge_log += f"Test Case {i} Failed (Internal Error)\n"
                    submission.error_message = judge_log + str(e)
                    all_passed = False
                    break
                    
            end_time = time.time()
            submission.execution_time = int((end_time - start_time) * 1000)
            
            if all_passed:
                submission.status = "ACCEPTED"
                submission.error_message = judge_log.strip()
                
            db.commit()
    except Exception as e:
        try:
            db.rollback()
            submission = crud.submission.get(db=db, id=submission_id)
            if submission:
                submission.status = "INTERNAL_ERROR"
                submission.error_message = f"System Error: {str(e)}"
                db.commit()
        except Exception:
            pass
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Submission])
def read_submissions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve submissions for the current user.
    """
    if crud.user.is_superuser(current_user):
        submissions = crud.submission.get_multi(db, skip=skip, limit=limit)
    else:
        submissions = crud.submission.get_multi_by_user(
            db=db, user_id=current_user.id, skip=skip, limit=limit
        )
    return submissions

@router.post("/", response_model=schemas.Submission)
def create_submission(
    *,
    db: Session = Depends(deps.get_db),
    submission_in: schemas.SubmissionCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Create new submission and trigger Judge execution.
    """
    problem = crud.problem.get(db=db, id=submission_in.problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Store submission as PENDING
    submission = models.Submission(
        problem_id=submission_in.problem_id,
        language=submission_in.language,
        code=submission_in.code,
        user_id=current_user.id
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    background_tasks.add_task(judge_submission_task, submission.id)
    
    return submission

@router.get("/{id}", response_model=schemas.Submission)
def read_submission(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get submission by ID.
    """
    submission = crud.submission.get(db=db, id=id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    if not crud.user.is_superuser(current_user) and (submission.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return submission

@router.delete("/{id}", response_model=schemas.Submission)
def delete_submission(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete submission by ID.
    """
    submission = crud.submission.get(db=db, id=id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    if not crud.user.is_superuser(current_user) and (submission.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    submission = crud.submission.remove(db=db, id=id)
    return submission
