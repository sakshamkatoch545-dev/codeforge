import subprocess

res = subprocess.run(
    ["docker", "run", "--rm", "-i", "python:3.11-alpine", "/bin/sh", "-c", "python -c 'import sys; print(\"GOT:\", sys.stdin.read())'"],
    input="[1,2,4]\n[1,3,4]\n",
    capture_output=True,
    text=True,
    timeout=5
)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
