import json
import subprocess
import glob
import os

print("Running generators...")
subprocess.run([".venv\\Scripts\\python.exe", "scripts/generate_tests.py"], check=True)
subprocess.run([".venv\\Scripts\\python.exe", "scripts/gen_tc_1.py"], check=True)
subprocess.run([".venv\\Scripts\\python.exe", "scripts/gen_tc_2.py"], check=True)
subprocess.run([".venv\\Scripts\\python.exe", "scripts/gen_tc_3.py"], check=True)
subprocess.run([".venv\\Scripts\\python.exe", "scripts/gen_tc_4.py"], check=True)

all_tc = {}
for i in range(5):
    with open(f"scripts/extra_tc_{i}.json", "r") as f:
        data = json.load(f)
        all_tc.update(data)

with open("scripts/extra_tc.json", "w") as f:
    json.dump(all_tc, f)

print(f"Combined test cases for {len(all_tc)} problems.")

# Now patch seed_db.py to use scripts/extra_tc.json instead of /tmp/extra_tc.json
with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

old_loop = """        for tc in item["test_cases"]:
            test_case = TestCase(
                problem_id=problem.id,
                input_data=tc["input"],
                expected_output=tc["output"],
                is_hidden=tc["hidden"]
            )
            db.add(test_case)"""

new_loop = """        for tc in item["test_cases"]:
            test_case = TestCase(
                problem_id=problem.id,
                input_data=tc["input"],
                expected_output=tc["output"],
                is_hidden=tc["hidden"]
            )
            db.add(test_case)
            
        import json
        import os
        if os.path.exists('scripts/extra_tc.json'):
            with open('scripts/extra_tc.json', 'r') as f:
                extra = json.load(f)
                
            if item["slug"] in extra:
                for tc in extra[item["slug"]]:
                    test_case = TestCase(
                        problem_id=problem.id,
                        input_data=tc["input"],
                        expected_output=tc["output"],
                        is_hidden=tc["hidden"]
                    )
                    db.add(test_case)"""

if 'extra_tc.json' not in content:
    content = content.replace(old_loop, new_loop)
    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Updated seed_db.py with test case loader.")
else:
    # If it's already there but has the wrong path
    if '/tmp/extra_tc.json' in content:
        content = content.replace('/tmp/extra_tc.json', 'scripts/extra_tc.json')
        with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
            f.write(content)
            print("Fixed path in seed_db.py.")

print("Done combining.")
