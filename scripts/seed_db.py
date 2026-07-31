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
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]",
        "test_cases": [
            {"input": "[2,7,11,15]\n9\n", "output": "[0,1]\n", "hidden": False},
            {"input": "[3,2,4]\n6\n", "output": "[1,2]\n", "hidden": True}
        ]
    },
    {
        "title": "Reverse String",
        "slug": "reverse-string",
        "difficulty": DifficultyEnum.EASY,
        "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\nExample 1:\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
        "test_cases": [
            {"input": "hello\n", "output": "olleh\n", "hidden": False},
            {"input": "CodeForge\n", "output": "egroFedoC\n", "hidden": True}
        ]
    },
    {
        "title": "Palindrome Number",
        "slug": "palindrome-number",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\n\nExample 1:\nInput: x = 121\nOutput: true\n\nExample 2:\nInput: x = -121\nOutput: false\nExplanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
        "test_cases": [
            {"input": "121\n", "output": "true\n", "hidden": False},
            {"input": "-121\n", "output": "false\n", "hidden": True}
        ]
    },
    {
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample 1:\nInput: s = \"()[]{}\"\nOutput: true\n\nExample 2:\nInput: s = \"(]\"\nOutput: false",
        "test_cases": [
            {"input": "()[]{}\n", "output": "true\n", "hidden": False},
            {"input": "(]\n", "output": "false\n", "hidden": True}
        ]
    },
    {
        "title": "Merge Two Sorted Lists",
        "slug": "merge-two-sorted-lists",
        "difficulty": DifficultyEnum.EASY,
        "description": "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample 1:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
        "test_cases": [
            {"input": "1 2 4\n1 3 4\n", "output": "1 1 2 3 4 4\n", "hidden": False}
        ]
    },
    {
        "title": "Maximum Subarray",
        "slug": "maximum-subarray",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1",
        "test_cases": [
            {"input": "-2 1 -3 4 -1 2 1 -5 4\n", "output": "6\n", "hidden": False},
            {"input": "5 4 -1 7 8\n", "output": "23\n", "hidden": True}
        ]
    },
    {
        "title": "Container With Most Water",
        "slug": "container-with-most-water",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49",
        "test_cases": [
            {"input": "1 8 6 2 5 4 8 3 7\n", "output": "49\n", "hidden": False}
        ]
    },
    {
        "title": "3Sum",
        "slug": "3sum",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]",
        "test_cases": [
            {"input": "-1 0 1 2 -1 -4\n", "output": "[[-1,-1,2],[-1,0,1]]\n", "hidden": False}
        ]
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given a string s, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1",
        "test_cases": [
            {"input": "abcabcbb\n", "output": "3\n", "hidden": False},
            {"input": "bbbbb\n", "output": "1\n", "hidden": True}
        ]
    },
    {
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "difficulty": DifficultyEnum.HARD,
        "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nExample 1:\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n\nExample 2:\nInput: height = [4,2,0,3,2,5]\nOutput: 9",
        "test_cases": [
            {"input": "0 1 0 2 1 0 1 3 2 1 2 1\n", "output": "6\n", "hidden": False}
        ]
    },
    {
        "title": "N-Queens",
        "slug": "n-queens",
        "difficulty": DifficultyEnum.HARD,
        "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nExample 1:\nInput: n = 4\nOutput: [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
        "test_cases": [
            {"input": "4\n", "output": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\n", "hidden": False}
        ]
    },
    {
        "title": "Binary Search",
        "slug": "binary-search",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4",
        "test_cases": [
            {"input": "-1 0 3 5 9 12\n9\n", "output": "4\n", "hidden": False}
        ]
    },
    {
        "title": "Climbing Stairs",
        "slug": "climbing-stairs",
        "difficulty": DifficultyEnum.EASY,
        "description": "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2 (1 step + 1 step, or 2 steps)\n\nExample 2:\nInput: n = 3\nOutput: 3 (1+1+1, 1+2, 2+1)",
        "test_cases": [
            {"input": "2\n", "output": "2\n", "hidden": False},
            {"input": "3\n", "output": "3\n", "hidden": True}
        ]
    },
    {
        "title": "Valid Anagram",
        "slug": "valid-anagram",
        "difficulty": DifficultyEnum.EASY,
        "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\nExample 1:\nInput: s = \"anagram\", t = \"nagaram\"\nOutput: true",
        "test_cases": [
            {"input": "anagram\nnagaram\n", "output": "true\n", "hidden": False}
        ]
    },
    {
        "title": "Group Anagrams",
        "slug": "group-anagrams",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nExample 1:\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
        "test_cases": [
            {"input": "eat tea tan ate nat bat\n", "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n", "hidden": False}
        ]
    },
    {
        "title": "Product of Array Except Self",
        "slug": "product-of-array-except-self",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.\n\nExample 1:\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]",
        "test_cases": [
            {"input": "1 2 3 4\n", "output": "24 12 8 6\n", "hidden": False}
        ]
    },
    {
        "title": "Longest Palindromic Substring",
        "slug": "longest-palindromic-substring",
        "difficulty": DifficultyEnum.MEDIUM,
        "description": "Given a string s, return the longest palindromic substring in s.\n\nExample 1:\nInput: s = \"babad\"\nOutput: \"bab\"\nExplanation: \"aba\" is also a valid answer.",
        "test_cases": [
            {"input": "babad\n", "output": "bab\n", "hidden": False}
        ]
    },
    {
        "title": "Median of Two Sorted Arrays",
        "slug": "median-of-two-sorted-arrays",
        "difficulty": DifficultyEnum.HARD,
        "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\nExample 1:\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000",
        "test_cases": [
            {"input": "1 3\n2\n", "output": "2.00000\n", "hidden": False}
        ]
    }
]

def seed_users(db):
    print("Seeding users...")
    saksham_user = db.query(User).filter(User.username == "saksham").first()
    if not saksham_user:
        saksham_user = User(
            email="sakshamkatoch545@gmail.com",
            username="saksham",
            hashed_password=get_password_hash("saksham@123"),
            is_active=True,
            is_superuser=True  # Making superuser since it's his platform
        )
        db.add(saksham_user)
        db.commit()

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
