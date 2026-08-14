import re

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix broken lines at splitlines()
content = re.sub(r'splitlines\(\)\n\s*', r'splitlines()\\n    ', content)

with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
    f.write(content)
