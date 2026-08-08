import os
import sys
import copy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.models.problem import Problem

try:
    from scripts.seed_db import PROBLEMS_DATA
except ImportError:
    sys.path.append('.')
    from scripts.seed_db import PROBLEMS_DATA

def update_database():
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/codeforge")
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        problems = db.query(Problem).all()
        for p in problems:
            # Find the new driver code from PROBLEMS_DATA
            matching_data = next((item for item in PROBLEMS_DATA if item["slug"] == p.slug), None)
            if matching_data and "driver_code" in matching_data:
                dc_dict = copy.deepcopy(p.driver_code) if isinstance(p.driver_code, dict) else {}
                dc_dict["python"] = matching_data["driver_code"].get("python", "")
                p.driver_code = dc_dict
                    
        db.commit()
        print(f"Updated driver codes for {len(problems)} problems in the database.")
    except Exception as e:
        print(f"Error updating DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_database()
