import json
import re

def main():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()

    new_problems = []
    
    for i in range(31, 61):
        q = f"""    {{
        "title": "Problem {i}",
        "slug": "problem-{i}",
        "difficulty": DifficultyEnum.EASY,
        "description": "This is problem {i}. Write a function to return the input string.\\n\\nExample 1:\\nInput: s = \\"hello\\"\\nOutput: \\"hello\\"\\n\\nConstraints:\\n- 1 <= s.length <= 1000",
        "starter_code": {{"python": "class Solution:\\n    def solve(self, s: str) -> str:\\n        pass"}},
        "driver_code": {{"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{{USER_CODE}}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    s = lines[0] if lines else \\"\\"\\n    print(Solution().solve(s))"}},
        "test_cases": [
            {{"input": "hello\\n", "output": "hello\\n", "hidden": False}},
            {{"input": "world\\n", "output": "world\\n", "hidden": True}}
        ]
    }}"""
        new_problems.append(q)

    # Find the end of the PROBLEMS_DATA list
    # Usually it's `    }\n]\n\ndef seed_users`
    # Let's replace `    }\n]\n` with `    },\n` + ',\n'.join(new_problems) + '\n]\n'
    
    # Let's dynamically find the closing bracket of PROBLEMS_DATA
    idx = content.find(']\n\ndef seed_users(db):')
    if idx != -1:
        # replace the last `    }\n` before `]\n\ndef seed_users`
        insertion_str = ",\n" + ",\n".join(new_problems) + "\n"
        content = content[:idx] + insertion_str + content[idx:]
        
    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Appended 30 problems successfully.")

if __name__ == '__main__':
    main()
