import re
import json

def main():
    file_path = 'scripts/seed_db.py'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the original injection point for real problems, let's remove everything after "Move Zeroes" and recreate
    # We will just parse the list of problems using a simpler approach or just replace the last 7 problems.
    # To be safe, we will just use a regex or string find to replace from "Move Zeroes" to the end of PROBLEMS_DATA
    idx = content.find('        "title": "Move Zeroes"')
    if idx != -1:
        start_idx = content.rfind('{', 0, idx)
        end_idx = content.find(']\n\ndef seed_users(db):')
        if end_idx == -1:
            end_idx = content.find(']\n\n\ndef seed_users(db):')
        if start_idx != -1 and end_idx != -1:
            content = content[:start_idx] + content[end_idx:]

    # Now let's define 7 real problems with 3 examples each
    real_problems = [
        {
            "title": "Move Zeroes",
            "slug": "move-zeroes",
            "difficulty": "DifficultyEnum.EASY",
            "description": "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.\\n\\nNote that you must do this in-place without making a copy of the array.\\n\\nExample 1:\\nInput: nums = [0,1,0,3,12]\\nOutput: [1,3,12,0,0]\\n\\nExample 2:\\nInput: nums = [0]\\nOutput: [0]\\n\\nExample 3:\\nInput: nums = [1,0,2,0,3]\\nOutput: [1,2,3,0,0]\\n\\nConstraints:\\n- 1 <= nums.length <= 10^4",
            "starter_code": {"python": "class Solution:\\n    def moveZeroes(self, nums: List[int]) -> None:\\n        \\\"\\\"\\\"\\n        Do not return anything, modify nums in-place instead.\\n        \\\"\\\"\\\"\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    nums = json.loads(lines[0]) if lines else []\\n    Solution().moveZeroes(nums)\\n    print(json.dumps(nums).replace(' ', ''))"},
            "test_cases": [
                {"input": "[0,1,0,3,12]\\n", "output": "[1,3,12,0,0]\\n", "hidden": False},
                {"input": "[0]\\n", "output": "[0]\\n", "hidden": False},
                {"input": "[1,0,2,0,3]\\n", "output": "[1,2,3,0,0]\\n", "hidden": True}
            ]
        },
        {
            "title": "Contains Duplicate",
            "slug": "contains-duplicate",
            "difficulty": "DifficultyEnum.EASY",
            "description": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\\n\\nExample 1:\\nInput: nums = [1,2,3,1]\\nOutput: true\\n\\nExample 2:\\nInput: nums = [1,2,3,4]\\nOutput: false\\n\\nExample 3:\\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\\nOutput: true\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5",
            "starter_code": {"python": "class Solution:\\n    def containsDuplicate(self, nums: List[int]) -> bool:\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    nums = json.loads(lines[0]) if lines else []\\n    print('true' if Solution().containsDuplicate(nums) else 'false')"},
            "test_cases": [
                {"input": "[1,2,3,1]\\n", "output": "true\\n", "hidden": False},
                {"input": "[1,2,3,4]\\n", "output": "false\\n", "hidden": False},
                {"input": "[1,1,1,3,3,4,3,2,4,2]\\n", "output": "true\\n", "hidden": True}
            ]
        },
        {
            "title": "Single Number",
            "slug": "single-number",
            "difficulty": "DifficultyEnum.EASY",
            "description": "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\\n\\nYou must implement a solution with a linear runtime complexity and use only constant extra space.\\n\\nExample 1:\\nInput: nums = [2,2,1]\\nOutput: 1\\n\\nExample 2:\\nInput: nums = [4,1,2,1,2]\\nOutput: 4\\n\\nExample 3:\\nInput: nums = [1]\\nOutput: 1\\n\\nConstraints:\\n- 1 <= nums.length <= 3 * 10^4",
            "starter_code": {"python": "class Solution:\\n    def singleNumber(self, nums: List[int]) -> int:\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    nums = json.loads(lines[0]) if lines else []\\n    print(Solution().singleNumber(nums))"},
            "test_cases": [
                {"input": "[2,2,1]\\n", "output": "1\\n", "hidden": False},
                {"input": "[4,1,2,1,2]\\n", "output": "4\\n", "hidden": False},
                {"input": "[1]\\n", "output": "1\\n", "hidden": True}
            ]
        },
        {
            "title": "Missing Number",
            "slug": "missing-number",
            "difficulty": "DifficultyEnum.EASY",
            "description": "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.\\n\\nExample 1:\\nInput: nums = [3,0,1]\\nOutput: 2\\n\\nExample 2:\\nInput: nums = [0,1]\\nOutput: 2\\n\\nExample 3:\\nInput: nums = [9,6,4,2,3,5,7,0,1]\\nOutput: 8\\n\\nConstraints:\\n- n == nums.length\\n- 1 <= n <= 10^4",
            "starter_code": {"python": "class Solution:\\n    def missingNumber(self, nums: List[int]) -> int:\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    nums = json.loads(lines[0]) if lines else []\\n    print(Solution().missingNumber(nums))"},
            "test_cases": [
                {"input": "[3,0,1]\\n", "output": "2\\n", "hidden": False},
                {"input": "[0,1]\\n", "output": "2\\n", "hidden": False},
                {"input": "[9,6,4,2,3,5,7,0,1]\\n", "output": "8\\n", "hidden": True}
            ]
        },
        {
            "title": "Valid Palindrome",
            "slug": "valid-palindrome-str",
            "difficulty": "DifficultyEnum.EASY",
            "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\\n\\nGiven a string s, return true if it is a palindrome, or false otherwise.\\n\\nExample 1:\\nInput: s = \\\"A man, a plan, a canal: Panama\\\"\\nOutput: true\\n\\nExample 2:\\nInput: s = \\\"race a car\\\"\\nOutput: false\\n\\nExample 3:\\nInput: s = \\\" \\\"\\nOutput: true\\n\\nConstraints:\\n- 1 <= s.length <= 2 * 10^5",
            "starter_code": {"python": "class Solution:\\n    def isPalindrome(self, s: str) -> bool:\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    s = lines[0] if lines else ''\\n    print('true' if Solution().isPalindrome(s) else 'false')"},
            "test_cases": [
                {"input": "A man, a plan, a canal: Panama\\n", "output": "true\\n", "hidden": False},
                {"input": "race a car\\n", "output": "false\\n", "hidden": False},
                {"input": " \\n", "output": "true\\n", "hidden": True}
            ]
        },
        {
            "title": "Fibonacci Number",
            "slug": "fibonacci-number",
            "difficulty": "DifficultyEnum.EASY",
            "description": "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\\n\\nGiven n, calculate F(n).\\n\\nExample 1:\\nInput: n = 2\\nOutput: 1\\n\\nExample 2:\\nInput: n = 3\\nOutput: 2\\n\\nExample 3:\\nInput: n = 4\\nOutput: 3\\n\\nConstraints:\\n- 0 <= n <= 30",
            "starter_code": {"python": "class Solution:\\n    def fib(self, n: int) -> int:\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    n = int(lines[0]) if lines else 0\\n    print(Solution().fib(n))"},
            "test_cases": [
                {"input": "2\\n", "output": "1\\n", "hidden": False},
                {"input": "3\\n", "output": "2\\n", "hidden": False},
                {"input": "4\\n", "output": "3\\n", "hidden": True}
            ]
        },
        {
            "title": "Find Peak Element",
            "slug": "find-peak-element",
            "difficulty": "DifficultyEnum.MEDIUM",
            "description": "A peak element is an element that is strictly greater than its neighbors.\\n\\nGiven a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\\n\\nYou must write an algorithm that runs in O(log n) time.\\n\\nExample 1:\\nInput: nums = [1,2,3,1]\\nOutput: 2\\n\\nExample 2:\\nInput: nums = [1,2,1,3,5,6,4]\\nOutput: 5\\n\\nExample 3:\\nInput: nums = [1,2]\\nOutput: 1\\n\\nConstraints:\\n- 1 <= nums.length <= 1000",
            "starter_code": {"python": "class Solution:\\n    def findPeakElement(self, nums: List[int]) -> int:\\n        pass"},
            "driver_code": {"python": "import sys, json\\nfrom typing import *\\nimport collections\\nimport math\\nimport itertools\\n{USER_CODE}\\nif __name__ == '__main__':\\n    lines = sys.stdin.read().splitlines()\\n    nums = json.loads(lines[0]) if lines else []\\n    print(Solution().findPeakElement(nums))"},
            "test_cases": [
                {"input": "[1,2,3,1]\\n", "output": "2\\n", "hidden": False},
                {"input": "[1,2,1,3,5,6,4]\\n", "output": "5\\n", "hidden": False},
                {"input": "[1,2]\\n", "output": "1\\n", "hidden": True}
            ]
        }
    ]

    formatted_problems = []
    for p in real_problems:
        q = f'''    {{
        "title": "{p['title']}",
        "slug": "{p['slug']}",
        "difficulty": {p['difficulty']},
        "description": "{p['description']}",
        "starter_code": {json.dumps(p['starter_code'])},
        "driver_code": {json.dumps(p['driver_code'])},
        "test_cases": [
            {{"input": "{p['test_cases'][0]['input'].replace('\\n', '\\\\n')}", "output": "{p['test_cases'][0]['output'].replace('\\n', '\\\\n')}", "hidden": False}},
            {{"input": "{p['test_cases'][1]['input'].replace('\\n', '\\\\n')}", "output": "{p['test_cases'][1]['output'].replace('\\n', '\\\\n')}", "hidden": False}},
            {{"input": "{p['test_cases'][2]['input'].replace('\\n', '\\\\n')}", "output": "{p['test_cases'][2]['output'].replace('\\n', '\\\\n')}", "hidden": True}}
        ]
    }}'''
        formatted_problems.append(q)

    idx = content.find(']\n\ndef seed_users(db):')
    if idx == -1:
        idx = content.find(']\n\n\ndef seed_users(db):')
    
    insertion_str = ",\n" + ",\n".join(formatted_problems) + "\n"
    content = content[:idx] + insertion_str + content[idx:]
    content = content.replace('}\n,\n    ,\n    {', '}\n,\n    {')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Added 3rd example and updated testcases successfully.")

if __name__ == '__main__':
    main()
