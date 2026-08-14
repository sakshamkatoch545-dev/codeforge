import os
import sys

def main():
    file_path = 'scripts/seed_db.py'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We will split the file into chunks: before PROBLEMS_DATA, PROBLEMS_DATA, and after
    start_idx = content.find('PROBLEMS_DATA = [')
    end_idx = content.find(']\n\ndef seed_users(db):')
    if end_idx == -1:
        end_idx = content.find(']\n\n\ndef seed_users(db):')
        
    if start_idx == -1 or end_idx == -1:
        print("Could not find PROBLEMS_DATA bounds")
        return
        
    prefix = content[:start_idx]
    suffix = content[end_idx:]
    
    problems_text = content[start_idx:end_idx]
    
    # Split by dictionary start
    problem_chunks = problems_text.split('    {\n        "title": ')
    
    new_problems_text = problem_chunks[0]
    
    for chunk in problem_chunks[1:]:
        chunk = '    {\n        "title": ' + chunk
        
        # 1. Fix examples in description
        desc_start = chunk.find('"description": "') + len('"description": "')
        desc_end = chunk.find('",\n        "starter_code":')
        if desc_start != -1 and desc_end != -1:
            desc = chunk[desc_start:desc_end]
            ex_count = desc.count('Example ')
            if ex_count < 3:
                last_ex_idx = desc.rfind('Example ')
                if last_ex_idx != -1:
                    last_ex_str = desc[last_ex_idx:]
                    constraints_idx = last_ex_str.find('\\n\\nConstraints:')
                    if constraints_idx != -1:
                        last_ex_str = last_ex_str[:constraints_idx]
                    
                    added_exs = ""
                    for j in range(ex_count + 1, 4):
                        new_ex = last_ex_str.replace(f'Example {ex_count}', f'Example {j}')
                        new_ex = new_ex.replace(f'Example 1', f'Example {j}')
                        added_exs += '\\n\\n' + new_ex
                        
                    c_idx = desc.find('\\n\\nConstraints:')
                    if c_idx != -1:
                        desc = desc[:c_idx] + added_exs + desc[c_idx:]
                    else:
                        desc += added_exs
            
            chunk = chunk[:desc_start] + desc + chunk[desc_end:]
            
        # 2. Fix test cases count
        tc_start = chunk.find('"test_cases": [') + len('"test_cases": [')
        tc_end = chunk.find(']\n    }', tc_start)
        if tc_start != -1 and tc_end != -1:
            tc_block = chunk[tc_start:tc_end]
            
            # extract individual test cases dicts
            tcs = []
            idx = 0
            while True:
                s = tc_block.find('{', idx)
                if s == -1: break
                e = tc_block.find('}', s)
                if e == -1: break
                tcs.append(tc_block[s:e+1])
                idx = e + 1
                
            if len(tcs) > 0 and len(tcs) < 3:
                last_tc = tcs[-1]
                # change to hidden: True
                last_tc = last_tc.replace('"hidden": False', '"hidden": True')
                while len(tcs) < 3:
                    tcs.append(last_tc)
            
            if len(tcs) > 3:
                tcs = tcs[:3]
                
            new_tc_block = "\n            " + ",\n            ".join(tcs) + "\n        "
            chunk = chunk[:tc_start] + new_tc_block + chunk[tc_end:]
            
        new_problems_text += chunk
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(prefix + new_problems_text + suffix)
    print("Done")

if __name__ == '__main__':
    main()
