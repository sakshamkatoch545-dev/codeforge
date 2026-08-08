import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.models.problem import Problem
from app.models.user import User

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_judge():
    db = SessionLocal()
    try:
        # Create a dummy user
        user = db.execute(text("INSERT INTO \"user\" (email, hashed_password, is_active, is_superuser, username) VALUES ('test@test.com', 'hash', true, false, 'testuser') RETURNING id")).first()
        user_id = user[0]
        
        # Get problem ID for two-sum
        prob = db.execute(text("SELECT id FROM problem WHERE slug = 'two-sum'")).first()
        if not prob:
            print("Two sum problem not found")
            return
        prob_id = prob[0]
        
        # Insert a wrong submission
        wrong_code = "print('[0,2]')"
        sub = db.execute(text("INSERT INTO submission (user_id, problem_id, language, code, status) VALUES (:uid, :pid, 'PYTHON', :code, 'PENDING') RETURNING id"),
                         {"uid": user_id, "pid": prob_id, "code": wrong_code}).first()
        sub_id = sub[0]
        db.commit()
        
        # Run judge logic
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'judge'))
        from judge_worker import judge_submission
        
        print(f"Running judge on submission {sub_id} (Expected WRONG_ANSWER)")
        judge_submission(db, sub_id)
        
        # Check result
        result = db.execute(text("SELECT status, error_message FROM submission WHERE id = :id"), {"id": sub_id}).first()
        print(f"Status: {result[0]}, Error Message: {result[1]}")
        
    finally:
        db.close()

if __name__ == '__main__':
    test_judge()
