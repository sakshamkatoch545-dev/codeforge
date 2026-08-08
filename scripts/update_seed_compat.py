import os
import sys
import json
import re

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# We use the same NEW_STARTER_CODES dict
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

try:
    from scripts.seed_db import PROBLEMS_DATA
except ImportError:
    sys.path.append('.')
    from scripts.seed_db import PROBLEMS_DATA

def main():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()
        
    for item in PROBLEMS_DATA:
        slug = item["slug"]
        if slug in NEW_STARTER_CODES:
            old_starter = item.get("starter_code", {}).get("python", "")
            old_driver = item.get("driver_code", {}).get("python", "")
            
            new_starter = NEW_STARTER_CODES[slug]
            new_driver = fix_driver_code(old_driver, slug)
            
            # Form json strings exactly as they are in the file
            # Wait, json.dumps creates backslashes correctly, but seed_db.py is python file.
            # So double quotes might be escaped.
            old_starter_str = json.dumps({"python": old_starter})
            new_starter_str = json.dumps({"python": new_starter})
            
            old_driver_str = json.dumps({"python": old_driver})
            new_driver_str = json.dumps({"python": new_driver})
            
            # Since seed_db.py contains python dictionaries, it uses standard single or double quotes, 
            # and might have spaces after commas. 
            # In our file, it says: "starter_code": {"python": "class Solution:\n    def twoSum(self, nums, target):\n        pass"},
            
            old_sc_pattern = '"starter_code": {"python": ' + json.dumps(old_starter) + '}'
            new_sc_pattern = '"starter_code": {"python": ' + json.dumps(new_starter) + '}'
            content = content.replace(old_sc_pattern, new_sc_pattern)
            
            old_dc_pattern = '"driver_code": {"python": ' + json.dumps(old_driver) + '}'
            new_dc_pattern = '"driver_code": {"python": ' + json.dumps(new_driver) + '}'
            content = content.replace(old_dc_pattern, new_dc_pattern)
            
    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("seed_db.py updated with LeetCode compat!")

if __name__ == "__main__":
    main()
