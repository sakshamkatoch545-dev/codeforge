import json

DRIVERS = {}

# 24. Jump Game
DRIVERS["Jump Game"] = {
    "starter_code": "class Solution:\n    def canJump(self, nums) -> bool:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    print("true" if Solution().canJump(nums) else "false")"""
}

# 25. Unique Paths
DRIVERS["Unique Paths"] = {
    "starter_code": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    m, n = map(int, lines[0].split())
    print(Solution().uniquePaths(m, n))"""
}

# 26. Edit Distance
DRIVERS["Edit Distance"] = {
    "starter_code": "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    word1 = lines[0] if len(lines) > 0 else ""
    word2 = lines[1] if len(lines) > 1 else ""
    print(Solution().minDistance(word1, word2))"""
}

# 27. Word Search
DRIVERS["Word Search"] = {
    "starter_code": "class Solution:\n    def exist(self, board, word: str) -> bool:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    m, n = map(int, lines[0].split())
    board = []
    for i in range(1, m+1):
        board.append(lines[i].split())
    word = lines[m+1]
    print("true" if Solution().exist(board, word) else "false")"""
}

# 28. Best Time to Buy and Sell Stock
DRIVERS["Best Time to Buy and Sell Stock"] = {
    "starter_code": "class Solution:\n    def maxProfit(self, prices) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    prices = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    print(Solution().maxProfit(prices))"""
}

# 29. Linked List Cycle
DRIVERS["Linked List Cycle"] = {
    "starter_code": "class ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n\nclass Solution:\n    def hasCycle(self, head) -> bool:\n        pass",
    "driver_code": """import sys
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None
{USER_CODE}
def build(lst, pos):
    if not lst: return None
    nodes = [ListNode(int(x)) for x in lst]
    for i in range(len(nodes)-1):
        nodes[i].next = nodes[i+1]
    if pos != -1 and pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes[0]
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    lst = lines[0].split() if len(lines) > 0 and lines[0] else []
    pos = int(lines[1]) if len(lines) > 1 else -1
    head = build(lst, pos)
    print("true" if Solution().hasCycle(head) else "false")"""
}

# 30. Longest Consecutive Sequence
DRIVERS["Longest Consecutive Sequence"] = {
    "starter_code": "class Solution:\n    def longestConsecutive(self, nums) -> int:\n        pass",
    "driver_code": """import sys
{USER_CODE}
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []
    print(Solution().longestConsecutive(nums))"""
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
