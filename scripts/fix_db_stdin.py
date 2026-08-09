import os
import sys
import copy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.models.problem import Problem

def update_database():
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        problems = db.query(Problem).all()
        count = 0
        for p in problems:
            if not p.driver_code: continue
            
            dc_dict = copy.deepcopy(p.driver_code) if isinstance(p.driver_code, dict) else {}
            old_driver = dc_dict.get("python", "")
            
            # The buggy line: s = sys.stdin.read().splitlines()[0] if sys.stdin.read().splitlines() else ""
            if "s = sys.stdin.read().splitlines()[0] if sys.stdin.read().splitlines() else \"\"" in old_driver:
                new_driver = old_driver.replace(
                    "s = sys.stdin.read().splitlines()[0] if sys.stdin.read().splitlines() else \"\"",
                    "lines = sys.stdin.read().splitlines()\n    s = lines[0] if lines else \"\""
                )
                dc_dict["python"] = new_driver
                p.driver_code = dc_dict
                print(f"Fixed {p.slug}")
                count += 1
                
        db.commit()
        print(f"Done. Fixed {count} problems.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_database()
