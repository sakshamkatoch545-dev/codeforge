import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.models.problem import Problem, DifficultyEnum
from app.models.testcase import TestCase
from app.models.user import User
from app.core.security import get_password_hash

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

PROBLEMS_DATA = [
    {
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9\n- Only one valid answer exists.\n\nFollow-up: Can you come up with an algorithm that is less than O(n^2) time complexity?",
        "starter_code": {"python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    if len(lines) >= 2:\n        try: nums = json.loads(lines[0])\n        except: nums = [int(x) for x in lines[0].split()]\n        target = int(lines[1])\n        res = Solution().twoSum(nums, target)\n        print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "[2,7,11,15]\n9\n", "output": "[0,1]\n", "hidden": False},
            {"input": "[3,2,4]\n6\n", "output": "[1,2]\n", "hidden": True}
        ]
    },
    {
        "title": "Reverse String",
        "slug": "reverse-string",
        "difficulty": DifficultyEnum.EASY,
        "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\nExample 1:\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nExample 3:\nInput: s = [\"C\",\"o\",\"d\",\"e\",\"F\",\"o\",\"r\",\"g\",\"e\"]\nOutput: [\"e\",\"g\",\"r\",\"o\",\"F\",\"e\",\"d\",\"o\",\"C\"]\n\nConstraints:\n- 1 <= s.length <= 10^5\n- s[i] is a printable ascii character.\n\nFollow-up: Can you solve it with exactly O(1) extra space?",
        "starter_code": {"python": "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        \"\"\"\n        Do not return anything, modify s in-place instead.\n        \"\"\"\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    s = list(lines[0]) if lines else []\n    Solution().reverseString(s)\n    print(\"\".join(s))"},
        "test_cases": [
            {"input": "hello\n", "output": "olleh\n", "hidden": False},
            {"input": "CodeForge\n", "output": "egroFedoC\n", "hidden": True}
        ]
    },
    {
        "title": "Palindrome Number",
        "slug": "palindrome-number",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\n\nExample 1:\nInput: x = 121\nOutput: true\n\nExample 2:\nInput: x = -121\nOutput: false\nExplanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.\n\nExample 3:\nInput: x = 10\nOutput: false\nExplanation: Reads 01 from right to left. Therefore it is not a palindrome.\n\nConstraints:\n- -2^31 <= x <= 2^31 - 1\n\nFollow-up: Could you solve it without converting the integer to a string?",
        "starter_code": {"python": "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    x = int(lines[0]) if lines else 0\n    res = Solution().isPalindrome(x)\n    print(\"true\" if res else \"false\")"},
        "test_cases": [
            {"input": "121\n", "output": "true\n", "hidden": False},
            {"input": "-121\n", "output": "false\n", "hidden": True}
        ]
    },
    {
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample 1:\nInput: s = \"()[]{}\"\nOutput: true\n\nExample 2:\nInput: s = \"(]\"\nOutput: false\n\nExample 3:\nInput: s = \"(]\"\nOutput: false\n\nExample 4:\nInput: s = \"([)]\"\nOutput: false\n\nConstraints:\n- 1 <= s.length <= 10^4\n- s consists of parentheses only '()[]{}'.",
        "starter_code": {"python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    s = lines[0] if lines else ""\n    res = Solution().isValid(s)\n    print(\"true\" if res else \"false\")"},
        "test_cases": [
            {"input": "()[]{}\n", "output": "true\n", "hidden": False},
            {"input": "(]\n", "output": "false\n", "hidden": True}
        ]
    },
    {
        "title": "Merge Two Sorted Lists",
        "slug": "merge-two-sorted-lists",
        "difficulty": DifficultyEnum.EASY,
        "description": "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample 1:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n\nExample 2:\nInput: list1 = [], list2 = []\nOutput: []\n\nExample 3:\nInput: list1 = [], list2 = [0]\nOutput: [0]\n\nConstraints:\n- The number of nodes in both lists is in the range [0, 50].\n- -100 <= Node.val <= 100\n- Both list1 and list2 are sorted in non-decreasing order.",
        "starter_code": {"python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n{USER_CODE}\ndef build(lst):\n    d = c = ListNode(0)\n    for v in lst: c.next = ListNode(int(v)); c = c.next\n    return d.next\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    l1 = build(json.loads(lines[0])) if len(lines)>0 and lines[0] else None\n    l2 = build(json.loads(lines[1])) if len(lines)>1 and lines[1] else None\n    res = Solution().mergeTwoLists(l1, l2)\n    out = []\n    while res: out.append(res.val); res = res.next\n    print(\"[\" + \",\".join(map(str, out)) + \"]\")"},
        "test_cases": [
            {"input": "[1,2,4]\n[1,3,4]\n", "output": "[1,1,2,3,4,4]\n", "hidden": False}
        ]
    },
    {
        "title": "Maximum Subarray",
        "slug": "maximum-subarray",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\n\nConstraints:\n- 1 <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4\n\nFollow-up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.",
        "starter_code": {"python": "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines else []\n    print(Solution().maxSubArray(nums))"},
        "test_cases": [
            {"input": "-2 1 -3 4 -1 2 1 -5 4\n", "output": "6\n", "hidden": False},
            {"input": "5 4 -1 7 8\n", "output": "23\n", "hidden": True}
        ]
    },
    {
        "title": "Container With Most Water",
        "slug": "container-with-most-water",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\n\nExample 2:\nInput: height = [1,1]\nOutput: 1\n\nConstraints:\n- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4",
        "starter_code": {"python": "class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    height = [int(x) for x in lines[0].split()] if lines else []\n    print(Solution().maxArea(height))"},
        "test_cases": [
            {"input": "1 8 6 2 5 4 8 3 7\n", "output": "49\n", "hidden": False}
        ]
    },
    {
        "title": "3Sum",
        "slug": "3sum",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\nExplanation: The only possible triplet sums up to 0.\n\nConstraints:\n- 3 <= nums.length <= 3000\n- -10^5 <= nums[i] <= 10^5",
        "starter_code": {"python": "class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    nums = [int(x) for x in lines[0].split()] if lines else []\n    res = Solution().threeSum(nums)\n    print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "-1 0 1 2 -1 -4\n", "output": "[[-1,-1,2],[-1,0,1]]\n", "hidden": False}
        ]
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given a string s, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1\n\nExample 3:\nInput: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.\nNotice that the answer must be a substring, \"pwke\" is a subsequence and not a substring.\n\nConstraints:\n- 0 <= s.length <= 5 * 10^4\n- s consists of English letters, digits, symbols and spaces.",
        "starter_code": {"python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    s = lines[0] if lines else \"\"\n    print(Solution().lengthOfLongestSubstring(s))"},
        "test_cases": [
            {"input": "abcabcbb\n", "output": "3\n", "hidden": False},
            {"input": "bbbbb\n", "output": "1\n", "hidden": True}
        ]
    },
    {
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "difficulty": DifficultyEnum.HARD,
        "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nExample 1:\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n\nExample 2:\nInput: height = [4,2,0,3,2,5]\nOutput: 9\n\nConstraints:\n- n == height.length\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5\n\nFollow-up: Can you solve it in O(1) extra space?",
        "starter_code": {"python": "class Solution:\n    def trap(self, height: List[int]) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    height = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    print(Solution().trap(height))"},
        "test_cases": [
            {"input": "0 1 0 2 1 0 1 3 2 1 2 1\n", "output": "6\n", "hidden": False}
        ]
    },
    {
        "title": "N-Queens",
        "slug": "n-queens",
        "difficulty": DifficultyEnum.HARD,
        "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nExample 1:\nInput: n = 4\nOutput: [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\n\nExample 2:\nInput: n = 1\nOutput: [[\"Q\"]]\n\nConstraints:\n- 1 <= n <= 9\n\nFollow-up: Can you optimize your backtracking approach to use bit manipulation for O(1) space?",
        "starter_code": {"python": "class Solution:\n    def solveNQueens(self, n: int) -> List[List[str]]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    n = int(lines[0]) if lines else 0\n    res = Solution().solveNQueens(n)\n    print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "4\n", "output": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\n", "hidden": False}
        ]
    },
    {
        "title": "Binary Search",
        "slug": "binary-search",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4\n\nExample 2:\nInput: nums = [-1,0,3,5,9,12], target = 2\nOutput: -1\nExplanation: 2 does not exist in nums so return -1\n\nConstraints:\n- 1 <= nums.length <= 10^4\n- -10^4 < nums[i], target < 10^4\n- All the integers in nums are unique.\n- nums is sorted in ascending order.",
        "starter_code": {"python": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines[0] else []\n    target = int(lines[1])\n    print(Solution().search(nums, target))"},
        "test_cases": [
            {"input": "-1 0 3 5 9 12\n9\n", "output": "4\n", "hidden": False}
        ]
    },
    {
        "title": "Climbing Stairs",
        "slug": "climbing-stairs",
        "difficulty": DifficultyEnum.EASY,
        "description": "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2 (1 step + 1 step, or 2 steps)\n\nExample 2:\nInput: n = 3\nOutput: 3 (1+1+1, 1+2, 2+1)\n\nConstraints:\n- 1 <= n <= 45\n\nFollow-up: Can you solve it using O(1) space complexity? What about O(log n) time using matrix multiplication?",
        "starter_code": {"python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()
    n = int(lines[0]) if lines else 0\n    print(Solution().climbStairs(n))"},
        "test_cases": [
            {"input": "2\n", "output": "2\n", "hidden": False},
            {"input": "3\n", "output": "3\n", "hidden": True}
        ]
    },
    {
        "title": "Valid Anagram",
        "slug": "valid-anagram",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\nExample 1:\nInput: s = \"anagram\", t = \"nagaram\"\nOutput: true\n\nExample 2:\nInput: s = \"rat\", t = \"car\"\nOutput: false\n\nConstraints:\n- 1 <= s.length, t.length <= 5 * 10^4\n- s and t consist of lowercase English letters.\n\nFollow-up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?",
        "starter_code": {"python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    s = lines[0] if len(lines) > 0 else \"\"\n    t = lines[1] if len(lines) > 1 else \"\"\n    print(\"true\" if Solution().isAnagram(s, t) else \"false\")"},
        "test_cases": [
            {"input": "anagram\nnagaram\n", "output": "true\n", "hidden": False}
        ]
    },
    {
        "title": "Group Anagrams",
        "slug": "group-anagrams",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nExample 1:\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n\nExample 2:\nInput: strs = [\"\"]\nOutput: [[\"\"]]\n\nExample 3:\nInput: strs = [\"a\"]\nOutput: [[\"a\"]]\n\nConstraints:\n- 1 <= strs.length <= 10^4\n- 0 <= strs[i].length <= 100\n- strs[i] consists of lowercase English letters.",
        "starter_code": {"python": "class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    strs = lines[0].split() if lines and lines[0] else []\n    res = Solution().groupAnagrams(strs)\n    # Sort for deterministic output\n    for l in res: l.sort()\n    res.sort(key=lambda x: (len(x), x))\n    print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "eat tea tan ate nat bat\n", "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n", "hidden": False}
        ]
    },
    {
        "title": "Product of Array Except Self",
        "slug": "product-of-array-except-self",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.\n\nExample 1:\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n\nExample 2:\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n\nConstraints:\n- 2 <= nums.length <= 10^5\n- -30 <= nums[i] <= 30\n- The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nFollow-up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)",
        "starter_code": {"python": "class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    res = Solution().productExceptSelf(nums)\n    print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "1 2 3 4\n", "output": "24 12 8 6\n", "hidden": False}
        ]
    },
    {
        "title": "Longest Palindromic Substring",
        "slug": "longest-palindromic-substring",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given a string s, return the longest palindromic substring in s.\n\nExample 1:\nInput: s = \"babad\"\nOutput: \"bab\"\nExplanation: \"aba\" is also a valid answer.\n\nExample 2:\nInput: s = \"cbbd\"\nOutput: \"bb\"\n\nConstraints:\n- 1 <= s.length <= 1000\n- s consist of only digits and English letters.",
        "starter_code": {"python": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\ndef _get_canonical(st):\n    best = ''\n    for i in range(len(st)):\n        for j in range(i + 1, len(st) + 1):\n            sub = st[i:j]\n            if sub == sub[::-1] and len(sub) > len(best):\n                best = sub\n    return best\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    s = lines[0] if lines else ''\n    user_res = Solution().longestPalindrome(s)\n    canonical = _get_canonical(s)\n    if isinstance(user_res, str) and user_res in s and user_res == user_res[::-1] and len(user_res) == len(canonical):\n        print(canonical)\n    else:\n        print(user_res)"},
        "test_cases": [
            {"input": "babad\n", "output": "bab\n", "hidden": False}
        ]
    },
    {
        "title": "Median of Two Sorted Arrays",
        "slug": "median-of-two-sorted-arrays",
        "difficulty": DifficultyEnum.HARD,
        "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\nExample 1:\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\n\nExample 2:\nInput: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n\nConstraints:\n- nums1.length == m\n- nums2.length == n\n- 0 <= m <= 1000\n- 0 <= n <= 1000\n- 1 <= m + n <= 2000\n- -10^6 <= nums1[i], nums2[i] <= 10^6",
        "starter_code": {"python": "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums1 = [int(x) for x in lines[0].split()] if len(lines) > 0 and lines[0] else []\n    nums2 = [int(x) for x in lines[1].split()] if len(lines) > 1 and lines[1] else []\n    res = Solution().findMedianSortedArrays(nums1, nums2)\n    print(f\"{float(res):.5f}\")"},
        "test_cases": [
            {"input": "1 3\n2\n", "output": "2.00000\n", "hidden": False}
        ]
    },
    {
        "title": "Merge k Sorted Lists",
        "slug": "merge-k-sorted-lists",
        "difficulty": DifficultyEnum.HARD,
        "description": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.\n\nExample 1:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\n\nExample 2:\nInput: lists = []\nOutput: []\n\nExample 3:\nInput: lists = [[]]\nOutput: []\n\nConstraints:\n- k == lists.length\n- 0 <= k <= 10^4\n- 0 <= lists[i].length <= 500\n- -10^4 <= lists[i][j] <= 10^4\n- lists[i] is sorted in ascending order.\n- The sum of lists[i].length will not exceed 10^4.",
        "starter_code": {"python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n{USER_CODE}\ndef build(lst):\n    d = c = ListNode(0)\n    for v in lst: c.next = ListNode(int(v)); c = c.next\n    return d.next\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    k = int(lines[0]) if lines and lines[0].strip() else 0\n    lists = []\n    for i in range(1, k + 1):\n        if i < len(lines):\n            line = lines[i]\n            if line.strip():\n                lists.append(build(line.split()))\n            else:\n                lists.append(None)\n    res = Solution().mergeKLists(lists)\n    out = []\n    while res: out.append(res.val); res = res.next\n    print(\"[\" + \",\".join(map(str, out)) + \"]\")"},
        "test_cases": [
            {"input": "3\n1 4 5\n1 3 4\n2 6\n", "output": "1 1 2 3 4 4 5 6\n", "hidden": False}
        ]
    },
    {
        "title": "Search in Rotated Sorted Array",
        "slug": "search-in-rotated-sorted-array",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nExample 1:\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\nInput: nums = [1], target = 0\nOutput: -1\n\nConstraints:\n- 1 <= nums.length <= 5000\n- -10^4 <= nums[i] <= 10^4\n- All values of nums are unique.\n- nums is an ascending array that is possibly rotated.\n- -10^4 <= target <= 10^4",
        "starter_code": {"python": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines[0] else []\n    target = int(lines[1])\n    print(Solution().search(nums, target))"},
        "test_cases": [
            {"input": "4 5 6 7 0 1 2\n0\n", "output": "4\n", "hidden": False}
        ]
    },
    {
        "title": "First Missing Positive",
        "slug": "first-missing-positive",
        "difficulty": DifficultyEnum.HARD,
        "description": "Given an unsorted integer array nums, return the smallest missing positive integer.\n\nYou must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.\n\nExample 1:\nInput: nums = [1,2,0]\nOutput: 3\n\nExample 2:\nInput: nums = [3,4,-1,1]\nOutput: 2\n\nExample 3:\nInput: nums = [7,8,9,11,12]\nOutput: 1\n\nConstraints:\n- 1 <= nums.length <= 10^5\n- -2^31 <= nums[i] <= 2^31 - 1",
        "starter_code": {"python": "class Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    print(Solution().firstMissingPositive(nums))"},
        "test_cases": [
            {"input": "1 2 0\n", "output": "3\n", "hidden": False},
            {"input": "3 4 -1 1\n", "output": "2\n", "hidden": True}
        ]
    },
    {
        "title": "Permutations",
        "slug": "permutations",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.\n\nExample 1:\nInput: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n\nExample 2:\nInput: nums = [0,1]\nOutput: [[0,1],[1,0]]\n\nExample 3:\nInput: nums = [1]\nOutput: [[1]]\n\nConstraints:\n- 1 <= nums.length <= 6\n- -10 <= nums[i] <= 10\n- All the integers of nums are unique.",
        "starter_code": {"python": "class Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    res = Solution().permute(nums)\n    if res:\n        res = [list(x) for x in res]\n        res.sort()\n    print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "1 2 3\n", "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n", "hidden": False}
        ]
    },
    {
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\nExample 1:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\n\nExample 2:\nInput: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\nExplanation: Intervals [1,4] and [4,5] are considered overlapping.\n\nConstraints:\n- 1 <= intervals.length <= 10^4\n- intervals[i].length == 2\n- 0 <= starti <= endi <= 10^4",
        "starter_code": {"python": "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    intervals = []\n    for line in lines:\n        if line.strip():\n            parts = line.split()\n            intervals.append([int(parts[0]), int(parts[1])])\n    res = Solution().merge(intervals)\n    print(json.dumps(res).replace(\" \", \"\"))"},
        "test_cases": [
            {"input": "1 3\n2 6\n8 10\n15 18\n", "output": "[[1,6],[8,10],[15,18]]\n", "hidden": False}
        ]
    },
    {
        "title": "Jump Game",
        "slug": "jump-game",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.\n\nExample 1:\nInput: nums = [2,3,1,1,4]\nOutput: true\n\nExample 2:\nInput: nums = [3,2,1,0,4]\nOutput: false\nExplanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.\n\nConstraints:\n- 1 <= nums.length <= 10^4\n- 0 <= nums[i] <= 10^5",
        "starter_code": {"python": "class Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    print(\"true\" if Solution().canJump(nums) else \"false\")"},
        "test_cases": [
            {"input": "2 3 1 1 4\n", "output": "true\n", "hidden": False}
        ]
    },
    {
        "title": "Unique Paths",
        "slug": "unique-paths",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m-1][n-1]). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nExample 1:\nInput: m = 3, n = 7\nOutput: 28\n\nExample 2:\nInput: m = 3, n = 2\nOutput: 3\nExplanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Down -> Right\n3. Down -> Right -> Down\n\nConstraints:\n- 1 <= m, n <= 100",
        "starter_code": {"python": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    m, n = map(int, lines[0].split())\n    print(Solution().uniquePaths(m, n))"},
        "test_cases": [
            {"input": "3 7\n", "output": "28\n", "hidden": False}
        ]
    },
    {
        "title": "Edit Distance",
        "slug": "edit-distance",
        "difficulty": DifficultyEnum.HARD,
        "description": "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character\n\nExample 1:\nInput: word1 = \"horse\", word2 = \"ros\"\nOutput: 3\n\nExample 2:\nInput: word1 = \"intention\", word2 = \"execution\"\nOutput: 5\nExplanation: \nintention -> inention (remove 't')\ninention -> enention (replace 'i' with 'e')\nenention -> exention (replace 'n' with 'x')\nexention -> exection (replace 'n' with 'c')\nexection -> execution (insert 'u')\n\nConstraints:\n- 0 <= word1.length, word2.length <= 500\n- word1 and word2 consist of lowercase English letters.",
        "starter_code": {"python": "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    word1 = lines[0] if len(lines) > 0 else \"\"\n    word2 = lines[1] if len(lines) > 1 else \"\"\n    print(Solution().minDistance(word1, word2))"},
        "test_cases": [
            {"input": "horse\nros\n", "output": "3\n", "hidden": False}
        ]
    },
    {
        "title": "Word Search",
        "slug": "word-search",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.\n\nExample 1:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\nOutput: true\n\nExample 2:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"\nOutput: true\n\nExample 3:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"\nOutput: false\n\nConstraints:\n- m == board.length\n- n = board[i].length\n- 1 <= m, n <= 6\n- 1 <= word.length <= 15\n- board and word consists of only lowercase and uppercase English letters.",
        "starter_code": {"python": "class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    m, n = map(int, lines[0].split())\n    board = []\n    for i in range(1, m+1):\n        board.append(lines[i].split())\n    word = lines[m+1]\n    print(\"true\" if Solution().exist(board, word) else \"false\")"},
        "test_cases": [
            {"input": "3 4\nA B C E\nS F C S\nA D E E\nABCCED\n", "output": "true\n", "hidden": False}
        ]
    },
    {
        "title": "Best Time to Buy and Sell Stock",
        "slug": "best-time-to-buy-and-sell-stock",
        "difficulty": DifficultyEnum.EASY,
        "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.\n\nConstraints:\n- 1 <= prices.length <= 10^5\n- 0 <= prices[i] <= 10^4",
        "starter_code": {"python": "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    prices = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    print(Solution().maxProfit(prices))"},
        "test_cases": [
            {"input": "7 1 5 3 6 4\n", "output": "5\n", "hidden": False}
        ]
    },
    {
        "title": "Linked List Cycle",
        "slug": "linked-list-cycle",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.\n\nExample 1:\nInput: head = [3,2,0,-4], pos = 1\nOutput: true\n\nExample 2:\nInput: head = [1,2], pos = 0\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 0th node.\n\nExample 3:\nInput: head = [1], pos = -1\nOutput: false\nExplanation: There is no cycle in the linked list.\n\nConstraints:\n- The number of the nodes in the list is in the range [0, 10^4].\n- -10^5 <= Node.val <= 10^5\n- pos is -1 or a valid index in the linked-list.\n\nFollow up: Can you solve it using O(1) (i.e. constant) memory?",
        "starter_code": {"python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.next = None\n\nclass Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\nclass ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n{USER_CODE}\ndef build(lst, pos):\n    if not lst: return None\n    nodes = [ListNode(int(x)) for x in lst]\n    for i in range(len(nodes)-1):\n        nodes[i].next = nodes[i+1]\n    if pos != -1 and pos < len(nodes):\n        nodes[-1].next = nodes[pos]\n    return nodes[0]\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    lst = lines[0].split() if len(lines) > 0 and lines[0] else []\n    pos = int(lines[1]) if len(lines) > 1 else -1\n    head = build(lst, pos)\n    print(\"true\" if Solution().hasCycle(head) else \"false\")"},
        "test_cases": [
            {"input": "3 2 0 -4\n1\n", "output": "true\n", "hidden": False}
        ]
    },
    {
        "title": "Longest Consecutive Sequence",
        "slug": "longest-consecutive-sequence",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.\n\nExample 1:\nInput: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.\n\nExample 2:\nInput: nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9\n\nConstraints:\n- 0 <= nums.length <= 10^5\n- -10^9 <= nums[i] <= 10^9",
        "starter_code": {"python": "class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        pass"},
        "driver_code": {"python": "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n{USER_CODE}\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = [int(x) for x in lines[0].split()] if lines and lines[0] else []\n    print(Solution().longestConsecutive(nums))"},
        "test_cases": [
            {"input": "100 4 200 1 3 2\n", "output": "4\n", "hidden": False}
        ]
    }
]

def seed_users(db):
    print("Seeding users...")
    # No hardcoded users - users should register their own accounts via the API
    # This function is kept for future extensibility (e.g., demo users, test users)
    pass

def seed_problems(db):
    print("Refreshing problems table with distinct questions...")
    # Delete existing sample problems to replace them with distinct questions
    db.execute(text("DELETE FROM testcase"))
    db.execute(text("DELETE FROM submission"))
    db.execute(text("DELETE FROM problem"))
    db.commit()

    for item in PROBLEMS_DATA:
        problem = Problem(
            title=item["title"],
            slug=item["slug"],
            description=item["description"],
            difficulty=item["difficulty"],
            starter_code=item.get("starter_code", {}),
            driver_code=item.get("driver_code", {}),
            time_limit=1000,
            memory_limit=256
        )
        db.add(problem)
        db.commit()
        db.refresh(problem)

        for tc in item["test_cases"]:
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
                    db.add(test_case)
        db.commit()

def main():
    db = SessionLocal()
    try:
        seed_users(db)
        seed_problems(db)
        print("Seeding completed successfully with unique problems.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
