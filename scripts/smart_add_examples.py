import re
import json

MISSING_EXAMPLES = {
    "valid-parentheses": [
        {"input": '()[]{}', "output": 'true'},
        {"input": '(]', "output": 'false'},
        {"input": '([)]', "output": 'false'}
    ],
    "container-with-most-water": [
        {"input": '[1,8,6,2,5,4,8,3,7]', "output": '49'},
        {"input": '[1,1]', "output": '1'},
        {"input": '[4,3,2,1,4]', "output": '16'}
    ],
    "trapping-rain-water": [
        {"input": '[0,1,0,2,1,0,1,3,2,1,2,1]', "output": '6'},
        {"input": '[4,2,0,3,2,5]', "output": '9'},
        {"input": '[0,2,0,3,1,0,1,3,2,1]', "output": '9'}
    ],
    "n-queens": [
        {"input": '4', "output": '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]'},
        {"input": '1', "output": '[["Q"]]'},
        {"input": '2', "output": '[]'}
    ],
    "binary-search": [
        {"input": '[-1,0,3,5,9,12]\n9', "output": '4'},
        {"input": '[-1,0,3,5,9,12]\n2', "output": '-1'},
        {"input": '[5]\n5', "output": '0'}
    ],
    "climbing-stairs": [
        {"input": '2', "output": '2'},
        {"input": '3', "output": '3'},
        {"input": '4', "output": '5'}
    ],
    "valid-anagram": [
        {"input": '"anagram"\n"nagaram"', "output": 'true'},
        {"input": '"rat"\n"car"', "output": 'false'},
        {"input": '"a"\n"ab"', "output": 'false'}
    ],
    "group-anagrams": [
        {"input": '["eat","tea","tan","ate","nat","bat"]', "output": '[["bat"],["nat","tan"],["ate","eat","tea"]]'},
        {"input": '[""]', "output": '[[""]]'},
        {"input": '["a"]', "output": '[["a"]]'}
    ],
    "product-of-array-except-self": [
        {"input": '[1,2,3,4]', "output": '[24,12,8,6]'},
        {"input": '[-1,1,0,-3,3]', "output": '[0,0,9,0,0]'},
        {"input": '[1,2]', "output": '[2,1]'}
    ],
    "longest-palindromic-substring": [
        {"input": '"babad"', "output": '"bab"'},
        {"input": '"cbbd"', "output": '"bb"'},
        {"input": '"a"', "output": '"a"'}
    ],
    "median-of-two-sorted-arrays": [
        {"input": '[1,3]\n[2]', "output": '2.0'},
        {"input": '[1,2]\n[3,4]', "output": '2.5'},
        {"input": '[]\n[1]', "output": '1.0'}
    ],
    "merge-intervals": [
        {"input": '[[1,3],[2,6],[8,10],[15,18]]', "output": '[[1,6],[8,10],[15,18]]'},
        {"input": '[[1,4],[4,5]]', "output": '[[1,5]]'},
        {"input": '[[1,4],[0,4]]', "output": '[[0,4]]'}
    ],
    "jump-game": [
        {"input": '[2,3,1,1,4]', "output": 'true'},
        {"input": '[3,2,1,0,4]', "output": 'false'},
        {"input": '[0]', "output": 'true'}
    ],
    "unique-paths": [
        {"input": '3\n7', "output": '28'},
        {"input": '3\n2', "output": '3'},
        {"input": '3\n3', "output": '6'}
    ],
    "edit-distance": [
        {"input": '"horse"\n"ros"', "output": '3'},
        {"input": '"intention"\n"execution"', "output": '5'},
        {"input": '""\n"a"', "output": '1'}
    ],
    "word-search": [
        {"input": '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"', "output": 'true'},
        {"input": '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SEE"', "output": 'true'},
        {"input": '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCB"', "output": 'false'}
    ],
    "best-time-to-buy-and-sell-stock": [
        {"input": '[7,1,5,3,6,4]', "output": '5'},
        {"input": '[7,6,4,3,1]', "output": '0'},
        {"input": '[1,2]', "output": '1'}
    ],
    "two-sum": [
        {"input": '[2,7,11,15]\n9', "output": '[0,1]'},
        {"input": '[3,2,4]\n6', "output": '[1,2]'},
        {"input": '[3,3]\n6', "output": '[0,1]'}
    ],
    "reverse-string": [
        {"input": 'hello', "output": 'olleh'},
        {"input": 'Hannah', "output": 'hannaH'},
        {"input": 'CodeForge', "output": 'egroFedoC'}
    ],
    "longest-substring-without-repeating-characters": [
        {"input": '"abcabcbb"', "output": '3'},
        {"input": '"bbbbb"', "output": '1'},
        {"input": '"pwwkew"', "output": '3'}
    ]
}

def rebuild_description(old_desc, testcases):
    # Strip existing examples
    ex1_idx = old_desc.find('Example 1:')
    if ex1_idx != -1:
        base_desc = old_desc[:ex1_idx].strip()
    else:
        base_desc = old_desc.strip()
        
    c_idx = old_desc.find('Constraints:')
    constraints = ""
    if c_idx != -1:
        constraints = old_desc[c_idx:].strip()
        
    # Rebuild examples from testcases
    new_exs = ""
    for i, tc in enumerate(testcases):
        inp = tc['input'].replace('\n', ', ').replace('"', '\\"')
        outp = tc['output'].replace('\n', '').replace('"', '\\"')
        # format input visually for description
        new_exs += f"\\n\\nExample {i+1}:\\nInput: {inp}\\nOutput: {outp}"
        
    if constraints:
        return base_desc + new_exs + "\\n\\n" + constraints
    return base_desc + new_exs

def main():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into problems
    chunks = content.split('    {\n        "title": ')
    
    new_content = chunks[0]
    
    for chunk in chunks[1:]:
        p_str = '    {\n        "title": ' + chunk
        
        # Get slug
        slug_match = re.search(r'"slug": "(.*?)",', p_str)
        if not slug_match:
            new_content += p_str
            continue
            
        slug = slug_match.group(1)
        
        if slug in MISSING_EXAMPLES:
            tcs = MISSING_EXAMPLES[slug]
            
            # 1. Rebuild description
            desc_match = re.search(r'"description": "(.*?)",\n        "starter_code"', p_str, re.DOTALL)
            if desc_match:
                old_desc = desc_match.group(1)
                new_desc = rebuild_description(old_desc, tcs)
                p_str = p_str[:desc_match.start(1)] + new_desc + p_str[desc_match.end(1):]
                
            # 2. Rebuild testcases array
            tc_match = re.search(r'("test_cases": \[)(.*?)(\n        \])', p_str, re.DOTALL)
            if tc_match:
                tc_prefix = tc_match.group(1)
                tc_suffix = tc_match.group(3)
                
                new_tc_content = []
                for i, tc in enumerate(tcs):
                    inp = tc["input"].replace('\n', '\\n').replace('"', '\\"') + '\\n'
                    outp = tc["output"].replace('\n', '\\n').replace('"', '\\"') + '\\n'
                    hidden = "False" if i == 0 else "True"
                    new_tc_content.append(f'{{"input": "{inp}", "output": "{outp}", "hidden": {hidden}}}')
                    
                tc_body = "\n            " + ",\n            ".join(new_tc_content)
                p_str = p_str[:tc_match.start()] + tc_prefix + tc_body + tc_suffix + p_str[tc_match.end():]
                
        new_content += p_str

    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == '__main__':
    main()
