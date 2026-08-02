import time
import os
import docker
import json
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
# We will poll the database for PENDING submissions for simplicity. 
# In a real production environment, we should use a message queue like Redis/RabbitMQ.

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
docker_client = None

def get_docker_client():
    global docker_client
    if docker_client is None:
        try:
            import docker
            docker_client = docker.from_env()
        except Exception as e:
            logger.warning(f"Could not connect to Docker daemon: {e}")
    return docker_client

def judge_submission(submission_id: int):
    # This is a placeholder for the actual judge logic.
    # It would:
    # 1. Fetch submission and test cases
    # 2. Spin up the appropriate Docker container
    # 3. Inject code and test case inputs
    # 4. Compare outputs
    # 5. Update submission status in DB
    logger.info(f"Judging submission {submission_id}")
    time.sleep(2)
    logger.info(f"Finished judging submission {submission_id}")

def worker():
    logger.info("Judge worker started. Waiting for submissions...")
    while True:
        try:
            with SessionLocal() as db:
                # Direct SQL execution for simplicity in this worker script
                result = db.execute(text("SELECT id FROM submission WHERE status = 'PENDING' LIMIT 1")).first()
                if result:
                    submission_id = result[0]
                    # Update status to RUNNING
                    db.execute(text("UPDATE submission SET status = 'RUNNING' WHERE id = :id"), {"id": submission_id})
                    db.commit()
                    
                    try:
                        judge_submission(submission_id)
                        # Mark as ACCEPTED as mock for now
                        db.execute(text("UPDATE submission SET status = 'ACCEPTED' WHERE id = :id"), {"id": submission_id})
                    except Exception as e:
                        logger.error(f"Error judging {submission_id}: {e}")
                        db.execute(text("UPDATE submission SET status = 'INTERNAL_ERROR' WHERE id = :id"), {"id": submission_id})
                    db.commit()
                else:
                    time.sleep(1)
        except Exception as e:
            logger.error(f"Database error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    worker()
