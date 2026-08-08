import json
import random
import string

EXTRA_TESTCASES = {}

# 7. n-queens
tc = []
for _ in range(5): # Smaller range since answers are hardcoded or exhaustive
    n = random.randint(1, 8)
    def solveNQueens(n):
        def DFS(queens, xy_dif, xy_sum):
            p = len(queens)
            if p == n:
                result.append(queens)
                return None
            for q in range(n):
                if q not in queens and p-q not in xy_dif and p+q not in xy_sum: 
                    DFS(queens+[q], xy_dif+[p-q], xy_sum+[p+q])
        result = []
        DFS([],[],[])
        return [ ["."*i + "Q" + "."*(n-i-1) for i in sol] for sol in result]
    ans = solveNQueens(n)
    tc.append({"input": f"{n}\n", "output": f"{json.dumps(ans, separators=(',', ':'))}\n", "hidden": True})
EXTRA_TESTCASES['n-queens'] = tc

# 8. group-anagrams
tc = []
for _ in range(10):
    strs = []
    for _ in range(random.randint(1, 10)):
        base = "".join(random.choices(string.ascii_lowercase, k=random.randint(1, 5)))
        strs.append(base)
        if random.random() < 0.5:
            strs.append("".join(random.sample(base, len(base))))
    random.shuffle(strs)
    
    from collections import defaultdict
    d = defaultdict(list)
    for s in strs:
        d[tuple(sorted(s))].append(s)
    ans = list(d.values())
    ans.sort(key=lambda x: (len(x), x))
    for lst in ans: lst.sort()
    
    in_str = " ".join(strs) + "\n"
    if not strs: in_str = "\n"
    tc.append({"input": in_str, "output": f"{json.dumps(ans, separators=(',', ':'))}\n", "hidden": True})
EXTRA_TESTCASES['group-anagrams'] = tc

# 9. product-of-array-except-self
tc = []
for _ in range(10):
    nums = [random.randint(-10, 10) for _ in range(random.randint(2, 15))]
    ans = [1] * len(nums)
    pref = 1
    for i in range(len(nums)):
        ans[i] = pref
        pref *= nums[i]
    suff = 1
    for i in range(len(nums)-1, -1, -1):
        ans[i] *= suff
        suff *= nums[i]
    tc.append({"input": " ".join(map(str, nums)) + "\n", "output": f"{json.dumps(ans, separators=(',', ':'))}\n", "hidden": True})
EXTRA_TESTCASES['product-of-array-except-self'] = tc

# 10. longest-palindromic-substring
tc = []
for _ in range(10):
    s = "".join(random.choices(string.ascii_lowercase[:5], k=random.randint(1, 20)))
    ans = ""
    for i in range(len(s)):
        for j in range(i, len(s)):
            sub = s[i:j+1]
            if sub == sub[::-1] and len(sub) > len(ans):
                ans = sub
    tc.append({"input": f"{s}\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['longest-palindromic-substring'] = tc

# 11. median-of-two-sorted-arrays
tc = []
for _ in range(10):
    nums1 = sorted([random.randint(-50, 50) for _ in range(random.randint(0, 10))])
    nums2 = sorted([random.randint(-50, 50) for _ in range(random.randint(0, 10))])
    if not nums1 and not nums2: nums1 = [0]
    m = sorted(nums1 + nums2)
    L = len(m)
    ans = m[L//2] if L % 2 != 0 else (m[L//2 - 1] + m[L//2]) / 2.0
    tc.append({"input": " ".join(map(str, nums1)) + "\n" + " ".join(map(str, nums2)) + "\n", "output": f"{ans:.5f}\n", "hidden": True})
EXTRA_TESTCASES['median-of-two-sorted-arrays'] = tc

# 12. merge-k-sorted-lists
tc = []
for _ in range(10):
    k = random.randint(0, 5)
    lists = []
    for _ in range(k):
        lists.append(sorted([random.randint(-50, 50) for _ in range(random.randint(0, 5))]))
    ans = sorted([x for l in lists for x in l])
    in_str = "\n".join(" ".join(map(str, l)) for l in lists) + "\n"
    if not lists: in_str = "\n"
    out_str = " ".join(map(str, ans)) + "\n"
    if not ans: out_str = "\n"
    tc.append({"input": in_str, "output": out_str, "hidden": True})
EXTRA_TESTCASES['merge-k-sorted-lists'] = tc

with open('scripts/extra_tc_2.json', 'w') as f:
    json.dump(EXTRA_TESTCASES, f)
print("Generated part 2")
