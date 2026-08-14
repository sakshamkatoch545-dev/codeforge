import re

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

problems = content.split('"title":')
for p in problems[1:]:
    title = p.split('"')[1]
    tc_count = p.count('"hidden"')
    # count examples in description
    desc_start = p.find('"description":')
    if desc_start != -1:
        desc_end = p.find('",', desc_start)
        desc = p[desc_start:desc_end]
        ex_count = desc.count('Example ')
    else:
        ex_count = 0
    print(f'{title}: {tc_count} test cases, {ex_count} examples in desc')
