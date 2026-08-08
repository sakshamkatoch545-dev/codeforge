import json
import random

EXTRA_TESTCASES = {}

# 13. search-in-rotated-sorted-array
tc = []
for _ in range(10):
    nums = sorted(list(set(random.randint(-100, 100) for _ in range(random.randint(5, 20)))))
    if nums:
        k = random.randint(0, len(nums) - 1)
        nums = nums[k:] + nums[:k]
    if random.choice([True, False]) and nums:
        target = random.choice(nums)
        ans = nums.index(target)
    else:
        target = random.randint(101, 200)
        ans = -1
    tc.append({"input": " ".join(map(str, nums)) + f"\n{target}\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['search-in-rotated-sorted-array'] = tc

# 14. first-missing-positive
tc = []
for _ in range(10):
    nums = [random.randint(-10, 20) for _ in range(random.randint(5, 20))]
    s = set(nums)
    ans = 1
    while ans in s: ans += 1
    tc.append({"input": " ".join(map(str, nums)) + "\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['first-missing-positive'] = tc

# 15. permutations
tc = []
for _ in range(10):
    nums = list(set([random.randint(-10, 10) for _ in range(random.randint(1, 6))]))
    import itertools
    ans = [list(p) for p in itertools.permutations(nums)]
    ans.sort()
    tc.append({"input": " ".join(map(str, nums)) + "\n", "output": f"{json.dumps(ans, separators=(',', ':'))}\n", "hidden": True})
EXTRA_TESTCASES['permutations'] = tc

# 16. merge-intervals
tc = []
for _ in range(10):
    intervals = []
    for _ in range(random.randint(1, 15)):
        a = random.randint(0, 20)
        b = random.randint(a, 20)
        intervals.append([a, b])
    intervals.sort(key=lambda x: x[0])
    ans = []
    for interval in intervals:
        if not ans or ans[-1][1] < interval[0]:
            ans.append(interval)
        else:
            ans[-1][1] = max(ans[-1][1], interval[1])
    in_str = " ".join(f"{i[0]} {i[1]}" for i in intervals) + "\n"
    tc.append({"input": in_str, "output": f"{json.dumps(ans, separators=(',', ':'))}\n", "hidden": True})
EXTRA_TESTCASES['merge-intervals'] = tc

# 17. jump-game
tc = []
for _ in range(10):
    nums = [random.randint(0, 5) for _ in range(random.randint(1, 15))]
    ans = True
    max_reach = 0
    for i, n in enumerate(nums):
        if i > max_reach:
            ans = False
            break
        max_reach = max(max_reach, i + n)
    tc.append({"input": " ".join(map(str, nums)) + "\n", "output": f"{str(ans).lower()}\n", "hidden": True})
EXTRA_TESTCASES['jump-game'] = tc

# 18. unique-paths
tc = []
for _ in range(10):
    m = random.randint(1, 15)
    n = random.randint(1, 15)
    import math
    ans = math.comb(m + n - 2, m - 1)
    tc.append({"input": f"{m} {n}\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['unique-paths'] = tc

with open('scripts/extra_tc_3.json', 'w') as f:
    json.dump(EXTRA_TESTCASES, f)
print("Generated part 3")
