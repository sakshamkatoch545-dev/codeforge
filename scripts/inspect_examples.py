import re

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

problems = content.split('    {\n        "title": ')
for p in problems[1:10]:
    title = p.split('"')[1]
    desc_start = p.find('"description": "')
    if desc_start != -1:
        desc_end = p.find('",\n        "starter_code"')
        desc = p[desc_start:desc_end]
        print(f'--- {title} ---')
        # find examples
        exs = re.findall(r'Example \d+:(.*?)((?=Example \d+:)|(?=\\n\\nConstraints)|$)', desc, re.DOTALL)
        for i, ex in enumerate(exs):
            print(f'  Example {i+1}: {repr(ex[0].strip())}')
