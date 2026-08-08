import json
import re

with open("problems.json", encoding="utf-16") as f:
    problems = json.load(f)

with open("testcases.json", encoding="utf-16") as f:
    testcases = json.load(f)

# Group testcases by problem_id
tc_by_prob = {}
for tc in testcases:
    pid = tc['problem_id']
    if pid not in tc_by_prob:
        tc_by_prob[pid] = []
    tc_by_prob[pid].append(tc)

for pid in tc_by_prob:
    tc_by_prob[pid].sort(key=lambda x: x['rn'])

updates = []

for prob in problems:
    pid = prob['id']
    desc = prob['description']
    if not desc: continue
    
    example_idx = desc.find("Example 1:")
    if example_idx != -1:
        base_desc = desc[:example_idx].strip()
        constraint_idx = desc.find("Constraints:", example_idx)
        if constraint_idx != -1:
            constraints_part = desc[constraint_idx:].strip()
        else:
            constraints_part = ""
    else:
        base_desc = desc.strip()
        constraint_idx = desc.find("Constraints:")
        if constraint_idx != -1:
            base_desc = desc[:constraint_idx].strip()
            constraints_part = desc[constraint_idx:].strip()
        else:
            constraints_part = ""
            
    tcs = tc_by_prob.get(pid, [])
    tcs = tcs[:3]
    
    new_desc = base_desc + "\n\n"
    
    for i, tc in enumerate(tcs):
        inp = str(tc.get('input_data') or '').strip().replace('\n', ', ')
        outp = str(tc.get('expected_output') or '').strip().replace('\n', ', ')
        new_desc += f"Example {i+1}:\nInput: {inp}\nOutput: {outp}\n\n"
        
    if constraints_part:
        new_desc += constraints_part
        
    escaped_desc = new_desc.replace("'", "''")
    updates.append(f"UPDATE problem SET description = '{escaped_desc}' WHERE id = {pid};")

with open("apply_updates.sql", "w", encoding='utf-8') as f:
    f.write("\n".join(updates))
    f.write("\n")

print("Generated apply_updates.sql")
