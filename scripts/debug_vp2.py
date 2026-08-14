import sys
with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('"title": "Valid Parentheses"')
sub = content[idx:idx+1500]
print(sub)
