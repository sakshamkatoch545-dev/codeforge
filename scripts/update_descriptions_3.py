import sys
import os

DESCRIPTIONS = {
    "Unique Paths": """There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m-1][n-1]). The robot can only move either down or right at any point in time.

Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

Example 1:
Input: m = 3, n = 7
Output: 28
Explanation: The robot needs to take a total of 8 steps (2 down, 6 right) to reach the bottom-right corner. The number of unique paths is 28.

Example 2:
Input: m = 3, n = 2
Output: 3
Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down

Example 3:
Input: m = 1, n = 1
Output: 1
Explanation: The robot is already at the bottom-right corner.""",

    "Edit Distance": """Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted on a word:
1. Insert a character
2. Delete a character
3. Replace a character

Example 1:
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation: 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (delete 'r')
rose -> ros (delete 'e')

Example 2:
Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation: 
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')

Example 3:
Input: word1 = "", word2 = "a"
Output: 1
Explanation: 
Insert 'a' into word1.""",

    "Word Search": """Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

Example 1:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
Explanation: The word "ABCCED" can be formed by starting at board[0][0] and moving right, down, and left.

Example 2:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true
Explanation: The word "SEE" can be formed by starting at board[1][3] and moving left and down.

Example 3:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false
Explanation: The word "ABCB" cannot be formed without reusing the letter 'B' at board[0][1].""",

    "Best Time to Buy and Sell Stock": """You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

Example 3:
Input: prices = [1,2]
Output: 1
Explanation: Buy on day 1 (price = 1) and sell on day 2 (price = 2), profit = 2-1 = 1.""",

    "Linked List Cycle": """Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.

Return true if there is a cycle in the linked list. Otherwise, return false.

Example 1:
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

Example 2:
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.

Example 3:
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.""",

    "Longest Consecutive Sequence": """Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.

Example 1:
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.

Example 2:
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
Explanation: The longest consecutive elements sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8]. Therefore its length is 9.

Example 3:
Input: nums = []
Output: 0
Explanation: The array is empty, so the longest consecutive elements sequence has length 0."""
}

def apply_descriptions():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()

    for title, desc in DESCRIPTIONS.items():
        import re
        pattern = r'(\{\s*"title":\s*"' + re.escape(title) + r'",.*?)"description": "(.*?)",(.*?)"test_cases":'
        match = re.search(pattern, content, flags=re.DOTALL)
        if match:
            old_desc = match.group(2)
            new_desc = desc.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
            content = content.replace(f'"description": "{old_desc}"', f'"description": "{new_desc}"')
            print(f"Updated {title}")

    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    apply_descriptions()
