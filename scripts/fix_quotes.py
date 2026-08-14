import re

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find `""` inside the driver_code strings.
# The easiest way is to look for `else ""` or `if not s else ""` 
# Let's just find `""\n` inside the driver code block? No, it's `""\n    `
# Actually, the string concatenation `""` inside `"..."` is just empty.
# Let's just replace `else ""` with `else \\"\\"`
content = content.replace('else ""\n', 'else \\"\\"\\n')
content = content.replace('if lines else ""', 'if lines else \\"\\"')

with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
    f.write(content)
