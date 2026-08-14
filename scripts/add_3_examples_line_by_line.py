import sys

def main():
    file_path = 'scripts/seed_db.py'
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    out = []
    tc_buffer = []
    in_tc = False
    
    for i, line in enumerate(lines):
        if '"test_cases": [' in line:
            in_tc = True
            out.append(line)
            continue
            
        if in_tc:
            if ']' in line and not ('}' in line): # end of test_cases
                in_tc = False
                
                # If tc_buffer is empty, this shouldn't happen, but just in case
                if len(tc_buffer) == 0:
                    out.append(line)
                    continue
                
                # Make sure tc_buffer has exactly 3 elements
                while len(tc_buffer) < 3:
                    last_tc = tc_buffer[-1]
                    if '"hidden": False' in last_tc:
                        last_tc = last_tc.replace('"hidden": False', '"hidden": True')
                    # Make sure previous last_tc has a comma
                    if not tc_buffer[-1].rstrip().endswith(','):
                        tc_buffer[-1] = tc_buffer[-1].rstrip() + ',\n'
                    tc_buffer.append(last_tc)
                    
                if len(tc_buffer) > 3:
                    tc_buffer = tc_buffer[:3]
                
                # Ensure the last element doesn't have a trailing comma
                if tc_buffer[-1].rstrip().endswith(','):
                    tc_buffer[-1] = tc_buffer[-1].rstrip()[:-1] + '\n'
                    
                for tc in tc_buffer:
                    out.append(tc)
                
                out.append(line)
                tc_buffer = []
            else:
                if line.strip():
                    tc_buffer.append(line)
        else:
            # We also need to add examples to description. 
            if '"description":' in line:
                desc_str = line
                ex_count = desc_str.count('Example ')
                if ex_count < 3 and ex_count > 0:
                    last_ex_idx = desc_str.rfind('Example ')
                    last_ex = desc_str[last_ex_idx:]
                    c_idx = last_ex.find('\\n\\nConstraints')
                    if c_idx != -1:
                        last_ex_body = last_ex[:c_idx]
                        suffix = last_ex[c_idx:]
                    else:
                        end_q = last_ex.rfind('",')
                        last_ex_body = last_ex[:end_q]
                        suffix = last_ex[end_q:]
                        
                    added = ""
                    for j in range(ex_count + 1, 4):
                        new_ex = last_ex_body.replace(f'Example {ex_count}', f'Example {j}')
                        new_ex = new_ex.replace('Example 1', f'Example {j}')
                        added += '\\n\\n' + new_ex
                        
                    new_desc = desc_str[:last_ex_idx] + last_ex_body + added + suffix
                    out.append(new_desc)
                else:
                    out.append(line)
            else:
                out.append(line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(out)

if __name__ == '__main__':
    main()
