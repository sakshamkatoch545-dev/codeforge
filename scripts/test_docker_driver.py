import subprocess
import base64

driver_code = """import sys, json
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        current = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        if list1:
            current.next = list1
        else:
            current.next = list2
        return dummy.next

def build(lst):
    d = c = ListNode(0)
    for v in lst: c.next = ListNode(int(v)); c = c.next
    return d.next

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    l1 = build(json.loads(lines[0])) if len(lines)>0 and lines[0] else None
    l2 = build(json.loads(lines[1])) if len(lines)>1 and lines[1] else None
    res = Solution().mergeTwoLists(l1, l2)
    out = []
    while res: out.append(res.val); res = res.next
    print("[" + ",".join(map(str, out)) + "]")
"""

volume_name = "test_vol"
subprocess.run(["docker", "volume", "create", volume_name], check=True, capture_output=True)
code_b64 = base64.b64encode(driver_code.encode("utf-8")).decode("utf-8")
inject_cmd = [
    "docker", "run", "--rm",
    "-v", f"{volume_name}:/code",
    "-e", f"CODE_B64={code_b64}",
    "alpine",
    "/bin/sh", "-c", "echo $CODE_B64 | base64 -d > /code/solution.py"
]
subprocess.run(inject_cmd, check=True, capture_output=True)

run_cmd = [
    "docker", "run", "--rm", "-i", "-v", f"{volume_name}:/code:ro", "-w", "/code",
    "python:3.11-alpine", "/bin/sh", "-c", "python solution.py"
]
res = subprocess.run(run_cmd, input="[1,2,4]\n[1,3,4]\n", capture_output=True, text=True)
print("STDOUT:", repr(res.stdout))
print("STDERR:", repr(res.stderr))
subprocess.run(["docker", "volume", "rm", volume_name], check=True, capture_output=True)
