import re

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

# The bug caused `"description": "valid string", junk",\n        "test_cases":`
# We want to remove ` junk",`
# We can match `"description": "(.*?)",(.*?)\n(\s*"test_cases":)`
# Wait, the junk could contain newlines!
# Let's match `"description": "(.*?)",.*?\n(\s*"test_cases":)` where `(.*?)` is non-greedy.
# Actually, the replacement already put the FULL valid description in the first `(.*?)`.
# Let's test this carefully.

def fix_content(content):
    # Find all occurrences of "description": "...", ... \n        "test_cases":
    # Because of the bug, the string is `"description": "NEW_DESC", JUNK\n        "test_cases":`
    # NEW_DESC does not contain `",\n        "test_cases":`
    
    # Let's use a regex to replace everything between the end of NEW_DESC and "test_cases":
    # The end of NEW_DESC is always `.",` or similar. Actually, the replacement was exact.
    # So we can just match `"description": "(.*?)",.*?\n(\s*"test_cases":)`
    # where the first group is the correct new description.
    
    # Let's try it.
    new_content = re.sub(r'"description": "(.*?)",.*?\n(\s*"test_cases":)', r'"description": "\1",\n\2', content, flags=re.DOTALL)
    return new_content

fixed = fix_content(content)

with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
    f.write(fixed)
print("Fixed!")
