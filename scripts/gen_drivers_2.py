import json

DRIVERS = {}

# 9. Longest Substring Without Repeating Characters
DRIVERS["Longest Substring Without Repeating Characters"] = {
    "starter_code": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    s = sys.stdin.read().splitlines()[0] if sys.stdin.read().splitlines() else ""
    print(Solution().lengthOfLongestSubstring(s))"""
}

# 10. Trapping Rain Water
DRIVERS["Trapping Rain Water"] = {
    "starter_code": "class Solution:\n    def trap(self, height) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    height = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    print(Solution().trap(height))"""
}

# 11. N-Queens
DRIVERS["N-Queens"] = {
    "starter_code": "class Solution:\n    def solveNQueens(self, n: int):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    n = int(sys.stdin.read().splitlines()[0])
    res = Solution().solveNQueens(n)
    print(json.dumps(res).replace(" ", ""))"""
}

# 12. Binary Search
DRIVERS["Binary Search"] = {
    "starter_code": "class Solution:\n    def search(self, nums, target: int) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines[0] else []
    target = int(lines[1])
    print(Solution().search(nums, target))"""
}

# 13. Climbing Stairs
DRIVERS["Climbing Stairs"] = {
    "starter_code": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    n = int(sys.stdin.read().splitlines()[0])
    print(Solution().climbStairs(n))"""
}

# 14. Valid Anagram
DRIVERS["Valid Anagram"] = {
    "starter_code": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    s = lines[0] if len(lines) > 0 else ""
    t = lines[1] if len(lines) > 1 else ""
    print("true" if Solution().isAnagram(s, t) else "false")"""
}

# 15. Group Anagrams
DRIVERS["Group Anagrams"] = {
    "starter_code": "class Solution:\n    def groupAnagrams(self, strs):\n        pass",
    "driver_code": """import sys, json
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    strs = lines[0].split() if lines and lines[0] else []
    res = Solution().groupAnagrams(strs)
    # Sort for deterministic output
    for l in res: l.sort()
    res.sort(key=lambda x: (len(x), x))
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
