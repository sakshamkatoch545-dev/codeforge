import re
import ast

def main():
    file_path = 'scripts/seed_db.py'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will do text-based replacement.
    # Split by `    {\n        "title":` or similar
    
    problems_split = content.split('    {\n        "title": ')
    
    new_content = problems_split[0]
    
    for i in range(1, len(problems_split)):
        p_str = '    {\n        "title": ' + problems_split[i]
        
        # Ensure 3 test cases
        # Extract the test cases block
        tc_match = re.search(r'("test_cases": \[)(.*?)(\n        \])', p_str, re.DOTALL)
        if tc_match:
            tc_prefix = tc_match.group(1)
            tc_content = tc_match.group(2)
            tc_suffix = tc_match.group(3)
            
            # Count the number of test cases
            tcs = re.findall(r'\{.*?\}', tc_content, re.DOTALL)
            
            while len(tcs) < 3:
                # duplicate the last one and set hidden to True
                last_tc = tcs[-1]
                # Try to modify hidden flag to True if we are duplicating
                if '"hidden": False' in last_tc:
                    last_tc = last_tc.replace('"hidden": False', '"hidden": True')
                tcs.append(last_tc)
                
            # If there are more than 3, we truncate to 3
            if len(tcs) > 3:
                tcs = tcs[:3]
                
            new_tc_content = ",\n            ".join(tcs)
            new_tc_block = tc_prefix + "\n            " + new_tc_content + tc_suffix
            
            p_str = p_str[:tc_match.start()] + new_tc_block + p_str[tc_match.end():]
            
        # Ensure 3 examples in description
        desc_match = re.search(r'"description": "(.*?)",\n        "starter_code"', p_str, re.DOTALL)
        if desc_match:
            desc = desc_match.group(1)
            
            # Find how many examples there are
            ex_count = desc.count('Example ')
            
            if ex_count < 3:
                # Find the last example to duplicate its structure
                last_ex_idx = desc.rfind('Example ')
                if last_ex_idx != -1:
                    last_ex_str = desc[last_ex_idx:]
                    # If there's constraints after the example, extract just the example part
                    constraints_idx = last_ex_str.find('\\n\\nConstraints:')
                    if constraints_idx != -1:
                        last_ex_str = last_ex_str[:constraints_idx]
                        
                    for j in range(ex_count + 1, 4):
                        new_ex_str = last_ex_str.replace(f'Example {ex_count}', f'Example {j}')
                        new_ex_str = new_ex_str.replace(f'Example {ex_count - 1}', f'Example {j}')
                        new_ex_str = new_ex_str.replace(f'Example 1', f'Example {j}')
                        
                        # Insert new example right before Constraints or at the end
                        c_idx = desc.find('\\n\\nConstraints:')
                        if c_idx != -1:
                            desc = desc[:c_idx] + '\\n\\n' + new_ex_str + desc[c_idx:]
                        else:
                            desc += '\\n\\n' + new_ex_str
                            
            p_str = p_str[:desc_match.start(1)] + desc + p_str[desc_match.end(1):]
            
        new_content += p_str
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
if __name__ == '__main__':
    main()
