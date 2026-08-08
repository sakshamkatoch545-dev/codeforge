import json
import re

def main():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find each problem block
    pattern = r'(\{\s*"title":\s*"(.*?)",.*?\}|\])'
    
    # Actually simpler: just find all occurrences of `"test_cases": [` and replace the hidden testcases
    
    parts = content.split('    },')
    new_parts = []
    
    for part in parts:
        if '"title":' not in part:
            new_parts.append(part)
            continue
            
        # extract description
        desc_m = re.search(r'"description": "(.*?)",\n', part, flags=re.DOTALL)
        if not desc_m:
            new_parts.append(part)
            continue
        desc = desc_m.group(1)
        
        # look for a hidden testcase to make visible
        hidden_tc_m = re.search(r'\{"input": "(.*?)", "output": "(.*?)", "hidden": True\}', part)
        
        if hidden_tc_m:
            inp = hidden_tc_m.group(1)
            outp = hidden_tc_m.group(2)
            
            ex_count = desc.count('Example')
            new_ex_num = ex_count + 1
            
            inp_clean = inp.replace('\\n', ' ').strip().replace('\\"', '"')
            outp_clean = outp.replace('\\n', ' ').strip().replace('\\"', '"')
            
            new_example = f"\\n\\nExample {new_ex_num}:\\nInput: {inp_clean}\\nOutput: {outp_clean}"
            new_desc = desc + new_example
            
            part = part.replace(f'"description": "{desc}"', f'"description": "{new_desc}"')
            
            old_tc = hidden_tc_m.group(0)
            new_tc = old_tc.replace('"hidden": True', '"hidden": False')
            part = part.replace(old_tc, new_tc)
            
        new_parts.append(part)
        
    new_content = '    },'.join(new_parts)
    
    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Updated seed_db.py")

if __name__ == '__main__':
    main()
