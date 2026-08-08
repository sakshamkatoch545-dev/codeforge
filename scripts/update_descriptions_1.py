import sys
import os

DESCRIPTIONS = {
    "Merge Two Sorted Lists": """You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
Explanation: The first list has elements 1, 2, 4. The second list has elements 1, 3, 4. Splicing them in ascending order yields 1 -> 1 -> 2 -> 3 -> 4 -> 4.

Example 2:
Input: list1 = [], list2 = []
Output: []
Explanation: Both lists are empty, so the merged list is also empty.

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]
Explanation: The first list is empty, so we just return the second list.""",

    "Maximum Subarray": """Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 5 + 4 + (-1) + 7 + 8 = 23.""",

    "Container With Most Water": """You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49 (height 7 * width 7).

Example 2:
Input: height = [1,1]
Output: 1
Explanation: The container formed by the lines at index 0 and 1 has height 1 and width 1, yielding an area of 1.

Example 3:
Input: height = [4,3,2,1,4]
Output: 16
Explanation: The lines at index 0 and 4 form a container of height 4 and width 4, yielding an area of 16.""",

    "3Sum": """Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].

Example 2:
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.""",

    "Longest Substring Without Repeating Characters": """Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.""",

    "Trapping Rain Water": """Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example 1:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.

Example 2:
Input: height = [4,2,0,3,2,5]
Output: 9
Explanation: The elevation map is represented by array [4,2,0,3,2,5]. In this case, 9 units of rain water are being trapped.

Example 3:
Input: height = [1,0,1]
Output: 1
Explanation: The elevation map is represented by array [1,0,1]. In this case, 1 unit of rain water is trapped between the two bars.""",

    "N-Queens": """The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.

Example 1:
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
Explanation: There exist two distinct solutions to the 4-queens puzzle.

Example 2:
Input: n = 1
Output: [["Q"]]
Explanation: There exists one distinct solution to the 1-queens puzzle.

Example 3:
Input: n = 2
Output: []
Explanation: There are no distinct solutions to the 2-queens puzzle.""",

    "Binary Search": """Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4.

Example 2:
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1.

Example 3:
Input: nums = [5], target = 5
Output: 0
Explanation: 5 exists in nums and its index is 0.""",

    "Climbing Stairs": """You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top:
1. 1 step + 1 step
2. 2 steps

Example 2:
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top:
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

Example 3:
Input: n = 4
Output: 5
Explanation: There are five ways to climb to the top:
1. 1+1+1+1
2. 1+1+2
3. 1+2+1
4. 2+1+1
5. 2+2""",

    "Valid Anagram": """Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Example 1:
Input: s = "anagram", t = "nagaram"
Output: true
Explanation: The string "nagaram" is an anagram of "anagram".

Example 2:
Input: s = "rat", t = "car"
Output: false
Explanation: The string "car" is not an anagram of "rat".

Example 3:
Input: s = "a", t = "ab"
Output: false
Explanation: The strings have different lengths, so they cannot be anagrams.""",
}

def apply_descriptions():
    with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
        content = f.read()

    for title, desc in DESCRIPTIONS.items():
        import re
        # Find the block for this title
        pattern = r'(\{\s*"title":\s*"' + re.escape(title) + r'",.*?)"description": "(.*?)",(.*?)"test_cases":'
        match = re.search(pattern, content, flags=re.DOTALL)
        if match:
            old_desc = match.group(2)
            # escape for json string
            new_desc = desc.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
            content = content.replace(f'"description": "{old_desc}"', f'"description": "{new_desc}"')
            print(f"Updated {title}")

    with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    apply_descriptions()
