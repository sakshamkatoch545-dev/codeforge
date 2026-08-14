import sys
sys.path.append('backend')
import json

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()
    
# Let's extract the exact text for driver_code of valid-parentheses
idx = content.find('"title": "Valid Parentheses"')
sub = content[idx:idx+1000]
print(sub)
