import os
import sys
import copy
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.models.problem import Problem

NEW_DRIVER_PYTHON = """import sys, json
from typing import *
import collections
import math
import itertools
{USER_CODE}
def _get_canonical(st):
    best = ''
    for i in range(len(st)):
        for j in range(i + 1, len(st) + 1):
            sub = st[i:j]
            if sub == sub[::-1] and len(sub) > len(best):
                best = sub
    return best
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0] if lines else ''
    user_res = Solution().longestPalindrome(s)
    canonical = _get_canonical(s)
    if isinstance(user_res, str) and user_res in s and user_res == user_res[::-1] and len(user_res) == len(canonical):
        print(canonical)
    else:
        print(user_res)"""

def update_seed_file():
    filepath = "scripts/seed_db.py"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    old_driver_str = '"driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == \'__main__\':\\n    lines = sys.stdin.read().splitlines()\\n    s = lines[0] if lines else \\"\\"\\n    print(Solution().longestPalindrome(s))"}'
    new_driver_str = '"driver_code": {"python": ' + json.dumps(NEW_DRIVER_PYTHON) + '}'
    
    if old_driver_str in content:
        content = content.replace(old_driver_str, new_driver_str)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated seed_db.py")

def update_database():
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        p = db.query(Problem).filter(Problem.slug == "longest-palindromic-substring").first()
        if p:
            dc_dict = copy.deepcopy(p.driver_code) if isinstance(p.driver_code, dict) else {}
            dc_dict["python"] = NEW_DRIVER_PYTHON
            p.driver_code = dc_dict
            db.commit()
            print("Successfully updated longest-palindromic-substring driver code in DB!")
        else:
            print("Problem longest-palindromic-substring not found in DB.")
    except Exception as e:
        print(f"Error updating DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_seed_file()
    update_database()
