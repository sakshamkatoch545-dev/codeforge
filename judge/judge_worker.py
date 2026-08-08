import time
import os
import subprocess
import tempfile
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def execute_python_code(code: str, input_data: str) -> tuple[str, str]:
    """Runs python code locally with the given input_data on stdin."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        file_path = f.name
        
    try:
        # Run code with a timeout of 2 seconds
        result = subprocess.run(
            ['python', file_path],
            input=input_data,
            text=True,
            capture_output=True,
            timeout=2.0
        )
        return result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return "", "Timeout"
    finally:
        os.remove(file_path)

def judge_submission(db, submission_id: int):
    logger.info(f"Judging submission {submission_id}")
    
    # Fetch submission
    sub = db.execute(text("SELECT id, problem_id, language, code FROM submission WHERE id = :id"), {"id": submission_id}).fetchone()
    if not sub:
        logger.error(f"Submission {submission_id} not found.")
        return
        
    problem_id = sub[1]
    language = sub[2]
    code = sub[3]
    
    if language.lower() != 'python':
        logger.error(f"Language {language} is not supported in this basic local judge.")
        db.execute(text("UPDATE submission SET status = 'INTERNAL_ERROR', error_message = 'Language not supported' WHERE id = :id"), {"id": submission_id})
        db.commit()
        return

    # Fetch test cases
    test_cases = db.execute(text("SELECT id, input_data, expected_output FROM testcase WHERE problem_id = :pid"), {"pid": problem_id}).fetchall()
    
    if not test_cases:
        logger.warning(f"No test cases found for problem {problem_id}")
        db.execute(text("UPDATE submission SET status = 'ACCEPTED' WHERE id = :id"), {"id": submission_id})
        db.commit()
        return
        
    for tc in test_cases:
        tc_id = tc[0]
        input_data = tc[1]
        expected_output = tc[2]
        
        stdout, stderr = execute_python_code(code, input_data)
        
        if stderr and stderr != "Timeout":
            error_msg = f"Runtime Error on testcase {tc_id}:\n{stderr}"
            db.execute(text("UPDATE submission SET status = 'RUNTIME_ERROR', error_message = :err WHERE id = :id"), 
                       {"err": error_msg, "id": submission_id})
            db.commit()
            return
            
        if stderr == "Timeout":
            error_msg = f"Time Limit Exceeded on testcase {tc_id}"
            db.execute(text("UPDATE submission SET status = 'TIME_LIMIT_EXCEEDED', error_message = :err WHERE id = :id"), 
                       {"err": error_msg, "id": submission_id})
            db.commit()
            return
            
        actual_output = stdout.strip()
        expected = expected_output.strip()
        
        if actual_output != expected:
            error_msg = f"Failed on testcase {tc_id}.\nInput:\n{input_data}\nExpected Output:\n{expected}\nYour Output:\n{actual_output}\nReason: Output mismatch."
            db.execute(text("UPDATE submission SET status = 'WRONG_ANSWER', error_message = :err WHERE id = :id"), 
                       {"err": error_msg, "id": submission_id})
            db.commit()
            return
            
    # If all test cases pass
    db.execute(text("UPDATE submission SET status = 'ACCEPTED', error_message = NULL WHERE id = :id"), {"id": submission_id})
    db.commit()
    logger.info(f"Submission {submission_id} ACCEPTED")


def worker():
    logger.info("Judge worker started. Waiting for submissions...")
    while True:
        try:
            with SessionLocal() as db:
                result = db.execute(text("SELECT id FROM submission WHERE status = 'PENDING' LIMIT 1")).first()
                if result:
                    submission_id = result[0]
                    # Update status to RUNNING
                    db.execute(text("UPDATE submission SET status = 'RUNNING' WHERE id = :id"), {"id": submission_id})
                    db.commit()
                    
                    try:
                        judge_submission(db, submission_id)
                    except Exception as e:
                        logger.error(f"Error judging {submission_id}: {e}")
                        db.execute(text("UPDATE submission SET status = 'INTERNAL_ERROR', error_message = :err WHERE id = :id"), 
                                   {"err": str(e), "id": submission_id})
                        db.commit()
                else:
                    time.sleep(1)
        except Exception as e:
            logger.error(f"Database error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    worker()
