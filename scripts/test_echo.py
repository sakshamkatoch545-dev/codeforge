import subprocess
code = """if __name__ == '__main__':
    print("hello")
"""
cmd = f"echo '{code}' > out.txt && cat out.txt"
try:
    res = subprocess.run(["docker", "run", "--rm", "alpine", "/bin/sh", "-c", cmd], check=True, capture_output=True, text=True)
    print("OUTPUT:", repr(res.stdout))
except subprocess.CalledProcessError as e:
    print("ERROR:", e)
    print("STDERR:", e.stderr)
