import sys
import os

DESCRIPTIONS = {
    "Group Anagrams": """Given an array of strings strs, group the anagrams together. You can return the answer in any order.

Example 1:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
Explanation: There is no string in strs that can be an anagram of "bat". The strings "nat" and "tan" are anagrams. The strings "ate", "eat", and "tea" are anagrams.

Example 2:
Input: strs = [""]
Output: [[""]]
Explanation: The only string in strs is an empty string, so we return a list containing a list with an empty string.

Example 3:
Input: strs = ["a"]
Output: [["a"]]
Explanation: The only string in strs is "a", so we return a list containing a list with "a".""",

    "Product of Array Except Self": """Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.

Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
Explanation: The product of all elements except nums[0] is 2*3*4=24. The product of all elements except nums[1] is 1*3*4=12. The product of all elements except nums[2] is 1*2*4=8. The product of all elements except nums[3] is 1*2*3=6.

Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
Explanation: The product of all elements except nums[2] is (-1)*1*(-3)*3=9. The product of all elements except any other element is 0 because the array contains a 0.

Example 3:
Input: nums = [0,0]
Output: [0,0]
Explanation: The product of all elements except nums[0] is 0. The product of all elements except nums[1] is 0.""",

    "Longest Palindromic Substring": """Given a string s, return the longest palindromic substring in s.

Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:
Input: s = "cbbd"
Output: "bb"
Explanation: "bb" is the longest palindromic substring.

Example 3:
Input: s = "a"
Output: "a"
Explanation: "a" is the longest palindromic substring.""",

    "Median of Two Sorted Arrays": """Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

Example 1:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.

Example 2:
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.

Example 3:
Input: nums1 = [0,0], nums2 = [0,0]
Output: 0.00000
Explanation: merged array = [0,0,0,0] and median is 0.""",

    "Merge k Sorted Lists": """You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example 1:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6

Example 2:
Input: lists = []
Output: []
Explanation: There are no lists to merge, so the result is an empty list.

Example 3:
Input: lists = [[]]
Output: []
Explanation: There is one list to merge, but it is empty, so the result is an empty list.""",

    "Search in Rotated Sorted Array": """There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

Example 1:
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
Explanation: The target 0 is found at index 4.

Example 2:
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
Explanation: The target 3 is not found in the array.

Example 3:
Input: nums = [1], target = 0
Output: -1
Explanation: The target 0 is not found in the array.""",

    "First Missing Positive": """Given an unsorted integer array nums, return the smallest missing positive integer.

You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.

Example 1:
Input: nums = [1,2,0]
Output: 3
Explanation: The numbers in the range [1,2] are all in the array.

Example 2:
Input: nums = [3,4,-1,1]
Output: 2
Explanation: 1 is in the array but 2 is missing.

Example 3:
Input: nums = [7,8,9,11,12]
Output: 1
Explanation: The smallest positive integer 1 is missing.""",

    "Permutations": """Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

Example 1:
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
Explanation: These are all the possible permutations of the array [1,2,3].

Example 2:
Input: nums = [0,1]
Output: [[0,1],[1,0]]
Explanation: These are all the possible permutations of the array [0,1].

Example 3:
Input: nums = [1]
Output: [[1]]
Explanation: There is only one possible permutation of the array [1].""",

    "Merge Intervals": """Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example 1:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Example 2:
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

Example 3:
Input: intervals = [[1,4],[2,3]]
Output: [[1,4]]
Explanation: Interval [2,3] is completely contained within interval [1,4].""",

    "Jump Game": """You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.

Example 1:
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.

Example 2:
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

Example 3:
Input: nums = [0]
Output: true
Explanation: You are already at the last index.""",
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
