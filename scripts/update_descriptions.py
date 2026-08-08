import os
import re

extra_content = {
    "two-sum": "\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9\n- Only one valid answer exists.\n\nFollow-up: Can you come up with an algorithm that is less than O(n^2) time complexity?",
    "reverse-string": "\n\nExample 3:\nInput: s = [\"C\",\"o\",\"d\",\"e\",\"F\",\"o\",\"r\",\"g\",\"e\"]\nOutput: [\"e\",\"g\",\"r\",\"o\",\"F\",\"e\",\"d\",\"o\",\"C\"]\n\nConstraints:\n- 1 <= s.length <= 10^5\n- s[i] is a printable ascii character.\n\nFollow-up: Can you solve it with exactly O(1) extra space?",
    "palindrome-number": "\n\nExample 3:\nInput: x = 10\nOutput: false\nExplanation: Reads 01 from right to left. Therefore it is not a palindrome.\n\nConstraints:\n- -2^31 <= x <= 2^31 - 1\n\nFollow-up: Could you solve it without converting the integer to a string?",
    "valid-parentheses": "\n\nExample 3:\nInput: s = \"(]\"\nOutput: false\n\nExample 4:\nInput: s = \"([)]\"\nOutput: false\n\nConstraints:\n- 1 <= s.length <= 10^4\n- s consists of parentheses only '()[]{}'.",
    "merge-two-sorted-lists": "\n\nExample 2:\nInput: list1 = [], list2 = []\nOutput: []\n\nExample 3:\nInput: list1 = [], list2 = [0]\nOutput: [0]\n\nConstraints:\n- The number of nodes in both lists is in the range [0, 50].\n- -100 <= Node.val <= 100\n- Both list1 and list2 are sorted in non-decreasing order.",
    "maximum-subarray": "\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\n\nConstraints:\n- 1 <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4\n\nFollow-up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.",
    "container-with-most-water": "\n\nExample 2:\nInput: height = [1,1]\nOutput: 1\n\nConstraints:\n- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4",
    "3sum": "\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\nExplanation: The only possible triplet sums up to 0.\n\nConstraints:\n- 3 <= nums.length <= 3000\n- -10^5 <= nums[i] <= 10^5",
    "longest-substring-without-repeating-characters": "\n\nExample 3:\nInput: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.\nNotice that the answer must be a substring, \"pwke\" is a subsequence and not a substring.\n\nConstraints:\n- 0 <= s.length <= 5 * 10^4\n- s consists of English letters, digits, symbols and spaces.",
    "trapping-rain-water": "\n\nConstraints:\n- n == height.length\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5\n\nFollow-up: Can you solve it in O(1) extra space?",
    "n-queens": "\n\nExample 2:\nInput: n = 1\nOutput: [[\"Q\"]]\n\nConstraints:\n- 1 <= n <= 9\n\nFollow-up: Can you optimize your backtracking approach to use bit manipulation for O(1) space?",
    "binary-search": "\n\nExample 2:\nInput: nums = [-1,0,3,5,9,12], target = 2\nOutput: -1\nExplanation: 2 does not exist in nums so return -1\n\nConstraints:\n- 1 <= nums.length <= 10^4\n- -10^4 < nums[i], target < 10^4\n- All the integers in nums are unique.\n- nums is sorted in ascending order.",
    "climbing-stairs": "\n\nConstraints:\n- 1 <= n <= 45\n\nFollow-up: Can you solve it using O(1) space complexity? What about O(log n) time using matrix multiplication?",
    "valid-anagram": "\n\nExample 2:\nInput: s = \"rat\", t = \"car\"\nOutput: false\n\nConstraints:\n- 1 <= s.length, t.length <= 5 * 10^4\n- s and t consist of lowercase English letters.\n\nFollow-up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?",
    "group-anagrams": "\n\nExample 2:\nInput: strs = [\"\"]\nOutput: [[\"\"]]\n\nExample 3:\nInput: strs = [\"a\"]\nOutput: [[\"a\"]]\n\nConstraints:\n- 1 <= strs.length <= 10^4\n- 0 <= strs[i].length <= 100\n- strs[i] consists of lowercase English letters.",
    "product-of-array-except-self": "\n\nExample 2:\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n\nConstraints:\n- 2 <= nums.length <= 10^5\n- -30 <= nums[i] <= 30\n- The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nFollow-up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)",
    "longest-palindromic-substring": "\n\nExample 2:\nInput: s = \"cbbd\"\nOutput: \"bb\"\n\nConstraints:\n- 1 <= s.length <= 1000\n- s consist of only digits and English letters.",
    "median-of-two-sorted-arrays": "\n\nExample 2:\nInput: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n\nConstraints:\n- nums1.length == m\n- nums2.length == n\n- 0 <= m <= 1000\n- 0 <= n <= 1000\n- 1 <= m + n <= 2000\n- -10^6 <= nums1[i], nums2[i] <= 10^6",
    "merge-k-sorted-lists": "\n\nExample 2:\nInput: lists = []\nOutput: []\n\nExample 3:\nInput: lists = [[]]\nOutput: []\n\nConstraints:\n- k == lists.length\n- 0 <= k <= 10^4\n- 0 <= lists[i].length <= 500\n- -10^4 <= lists[i][j] <= 10^4\n- lists[i] is sorted in ascending order.\n- The sum of lists[i].length will not exceed 10^4.",
    "search-in-rotated-sorted-array": "\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\nInput: nums = [1], target = 0\nOutput: -1\n\nConstraints:\n- 1 <= nums.length <= 5000\n- -10^4 <= nums[i] <= 10^4\n- All values of nums are unique.\n- nums is an ascending array that is possibly rotated.\n- -10^4 <= target <= 10^4",
    "first-missing-positive": "\n\nExample 3:\nInput: nums = [7,8,9,11,12]\nOutput: 1\n\nConstraints:\n- 1 <= nums.length <= 10^5\n- -2^31 <= nums[i] <= 2^31 - 1",
    "permutations": "\n\nExample 2:\nInput: nums = [0,1]\nOutput: [[0,1],[1,0]]\n\nExample 3:\nInput: nums = [1]\nOutput: [[1]]\n\nConstraints:\n- 1 <= nums.length <= 6\n- -10 <= nums[i] <= 10\n- All the integers of nums are unique.",
    "merge-intervals": "\n\nExample 2:\nInput: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\nExplanation: Intervals [1,4] and [4,5] are considered overlapping.\n\nConstraints:\n- 1 <= intervals.length <= 10^4\n- intervals[i].length == 2\n- 0 <= starti <= endi <= 10^4",
    "jump-game": "\n\nExample 2:\nInput: nums = [3,2,1,0,4]\nOutput: false\nExplanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.\n\nConstraints:\n- 1 <= nums.length <= 10^4\n- 0 <= nums[i] <= 10^5",
    "unique-paths": "\n\nExample 2:\nInput: m = 3, n = 2\nOutput: 3\nExplanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Down -> Right\n3. Down -> Right -> Down\n\nConstraints:\n- 1 <= m, n <= 100",
    "edit-distance": "\n\nExample 2:\nInput: word1 = \"intention\", word2 = \"execution\"\nOutput: 5\nExplanation: \nintention -> inention (remove 't')\ninention -> enention (replace 'i' with 'e')\nenention -> exention (replace 'n' with 'x')\nexention -> exection (replace 'n' with 'c')\nexection -> execution (insert 'u')\n\nConstraints:\n- 0 <= word1.length, word2.length <= 500\n- word1 and word2 consist of lowercase English letters.",
    "word-search": "\n\nExample 2:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"\nOutput: true\n\nExample 3:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"\nOutput: false\n\nConstraints:\n- m == board.length\n- n = board[i].length\n- 1 <= m, n <= 6\n- 1 <= word.length <= 15\n- board and word consists of only lowercase and uppercase English letters.",
    "best-time-to-buy-and-sell-stock": "\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.\n\nConstraints:\n- 1 <= prices.length <= 10^5\n- 0 <= prices[i] <= 10^4",
    "linked-list-cycle": "\n\nExample 2:\nInput: head = [1,2], pos = 0\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 0th node.\n\nExample 3:\nInput: head = [1], pos = -1\nOutput: false\nExplanation: There is no cycle in the linked list.\n\nConstraints:\n- The number of the nodes in the list is in the range [0, 10^4].\n- -10^5 <= Node.val <= 10^5\n- pos is -1 or a valid index in the linked-list.\n\nFollow up: Can you solve it using O(1) (i.e. constant) memory?",
    "longest-consecutive-sequence": "\n\nExample 2:\nInput: nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9\n\nConstraints:\n- 0 <= nums.length <= 10^5\n- -10^9 <= nums[i] <= 10^9"
}

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# We will read seed_db.py, find the descriptions, and append the extra content to them.
with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

import ast
# To safely replace the description without messing up the file, we can do string replacement
# because each description is a unique string in the file.
# Let's extract the current PROBLEMS_DATA list from the file to know the exact strings
try:
    from scripts.seed_db import PROBLEMS_DATA
except ImportError:
    import sys
    sys.path.append('.')
    from scripts.seed_db import PROBLEMS_DATA

new_content = content
for item in PROBLEMS_DATA:
    slug = item['slug']
    if slug in extra_content:
        old_desc = item['description']
        new_desc = old_desc + extra_content[slug]
        
        # Format for regex to escape properly
        old_desc_escaped = old_desc.replace('\\', '\\\\').replace('\"', '\\\"').replace('\n', '\\n')
        new_desc_escaped = new_desc.replace('\\', '\\\\').replace('\"', '\\\"').replace('\n', '\\n')
        
        # We can just replace the old description in the raw python file content
        # It is stored as "description": "...",
        # Let's use simple string replacement since we have the exact old description
        
        # repr(old_desc) gives '...' or "..."
        # But in the file it's a double-quoted string.
        # Let's build what is in the file:
        in_file_str = '"description": "' + old_desc.replace('\n', '\\n').replace('"', '\\"') + '"'
        new_in_file_str = '"description": "' + new_desc.replace('\n', '\\n').replace('"', '\\"') + '"'
        
        new_content = new_content.replace(in_file_str, new_in_file_str)

with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("seed_db.py updated successfully!")

# Also directly update the database!
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.problem import Problem

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    for item in PROBLEMS_DATA:
        slug = item['slug']
        if slug in extra_content:
            new_desc = item['description'] + extra_content[slug]
            problem = db.query(Problem).filter(Problem.slug == slug).first()
            if problem:
                problem.description = new_desc
    db.commit()
    print("Database updated successfully!")
except Exception as e:
    print(f"Error updating database: {e}")
finally:
    db.close()

