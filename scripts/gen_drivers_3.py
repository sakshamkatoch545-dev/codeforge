import json

DRIVERS = {}

# 16. Product of Array Except Self
DRIVERS["Product of Array Except Self"] = {
    "starter_code": "class Solution:\n    def productExceptSelf(self, nums):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    res = Solution().productExceptSelf(nums)
    print(json.dumps(res).replace(" ", ""))"""
}

# 17. Longest Palindromic Substring
DRIVERS["Longest Palindromic Substring"] = {
    "starter_code": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0] if lines else ""
    print(Solution().longestPalindrome(s))"""
}

# 18. Median of Two Sorted Arrays
DRIVERS["Median of Two Sorted Arrays"] = {
    "starter_code": "class Solution:\n    def findMedianSortedArrays(self, nums1, nums2) -> float:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums1 = [int(x) for x in lines[0].split()] if len(lines) > 0 and lines[0] else []
    nums2 = [int(x) for x in lines[1].split()] if len(lines) > 1 and lines[1] else []
    res = Solution().findMedianSortedArrays(nums1, nums2)
    print(f"{float(res):.5f}")"""
}

# 19. Merge k Sorted Lists
DRIVERS["Merge k Sorted Lists"] = {
    "starter_code": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def mergeKLists(self, lists):\n        pass",
    "driver_code": """import sys, json
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
{USER_CODE}
def build(lst):
    d = c = ListNode(0)
    for v in lst: c.next = ListNode(int(v)); c = c.next
    return d.next
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    lists = []
    for line in lines:
        if line.strip():
            lists.append(build(line.split()))
        else:
            lists.append(None)
    res = Solution().mergeKLists(lists)
    out = []
    while res: out.append(res.val); res = res.next
    print("[" + ",".join(map(str, out)) + "]")"""
}

# 20. Search in Rotated Sorted Array
DRIVERS["Search in Rotated Sorted Array"] = {
    "starter_code": "class Solution:\n    def search(self, nums, target: int) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines[0] else []
    target = int(lines[1])
    print(Solution().search(nums, target))"""
}

# 21. First Missing Positive
DRIVERS["First Missing Positive"] = {
    "starter_code": "class Solution:\n    def firstMissingPositive(self, nums) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    print(Solution().firstMissingPositive(nums))"""
}

# 22. Permutations
DRIVERS["Permutations"] = {
    "starter_code": "class Solution:\n    def permute(self, nums):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    res = Solution().permute(nums)
    if res:
        res = [list(x) for x in res]
        res.sort()
    print(json.dumps(res).replace(" ", ""))"""
}

# 23. Merge Intervals
DRIVERS["Merge Intervals"] = {
    "starter_code": "class Solution:\n    def merge(self, intervals):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    flat = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    intervals = [[flat[i], flat[i+1]] for i in range(0, len(flat), 2)]
    res = Solution().merge(intervals)
    print(json.dumps(res).replace(" ", ""))"""
}

def inject():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    import re
    for title, codes in DRIVERS.items():
        pattern = r'(\{\s*"title":\s*"' + re.escape(title) + r'".*?)("test_cases":)'
        sc = json.dumps({"python": codes["starter_code"]}).replace("\\", "\\\\")
        dc = json.dumps({"python": codes["driver_code"]}).replace("\\", "\\\\")
        repl = r'\1"starter_code": ' + sc + r',\n        "driver_code": ' + dc + r',\n        \2'
        content = re.sub(pattern, repl, content, flags=re.DOTALL)
        print(f"Injected {title}")
        
    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    inject()
