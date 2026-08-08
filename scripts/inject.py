extra_code = r"""
EXTRA_TESTCASES = {
    # ── 1. Two Sum ──────────────────────────────────────────────────────────
    'two-sum': [
        {'input': '[3,3]\n6\n',                        'output': '[0,1]\n',   'hidden': True},
        {'input': '[2,5,5,11]\n10\n',                  'output': '[1,2]\n',   'hidden': True},
        {'input': '[-1,-2,-3,-4,-5]\n-8\n',            'output': '[2,4]\n',   'hidden': True},
        {'input': '[0,4,3,0]\n0\n',                    'output': '[0,3]\n',   'hidden': True},
        {'input': '[1,2,3,4,5,6,7,8,9,10]\n19\n',      'output': '[8,9]\n',   'hidden': True},
        {'input': '[100,200,300,400]\n500\n',           'output': '[0,3]\n',   'hidden': True},
        {'input': '[1,3,4,2]\n6\n',                    'output': '[2,3]\n',   'hidden': True},
    ],

    # ── 2. Reverse String ───────────────────────────────────────────────────
    'reverse-string': [
        {'input': 'a\n',         'output': 'a\n',         'hidden': True},
        {'input': 'ab\n',        'output': 'ba\n',        'hidden': True},
        {'input': 'racecar\n',   'output': 'racecar\n',   'hidden': True},
        {'input': 'OpenAI\n',    'output': 'IAnepO\n',    'hidden': True},
        {'input': 'Hello\n',     'output': 'olleH\n',     'hidden': True},
        {'input': '12345\n',     'output': '54321\n',     'hidden': True},
        {'input': 'abcde\n',     'output': 'edcba\n',     'hidden': True},
        {'input': 'z\n',         'output': 'z\n',         'hidden': True},
        {'input': 'Python\n',    'output': 'nohtyP\n',    'hidden': True},
        {'input': 'abba\n',      'output': 'abba\n',      'hidden': True},
    ],

    # ── 3. Palindrome Number ────────────────────────────────────────────────
    'palindrome-number': [
        {'input': '0\n',         'output': 'true\n',  'hidden': True},
        {'input': '10\n',        'output': 'false\n', 'hidden': True},
        {'input': '123454321\n', 'output': 'true\n',  'hidden': True},
        {'input': '-121\n',      'output': 'false\n', 'hidden': True},
        {'input': '1221\n',      'output': 'true\n',  'hidden': True},
        {'input': '11\n',        'output': 'true\n',  'hidden': True},
        {'input': '1000021\n',   'output': 'false\n', 'hidden': True},
        {'input': '9999999\n',   'output': 'true\n',  'hidden': True},
        {'input': '12321\n',     'output': 'true\n',  'hidden': True},
        {'input': '123\n',       'output': 'false\n', 'hidden': True},
    ],

    # ── 4. Valid Parentheses ────────────────────────────────────────────────
    'valid-parentheses': [
        {'input': '((()))\n',    'output': 'true\n',  'hidden': True},
        {'input': '([)]\n',      'output': 'false\n', 'hidden': True},
        {'input': '{[]}\n',      'output': 'true\n',  'hidden': True},
        {'input': '(\n',         'output': 'false\n', 'hidden': True},
        {'input': ')\n',         'output': 'false\n', 'hidden': True},
        {'input': '{{}}\n',      'output': 'true\n',  'hidden': True},
        {'input': '[({})]()\n',  'output': 'true\n',  'hidden': True},
        {'input': '[({}])(\n',   'output': 'false\n', 'hidden': True},
        {'input': '[]\n',        'output': 'true\n',  'hidden': True},
        {'input': '}{[]\n',      'output': 'false\n', 'hidden': True},
    ],

    # ── 5. Merge Two Sorted Lists ───────────────────────────────────────────
    'merge-two-sorted-lists': [
        {'input': '\n\n',       'output': '\n',          'hidden': True},
        {'input': '\n0\n',      'output': '0\n',         'hidden': True},
        {'input': '2\n1\n',     'output': '1 2\n',       'hidden': True},
        {'input': '1 3\n2 4\n', 'output': '1 2 3 4\n',  'hidden': True},
        {'input': '1\n\n',      'output': '1\n',         'hidden': True},
        {'input': '1 2 4\n1 3 4\n', 'output': '1 1 2 3 4 4\n', 'hidden': True},
        {'input': '5 10 15\n1 6 20\n', 'output': '1 5 6 10 15 20\n', 'hidden': True},
        {'input': '0 5\n0 5\n', 'output': '0 0 5 5\n',  'hidden': True},
    ],

    # ── 6. Maximum Subarray ─────────────────────────────────────────────────
    'maximum-subarray': [
        {'input': '-1\n',                   'output': '-1\n',  'hidden': True},
        {'input': '-2 -1\n',                'output': '-1\n',  'hidden': True},
        {'input': '1 2 3 4 5\n',            'output': '15\n',  'hidden': True},
        {'input': '5 4 -1 7 8\n',           'output': '23\n',  'hidden': True},
        {'input': '-2 1\n',                 'output': '1\n',   'hidden': True},
        {'input': '1 -1 1\n',               'output': '1\n',   'hidden': True},
        {'input': '0 0 0\n',                'output': '0\n',   'hidden': True},
        {'input': '-5 -4 -3\n',             'output': '-3\n',  'hidden': True},
        {'input': '2 -1 2 3 -9 1\n',        'output': '6\n',   'hidden': True},
        {'input': '-2 1 -3 4 -1 2 1 -5 4\n','output': '6\n',  'hidden': True},
    ],

    # ── 7. Container With Most Water ────────────────────────────────────────
    'container-with-most-water': [
        {'input': '1 1\n',                   'output': '1\n',   'hidden': True},
        {'input': '1 2 1\n',                 'output': '2\n',   'hidden': True},
        {'input': '10 9 8 7 6 5 4 3 2 1\n',  'output': '25\n',  'hidden': True},
        {'input': '1 8 6 2 5 4 8 3 7\n',     'output': '49\n',  'hidden': True},
        {'input': '4 3 2 1 4\n',             'output': '16\n',  'hidden': True},
        {'input': '2 3 4 5 18 17 6\n',       'output': '17\n',  'hidden': True},
        {'input': '1 2 4 3\n',               'output': '4\n',   'hidden': True},
        {'input': '6 6\n',                   'output': '6\n',   'hidden': True},
        {'input': '3 1 2 4 0 1 3 2\n',       'output': '18\n',  'hidden': True},
        {'input': '1 3 2 5 25 24 5\n',       'output': '24\n',  'hidden': True},
    ],

    # ── 8. 3Sum ─────────────────────────────────────────────────────────────
    '3sum': [
        {'input': '0 1 1\n',      'output': '[]\n',           'hidden': True},
        {'input': '0 0 0\n',      'output': '[[0,0,0]]\n',   'hidden': True},
        {'input': '-2 0 0 2 2\n', 'output': '[[-2,0,2]]\n',  'hidden': True},
        {'input': '-4 -1 -1 0 1 2\n', 'output': '[[-1,-1,2],[-1,0,1]]\n', 'hidden': True},
        {'input': '0 0 0 0\n',    'output': '[[0,0,0]]\n',   'hidden': True},
        {'input': '-5 0 5\n',     'output': '[[-5,0,5]]\n',  'hidden': True},
        {'input': '1 2 3\n',      'output': '[]\n',           'hidden': True},
        {'input': '-2 -1 0 1 2\n', 'output': '[[-2,0,2],[-1,0,1]]\n', 'hidden': True},
    ],

    # ── 9. Longest Substring Without Repeating Characters ──────────────────
    'longest-substring-without-repeating-characters': [
        {'input': '\n',       'output': '0\n', 'hidden': True},
        {'input': ' \n',      'output': '1\n', 'hidden': True},
        {'input': 'au\n',     'output': '2\n', 'hidden': True},
        {'input': 'dvdf\n',   'output': '3\n', 'hidden': True},
        {'input': 'aab\n',    'output': '2\n', 'hidden': True},
        {'input': 'pwwkew\n', 'output': '3\n', 'hidden': True},
        {'input': 'abcabcbb\n','output': '3\n','hidden': True},
        {'input': 'bbbbb\n',  'output': '1\n', 'hidden': True},
        {'input': 'tmmzuxt\n','output': '5\n', 'hidden': True},
        {'input': 'abcdef\n', 'output': '6\n', 'hidden': True},
    ],

    # ── 10. Trapping Rain Water ─────────────────────────────────────────────
    'trapping-rain-water': [
        {'input': '0\n',              'output': '0\n',  'hidden': True},
        {'input': '2 0 2\n',          'output': '2\n',  'hidden': True},
        {'input': '4 2 3\n',          'output': '1\n',  'hidden': True},
        {'input': '3 0 2 0 4\n',      'output': '7\n',  'hidden': True},
        {'input': '0 1 0 2 1 0 1 3 2 1 2 1\n', 'output': '6\n', 'hidden': True},
        {'input': '4 2 0 3 2 5\n',    'output': '9\n',  'hidden': True},
        {'input': '1 0 1\n',          'output': '1\n',  'hidden': True},
        {'input': '0 0 0 0\n',        'output': '0\n',  'hidden': True},
        {'input': '5 2 1 2 1 5\n',    'output': '14\n', 'hidden': True},
        {'input': '6 4 2 0 3 2 0 3 1 4 5 3 2 7 5 3 0 1 2 1 3 4 6 8 1 3\n', 'output': '83\n', 'hidden': True},
    ],

    # ── 11. N-Queens ────────────────────────────────────────────────────────
    'n-queens': [
        {'input': '1\n', 'output': '[["Q"]]\n', 'hidden': True},
        {'input': '2\n', 'output': '[]\n',       'hidden': True},
        {'input': '3\n', 'output': '[]\n',       'hidden': True},
        {'input': '5\n', 'output': '[[".Q...","...Q.","Q....","..Q..","....Q"],["..Q..","Q....","...Q.","..Q..","Q...."],[".Q...","...Q.","Q....","..Q..","....Q"],["..Q..","....Q",".Q...","...Q.","Q...."],["...Q.",".Q...","....Q","..Q..","Q...."],["....Q","..Q..",".Q...","...Q.","Q...."],["....Q","..Q..","Q....","...Q.",".Q..."],["...Q.","Q....","..Q..","....Q",".Q..."],["..Q..","....Q",".Q...","...Q.","Q...."],["Q....","..Q..","....Q",".Q...","...Q."]]\n', 'hidden': True},
    ],

    # ── 12. Binary Search ───────────────────────────────────────────────────
    'binary-search': [
        {'input': '5\n5\n',                         'output': '0\n',  'hidden': True},
        {'input': '2 5\n0\n',                        'output': '-1\n', 'hidden': True},
        {'input': '2 5\n2\n',                        'output': '0\n',  'hidden': True},
        {'input': '2 5\n5\n',                        'output': '1\n',  'hidden': True},
        {'input': '-1 0 3 5 9 12\n9\n',             'output': '4\n',  'hidden': True},
        {'input': '-1 0 3 5 9 12\n2\n',             'output': '-1\n', 'hidden': True},
        {'input': '1 3 5 7 9 11 13\n7\n',           'output': '3\n',  'hidden': True},
        {'input': '1 3 5 7 9 11 13\n14\n',          'output': '-1\n', 'hidden': True},
        {'input': '0 1 2 3 4 5 6 7 8 9 10\n0\n',   'output': '0\n',  'hidden': True},
        {'input': '0 1 2 3 4 5 6 7 8 9 10\n10\n',  'output': '10\n', 'hidden': True},
    ],

    # ── 13. Climbing Stairs ─────────────────────────────────────────────────
    'climbing-stairs': [
        {'input': '1\n',  'output': '1\n',   'hidden': True},
        {'input': '4\n',  'output': '5\n',   'hidden': True},
        {'input': '5\n',  'output': '8\n',   'hidden': True},
        {'input': '6\n',  'output': '13\n',  'hidden': True},
        {'input': '7\n',  'output': '21\n',  'hidden': True},
        {'input': '8\n',  'output': '34\n',  'hidden': True},
        {'input': '10\n', 'output': '89\n',  'hidden': True},
        {'input': '15\n', 'output': '987\n', 'hidden': True},
        {'input': '20\n', 'output': '10946\n','hidden': True},
        {'input': '30\n', 'output': '1346269\n','hidden': True},
    ],

    # ── 14. Valid Anagram ───────────────────────────────────────────────────
    'valid-anagram': [
        {'input': 'rat\ncar\n',      'output': 'false\n', 'hidden': True},
        {'input': 'a\na\n',          'output': 'true\n',  'hidden': True},
        {'input': 'a\nb\n',          'output': 'false\n', 'hidden': True},
        {'input': 'listen\nsilent\n','output': 'true\n',  'hidden': True},
        {'input': 'hello\nworld\n',  'output': 'false\n', 'hidden': True},
        {'input': 'ab\nab\n',        'output': 'true\n',  'hidden': True},
        {'input': 'ab\nba\n',        'output': 'true\n',  'hidden': True},
        {'input': 'abc\ncba\n',      'output': 'true\n',  'hidden': True},
        {'input': 'aabc\naacb\n',    'output': 'true\n',  'hidden': True},
        {'input': 'aab\naba\n',      'output': 'true\n',  'hidden': True},
    ],

    # ── 15. Group Anagrams ──────────────────────────────────────────────────
    'group-anagrams': [
        {'input': '\n',    'output': '[[""]]\n', 'hidden': True},
        {'input': 'a\n',   'output': '[["a"]]\n','hidden': True},
        {'input': 'a b\n', 'output': '[["a"],["b"]]\n', 'hidden': True},
    ],

    # ── 16. Product of Array Except Self ────────────────────────────────────
    'product-of-array-except-self': [
        {'input': '-1 1 0 -3 3\n', 'output': '0 0 9 0 0\n',  'hidden': True},
        {'input': '0 0\n',         'output': '0 0\n',          'hidden': True},
        {'input': '1 2 3 4\n',     'output': '24 12 8 6\n',   'hidden': True},
        {'input': '2 3 4 5\n',     'output': '60 40 30 24\n', 'hidden': True},
        {'input': '1 0\n',         'output': '0 1\n',          'hidden': True},
        {'input': '-1 -2 -3 -4\n', 'output': '-24 -12 -8 -6\n','hidden': True},
        {'input': '5 5\n',         'output': '5 5\n',          'hidden': True},
        {'input': '1 1 1 1 1\n',   'output': '1 1 1 1 1\n',   'hidden': True},
        {'input': '10 3 5 6 2\n',  'output': '180 600 360 300 900\n', 'hidden': True},
        {'input': '2 2 2\n',       'output': '4 4 4\n',        'hidden': True},
    ],

    # ── 17. Longest Palindromic Substring ───────────────────────────────────
    'longest-palindromic-substring': [
        {'input': 'cbbd\n',   'output': 'bb\n',      'hidden': True},
        {'input': 'a\n',      'output': 'a\n',        'hidden': True},
        {'input': 'ac\n',     'output': 'a\n',        'hidden': True},
        {'input': 'aaaa\n',   'output': 'aaaa\n',    'hidden': True},
        {'input': 'abcba\n',  'output': 'abcba\n',   'hidden': True},
        {'input': 'racecar\n','output': 'racecar\n', 'hidden': True},
        {'input': 'abba\n',   'output': 'abba\n',    'hidden': True},
        {'input': 'bananas\n','output': 'anana\n',   'hidden': True},
        {'input': 'aacabdkacaa\n', 'output': 'aca\n', 'hidden': True},
        {'input': 'xaabacxcabaax\n', 'output': 'xaabacxcabaax\n', 'hidden': True},
    ],

    # ── 18. Median of Two Sorted Arrays ─────────────────────────────────────
    'median-of-two-sorted-arrays': [
        {'input': '1 2\n3 4\n',   'output': '2.50000\n', 'hidden': True},
        {'input': '0 0\n0 0\n',   'output': '0.00000\n', 'hidden': True},
        {'input': '\n1\n',         'output': '1.00000\n', 'hidden': True},
        {'input': '2\n\n',         'output': '2.00000\n', 'hidden': True},
        {'input': '1 3\n2\n',      'output': '2.00000\n', 'hidden': True},
        {'input': '1 2\n3 4 5\n',  'output': '3.00000\n', 'hidden': True},
        {'input': '1 3 5\n2 4 6\n','output': '3.50000\n', 'hidden': True},
        {'input': '1\n2\n',        'output': '1.50000\n', 'hidden': True},
        {'input': '1 2 3\n4 5 6\n','output': '3.50000\n', 'hidden': True},
        {'input': '1 5 9\n2 3 4 7 8\n', 'output': '4.50000\n', 'hidden': True},
    ],

    # ── 19. Merge k Sorted Lists ─────────────────────────────────────────────
    'merge-k-sorted-lists': [
        {'input': '0\n',       'output': '\n',          'hidden': True},
        {'input': '1\n\n',     'output': '\n',          'hidden': True},
        {'input': '2\n1\n2\n', 'output': '1 2\n',      'hidden': True},
        {'input': '2\n1 3\n2\n','output': '1 2 3\n',   'hidden': True},
        {'input': '3\n1 4 5\n1 3 4\n2 6\n', 'output': '1 1 2 3 4 4 5 6\n', 'hidden': True},
        {'input': '3\n\n\n\n', 'output': '\n',         'hidden': True},
        {'input': '1\n1 2 3\n','output': '1 2 3\n',    'hidden': True},
    ],

    # ── 20. Search in Rotated Sorted Array ──────────────────────────────────
    'search-in-rotated-sorted-array': [
        {'input': '4 5 6 7 0 1 2\n3\n', 'output': '-1\n', 'hidden': True},
        {'input': '1\n0\n',              'output': '-1\n', 'hidden': True},
        {'input': '1\n1\n',              'output': '0\n',  'hidden': True},
        {'input': '5 1 3\n3\n',          'output': '2\n',  'hidden': True},
        {'input': '6 7 1 2 3 4 5\n5\n',  'output': '6\n',  'hidden': True},
        {'input': '4 5 6 7 0 1 2\n0\n',  'output': '4\n',  'hidden': True},
        {'input': '3 4 5 1 2\n1\n',      'output': '3\n',  'hidden': True},
        {'input': '3 4 5 1 2\n6\n',      'output': '-1\n', 'hidden': True},
        {'input': '1 2 3 4 5\n3\n',      'output': '2\n',  'hidden': True},
        {'input': '2 3 4 5 6 7 8 1\n1\n','output': '7\n',  'hidden': True},
    ],

    # ── 21. First Missing Positive ───────────────────────────────────────────
    'first-missing-positive': [
        {'input': '7 8 9 11 12\n',     'output': '1\n',  'hidden': True},
        {'input': '1\n',               'output': '2\n',  'hidden': True},
        {'input': '2\n',               'output': '1\n',  'hidden': True},
        {'input': '1 2 3\n',           'output': '4\n',  'hidden': True},
        {'input': '-1 -2 -3\n',        'output': '1\n',  'hidden': True},
        {'input': '1 1 1\n',           'output': '2\n',  'hidden': True},
        {'input': '0 1 2 3 4 5\n',     'output': '6\n',  'hidden': True},
        {'input': '3 4 -1 1\n',        'output': '2\n',  'hidden': True},
        {'input': '2 3 4 5\n',         'output': '1\n',  'hidden': True},
        {'input': '1 2 0\n',           'output': '3\n',  'hidden': True},
    ],

    # ── 22. Permutations ────────────────────────────────────────────────────
    'permutations': [
        {'input': '0 1\n', 'output': '[[0,1],[1,0]]\n', 'hidden': True},
        {'input': '1\n',   'output': '[[1]]\n',          'hidden': True},
        {'input': '1 2\n', 'output': '[[1,2],[2,1]]\n', 'hidden': True},
    ],

    # ── 23. Merge Intervals ──────────────────────────────────────────────────
    'merge-intervals': [
        {'input': '1 4\n4 5\n',              'output': '[[1,5]]\n',           'hidden': True},
        {'input': '1 4\n2 3\n',              'output': '[[1,4]]\n',           'hidden': True},
        {'input': '1 2\n3 4\n5 6\n',         'output': '[[1,2],[3,4],[5,6]]\n', 'hidden': True},
        {'input': '1 3\n2 6\n8 10\n15 18\n', 'output': '[[1,6],[8,10],[15,18]]\n', 'hidden': True},
        {'input': '1 4\n0 2\n3 5\n',         'output': '[[0,5]]\n',           'hidden': True},
        {'input': '1 5\n1 5\n',              'output': '[[1,5]]\n',           'hidden': True},
        {'input': '1 10\n2 3\n5 7\n',        'output': '[[1,10]]\n',          'hidden': True},
        {'input': '1 1\n',                   'output': '[[1,1]]\n',           'hidden': True},
    ],

    # ── 24. Jump Game ────────────────────────────────────────────────────────
    'jump-game': [
        {'input': '3 2 1 0 4\n', 'output': 'false\n', 'hidden': True},
        {'input': '0\n',         'output': 'true\n',  'hidden': True},
        {'input': '2 3 1 1 4\n', 'output': 'true\n',  'hidden': True},
        {'input': '1 0 0 0\n',   'output': 'false\n', 'hidden': True},
        {'input': '2 0 0\n',     'output': 'true\n',  'hidden': True},
        {'input': '1 1 1 0\n',   'output': 'true\n',  'hidden': True},
        {'input': '0 0\n',       'output': 'false\n', 'hidden': True},
        {'input': '5 0 0 0 0\n', 'output': 'true\n',  'hidden': True},
        {'input': '3 0 0 0 1\n', 'output': 'true\n',  'hidden': True},
        {'input': '1 2 0 1\n',   'output': 'true\n',  'hidden': True},
    ],

    # ── 25. Unique Paths ─────────────────────────────────────────────────────
    'unique-paths': [
        {'input': '3 2\n', 'output': '3\n',    'hidden': True},
        {'input': '1 1\n', 'output': '1\n',    'hidden': True},
        {'input': '2 2\n', 'output': '2\n',    'hidden': True},
        {'input': '3 3\n', 'output': '6\n',    'hidden': True},
        {'input': '4 4\n', 'output': '20\n',   'hidden': True},
        {'input': '5 5\n', 'output': '70\n',   'hidden': True},
        {'input': '7 3\n', 'output': '28\n',   'hidden': True},
        {'input': '3 7\n', 'output': '28\n',   'hidden': True},
        {'input': '10 10\n','output': '48620\n','hidden': True},
        {'input': '1 10\n', 'output': '1\n',   'hidden': True},
    ],

    # ── 26. Edit Distance ────────────────────────────────────────────────────
    'edit-distance': [
        {'input': 'intention\nexecution\n', 'output': '5\n', 'hidden': True},
        {'input': '\na\n',                   'output': '1\n', 'hidden': True},
        {'input': 'a\n\n',                  'output': '1\n', 'hidden': True},
        {'input': 'horse\nros\n',            'output': '3\n', 'hidden': True},
        {'input': 'abc\nabc\n',              'output': '0\n', 'hidden': True},
        {'input': 'a\nb\n',                  'output': '1\n', 'hidden': True},
        {'input': 'ab\nba\n',                'output': '2\n', 'hidden': True},
        {'input': 'sunday\nsaturday\n',      'output': '3\n', 'hidden': True},
        {'input': 'kitten\nsitting\n',       'output': '3\n', 'hidden': True},
        {'input': 'abc\n\n',                 'output': '3\n', 'hidden': True},
    ],

    # ── 27. Word Search ──────────────────────────────────────────────────────
    'word-search': [
        {'input': '3 4\nA B C E\nS F C S\nA D E E\nSEE\n',  'output': 'true\n',  'hidden': True},
        {'input': '3 4\nA B C E\nS F C S\nA D E E\nABCB\n', 'output': 'false\n', 'hidden': True},
        {'input': '1 1\nA\nA\n',                             'output': 'true\n',  'hidden': True},
        {'input': '1 1\nA\nB\n',                             'output': 'false\n', 'hidden': True},
        {'input': '2 2\nA B\nC D\nABDC\n',                  'output': 'true\n',  'hidden': True},
        {'input': '3 4\nA B C E\nS F C S\nA D E E\nABCCED\n','output': 'true\n', 'hidden': True},
    ],

    # ── 28. Best Time to Buy and Sell Stock ──────────────────────────────────
    'best-time-to-buy-and-sell-stock': [
        {'input': '7 6 4 3 1\n',     'output': '0\n',  'hidden': True},
        {'input': '1 2\n',           'output': '1\n',  'hidden': True},
        {'input': '7 1 5 3 6 4\n',   'output': '5\n',  'hidden': True},
        {'input': '1 4 2\n',         'output': '3\n',  'hidden': True},
        {'input': '2 4 1\n',         'output': '2\n',  'hidden': True},
        {'input': '3 2 6 5 0 3\n',   'output': '4\n',  'hidden': True},
        {'input': '1\n',             'output': '0\n',  'hidden': True},
        {'input': '5 5 5 5\n',       'output': '0\n',  'hidden': True},
        {'input': '1 2 3 4 5\n',     'output': '4\n',  'hidden': True},
        {'input': '5 4 3 2 1 10\n',  'output': '9\n',  'hidden': True},
    ],

    # ── 29. Linked List Cycle ────────────────────────────────────────────────
    'linked-list-cycle': [
        {'input': '1 2\n0\n',        'output': 'true\n',  'hidden': True},
        {'input': '1\n-1\n',         'output': 'false\n', 'hidden': True},
        {'input': '1 2 3 4 5\n-1\n', 'output': 'false\n', 'hidden': True},
        {'input': '1\n0\n',          'output': 'true\n',  'hidden': True},
        {'input': '3 2 0 -4\n1\n',   'output': 'true\n',  'hidden': True},
        {'input': '1 2\n-1\n',       'output': 'false\n', 'hidden': True},
        {'input': '1 2 3\n2\n',      'output': 'true\n',  'hidden': True},
        {'input': '1 2 3 4\n0\n',    'output': 'true\n',  'hidden': True},
    ],

    # ── 30. Longest Consecutive Sequence ─────────────────────────────────────
    'longest-consecutive-sequence': [
        {'input': '0 3 7 2 5 8 4 6 0 1\n', 'output': '9\n',  'hidden': True},
        {'input': '0\n',                    'output': '1\n',  'hidden': True},
        {'input': '\n',                     'output': '0\n',  'hidden': True},
        {'input': '100 4 200 1 3 2\n',      'output': '4\n',  'hidden': True},
        {'input': '1 2 3 4 5\n',            'output': '5\n',  'hidden': True},
        {'input': '5 4 3 2 1\n',            'output': '5\n',  'hidden': True},
        {'input': '10 5 4 3\n',             'output': '3\n',  'hidden': True},
        {'input': '1 3 5 7\n',              'output': '1\n',  'hidden': True},
        {'input': '-3 -2 -1 0 1\n',         'output': '5\n',  'hidden': True},
        {'input': '1 2 3 100 101 102\n',    'output': '3\n',  'hidden': True},
    ],
}


def seed_problems(db):
    print("Refreshing problems table with distinct questions...")
    db.execute(text("DELETE FROM testcase"))
    db.execute(text("DELETE FROM submission"))
    db.execute(text("DELETE FROM problem"))
    db.commit()

    for item in PROBLEMS_DATA:
        # INJECT EXTRA TESTCASES HERE
        if item["slug"] in EXTRA_TESTCASES:
            item["test_cases"].extend(EXTRA_TESTCASES[item["slug"]])
            
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
"""

with open('scripts/seed_db.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_func = """def seed_problems(db):
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
        db.commit()"""

code = code.replace(old_func, extra_code)

with open('scripts/seed_db.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully injected test cases")
