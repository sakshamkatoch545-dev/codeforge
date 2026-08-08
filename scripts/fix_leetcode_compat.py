import os
import sys
import copy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from app.models.problem import Problem

NEW_STARTER_CODES = {
    "two-sum": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
    "reverse-string": "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        \"\"\"\n        Do not return anything, modify s in-place instead.\n        \"\"\"\n        pass",
    "palindrome-number": "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
    "valid-parentheses": "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
    "merge-two-sorted-lists": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass",
    "maximum-subarray": "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass",
    "container-with-most-water": "class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass",
    "3sum": "class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass",
    "longest-substring-without-repeating-characters": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
    "trapping-rain-water": "class Solution:\n    def trap(self, height: List[int]) -> int:\n        pass",
    "n-queens": "class Solution:\n    def solveNQueens(self, n: int) -> List[List[str]]:\n        pass",
    "binary-search": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
    "climbing-stairs": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
    "valid-anagram": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
    "group-anagrams": "class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        pass",
    "product-of-array-except-self": "class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        pass",
    "longest-palindromic-substring": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass",
    "median-of-two-sorted-arrays": "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass",
    "merge-k-sorted-lists": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        pass",
    "search-in-rotated-sorted-array": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
    "first-missing-positive": "class Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        pass",
    "permutations": "class Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        pass",
    "merge-intervals": "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        pass",
    "jump-game": "class Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass",
    "unique-paths": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass",
    "edit-distance": "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        pass",
    "word-search": "class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        pass",
    "best-time-to-buy-and-sell-stock": "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass",
    "linked-list-cycle": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.next = None\n\nclass Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass",
    "longest-consecutive-sequence": "class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        pass"
}

def fix_driver_code(old_driver: str, slug: str) -> str:
    imports = "import sys, json\nfrom typing import *\nimport collections\nimport math\nimport itertools\n"
    cleaned_driver = old_driver.replace("import sys, json\n", "").replace("import sys\n", "")
    
    if slug in ["merge-two-sorted-lists", "merge-k-sorted-lists"]:
        if "class ListNode:" not in cleaned_driver:
            cleaned_driver = "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n" + cleaned_driver
    elif slug == "linked-list-cycle":
        if "class ListNode:" not in cleaned_driver:
            cleaned_driver = "class ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n" + cleaned_driver
            
    return imports + cleaned_driver

def update_database():
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        problems = db.query(Problem).all()
        for p in problems:
            slug = p.slug
            if slug in NEW_STARTER_CODES:
                # Assigning a new dictionary forces SQLAlchemy to detect changes
                sc_dict = copy.deepcopy(p.starter_code) if isinstance(p.starter_code, dict) else {}
                sc_dict["python"] = NEW_STARTER_CODES[slug]
                p.starter_code = sc_dict

                dc_dict = copy.deepcopy(p.driver_code) if isinstance(p.driver_code, dict) else {}
                old_driver = dc_dict.get("python", "")
                if old_driver and "from typing import *" not in old_driver:
                    dc_dict["python"] = fix_driver_code(old_driver, slug)
                    p.driver_code = dc_dict
                    
        db.commit()
        print(f"Updated starter and driver codes for {len(problems)} problems in the database.")
    except Exception as e:
        print(f"Error updating DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_database()
