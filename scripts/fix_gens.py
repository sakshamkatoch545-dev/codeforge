import json

for i in range(1, 5):
    with open(f"scripts/gen_drivers_{i}.py", "r") as f:
        content = f.read()
    content = content.replace('sc = json.dumps({"python": codes["starter_code"]})', 'sc = json.dumps({"python": codes["starter_code"]}).replace("\\\\", "\\\\\\\\")')
    content = content.replace('dc = json.dumps({"python": codes["driver_code"]})', 'dc = json.dumps({"python": codes["driver_code"]}).replace("\\\\", "\\\\\\\\")')
    with open(f"scripts/gen_drivers_{i}.py", "w") as f:
        f.write(content)
