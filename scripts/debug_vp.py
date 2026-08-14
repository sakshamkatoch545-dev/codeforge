import re

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'    {\n        "title": "Valid Parentheses".*?\n    },', content, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")
