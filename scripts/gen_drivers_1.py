import json

DRIVERS = {}

# 1. Two Sum
DRIVERS["Two Sum"] = {
    "starter_code": "class Solution:\n    def twoSum(self, nums, target):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        try: nums = json.loads(lines[0])
        except: nums = [int(x) for x in lines[0].split()]
        target = int(lines[1])
        res = Solution().twoSum(nums, target)
        print(json.dumps(res).replace(" ", ""))"""
}

# 2. Reverse String
DRIVERS["Reverse String"] = {
    "starter_code": "class Solution:\n    def reverseString(self, s):\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    s = list(sys.stdin.read().splitlines()[0])
    Solution().reverseString(s)
    print("".join(s))"""
}

# 3. Palindrome Number
DRIVERS["Palindrome Number"] = {
    "starter_code": "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    x = int(sys.stdin.read().splitlines()[0])
    res = Solution().isPalindrome(x)
    print("true" if res else "false")"""
}

# 4. Valid Parentheses
DRIVERS["Valid Parentheses"] = {
    "starter_code": "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    s = sys.stdin.read().splitlines()[0]
    res = Solution().isValid(s)
    print("true" if res else "false")"""
}

# 5. Merge Two Sorted Lists
DRIVERS["Merge Two Sorted Lists"] = {
    "starter_code": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def mergeTwoLists(self, list1, list2):\n        pass",
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
    l1 = build(lines[0].split()) if len(lines)>0 and lines[0] else None
    l2 = build(lines[1].split()) if len(lines)>1 and lines[1] else None
    res = Solution().mergeTwoLists(l1, l2)
    out = []
    while res: out.append(res.val); res = res.next
    print("[" + ",".join(map(str, out)) + "]")"""
}

# 6. Maximum Subarray
DRIVERS["Maximum Subarray"] = {
    "starter_code": "class Solution:\n    def maxSubArray(self, nums) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    nums = [int(x) for x in sys.stdin.read().splitlines()[0].split()]
    print(Solution().maxSubArray(nums))"""
}

# 7. Container With Most Water
DRIVERS["Container With Most Water"] = {
    "starter_code": "class Solution:\n    def maxArea(self, height) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    height = [int(x) for x in sys.stdin.read().splitlines()[0].split()]
    print(Solution().maxArea(height))"""
}

# 8. 3Sum
DRIVERS["3Sum"] = {
    "starter_code": "class Solution:\n    def threeSum(self, nums):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    nums = [int(x) for x in sys.stdin.read().splitlines()[0].split()]
    res = Solution().threeSum(nums)
    print(json.dumps(res).replace(" ", ""))"""
}

def inject():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    import re
    # We will use re to inject starter_code and driver_code into the PROBLEMS_DATA dicts
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
