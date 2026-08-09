import os
import sys
import copy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.models.problem import Problem

REPLACEMENTS = [
    (
        "s = list(sys.stdin.read().splitlines()[0])",
        "lines = sys.stdin.read().splitlines()\n    s = list(lines[0]) if lines else []"
    ),
    (
        "x = int(sys.stdin.read().splitlines()[0])",
        "lines = sys.stdin.read().splitlines()\n    x = int(lines[0]) if lines else 0"
    ),
    (
        "s = sys.stdin.read().splitlines()[0]",
        "lines = sys.stdin.read().splitlines()\n    s = lines[0] if lines else \"\""
    ),
    (
        "nums = [int(x) for x in sys.stdin.read().splitlines()[0].split()]",
        "lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines else []"
    ),
    (
        "height = [int(x) for x in sys.stdin.read().splitlines()[0].split()]",
        "lines = sys.stdin.read().splitlines()\n    height = [int(x) for x in lines[0].split()] if lines else []"
    ),
    (
        "n = int(sys.stdin.read().splitlines()[0])",
        "lines = sys.stdin.read().splitlines()\n    n = int(lines[0]) if lines else 0"
    )
]

def fix_files():
    files_to_fix = [
        "scripts/seed_db.py",
        "scripts/gen_drivers_1.py",
        "scripts/gen_drivers_2.py"
    ]
    for fpath in files_to_fix:
        if not os.path.exists(fpath): continue
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
            
        original_content = content
        for old, new in REPLACEMENTS:
            content = content.replace(old, new)
            
        # specifically fix seed_db.py strings where \n and \\" might be escaped
        for old, new in REPLACEMENTS:
            old_esc = old.replace('\n', '\\n').replace('"', '\\"')
            new_esc = new.replace('\n', '\\n').replace('"', '\\"')
            content = content.replace(old_esc, new_esc)
            
        if content != original_content:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Fixed file: {fpath}")

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
            
            new_driver = old_driver
            for old, new in REPLACEMENTS:
                new_driver = new_driver.replace(old, new)
                
            if new_driver != old_driver:
                dc_dict["python"] = new_driver
                p.driver_code = dc_dict
                print(f"Fixed DB problem: {p.slug}")
                count += 1
                
        db.commit()
        print(f"Done. Fixed {count} problems in DB.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_files()
    update_database()
