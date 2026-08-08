"""Judge worker: polls Redis queue, judges submissions, updates DB.

Run this as a standalone process:
    python -m app.judge.worker

Or it is started automatically by the FastAPI lifespan hook.
"""
import logging
import os
import signal
import sys
import threading
import time

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

from app.judge.executor import judge
from app.judge.limits import Limits
from app.judge.queue import pop_submission
from app.judge.verdict import Verdict

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

_running = True


def _set_status(db: Session, sub_id: int, status: str, **kwargs) -> None:
    updates = {"status": status, **kwargs}
    set_clause = ", ".join(f"{k} = :{k}" for k in updates)
    db.execute(
        text(f"UPDATE submission SET {set_clause} WHERE id = :id"),
        {**updates, "id": sub_id},
    )
    db.commit()


def process_submission(submission_id: int) -> None:
    db = SessionLocal()
    try:
        # Mark as RUNNING
        _set_status(db, submission_id, "RUNNING")

        # Fetch submission
        row = db.execute(
            text("SELECT code, language, problem_id FROM submission WHERE id = :id"),
            {"id": submission_id},
        ).fetchone()

        if not row:
            logger.error("Submission %d not found", submission_id)
            return

        code, language, problem_id = row.code, row.language, row.problem_id

        # Fetch test cases (hidden + public)
        tcs = db.execute(
            text("SELECT id, input_data, expected_output, is_hidden FROM testcase WHERE problem_id = :pid ORDER BY id"),
            {"pid": problem_id},
        ).fetchall()

        # Fetch problem limits and driver_code
        problem_row = db.execute(
            text("SELECT time_limit, memory_limit, driver_code FROM problem WHERE id = :pid"),
            {"pid": problem_id},
        ).fetchone()

        limits = Limits(
            time_limit_ms=problem_row.time_limit if problem_row and problem_row.time_limit else 2000,
            memory_limit_mb=problem_row.memory_limit if problem_row and problem_row.memory_limit else 256,
        )
        
        driver_code = problem_row.driver_code if problem_row and problem_row.driver_code else {}

        test_cases = [
            {"id": tc.id, "input_data": tc.input_data, "expected_output": tc.expected_output, "is_hidden": tc.is_hidden}
            for tc in tcs
        ]

        # ── Run the judge ──
        result = judge(code, language, test_cases, limits, driver_code)

        # Map verdict to SubmissionStatus
        status_map = {
            Verdict.ACCEPTED: "ACCEPTED",
            Verdict.WRONG_ANSWER: "WRONG_ANSWER",
            Verdict.RUNTIME_ERROR: "RUNTIME_ERROR",
            Verdict.COMPILATION_ERROR: "COMPILATION_ERROR",
            Verdict.TIME_LIMIT_EXCEEDED: "TIME_LIMIT_EXCEEDED",
            Verdict.MEMORY_LIMIT_EXCEEDED: "MEMORY_LIMIT_EXCEEDED",
            Verdict.OUTPUT_LIMIT_EXCEEDED: "OUTPUT_LIMIT_EXCEEDED",
            Verdict.INTERNAL_ERROR: "INTERNAL_ERROR",
        }
        status = status_map.get(result.verdict, "INTERNAL_ERROR")

        import json
        structured_results = []
        for tc_res in result.test_results:
            tc_meta = next((tc for tc in test_cases if tc["id"] == tc_res.test_case_id), None)
            
            structured_results.append({
                "test_case_id": tc_res.test_case_id,
                "verdict": tc_res.verdict.name if hasattr(tc_res.verdict, "name") else str(tc_res.verdict),
                "actual_output": tc_res.actual_output,
                "expected_output": tc_res.expected_output,
                "input_data": tc_meta["input_data"] if tc_meta else "",
                "wall_time_ms": tc_res.wall_time_ms,
                "stderr": tc_res.stderr
            })

        _set_status(
            db, submission_id, status,
            error_message=json.dumps(structured_results),
            execution_time=result.execution_time_ms,
            passed_tests=result.passed,
            total_tests=result.total,
        )
        logger.info(
            "Submission %d -> %s  (%d/%d tests, %.0fms)",
            submission_id, status, result.passed, result.total, result.execution_time_ms,
        )

    except Exception as e:
        logger.exception("Error processing submission %d: %s", submission_id, e)
        try:
            _set_status(db, submission_id, "INTERNAL_ERROR", error_message=str(e))
        except Exception:
            pass
    finally:
        db.close()


def run_worker(poll_timeout: int = 5) -> None:
    """Main worker loop — blocks until _running is False."""
    logger.info("Judge worker started (pid=%d)", os.getpid())
    while _running:
        try:
            sub_id = pop_submission(timeout=poll_timeout)
            if sub_id is not None:
                process_submission(sub_id)
        except Exception as e:
            logger.exception("Worker loop error: %s", e)
            time.sleep(1)
    logger.info("Judge worker stopped")


def start_background_worker() -> threading.Thread:
    """Start the worker in a daemon thread (used by FastAPI lifespan)."""
    t = threading.Thread(target=run_worker, daemon=True, name="judge-worker")
    t.start()
    return t


def stop_worker() -> None:
    global _running
    _running = False


# ── Standalone entry point ──────────────────────────────────────────────────
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    def _handle_signal(sig, frame):
        logger.info("Received signal %d, shutting down...", sig)
        stop_worker()
        sys.exit(0)

    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)
    run_worker()
