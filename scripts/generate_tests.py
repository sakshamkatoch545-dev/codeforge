import json
import random

EXTRA_TESTCASES = {}

# 1. two-sum
tc = []
for _ in range(10):
    nums = [random.randint(-50, 50) for _ in range(random.randint(5, 15))]
    i, j = random.sample(range(len(nums)), 2)
    if i > j: i, j = j, i
    target = nums[i] + nums[j]
    ans = []
    for x in range(len(nums)):
        for y in range(x+1, len(nums)):
            if nums[x] + nums[y] == target:
                ans = [x, y]
                break
        if ans: break
    tc.append({"input": f"{json.dumps(nums)}\n{target}\n", "output": f"[{ans[0]},{ans[1]}]\n", "hidden": True})
EXTRA_TESTCASES['two-sum'] = tc

# 2. reverse-string
tc = []
for _ in range(10):
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=random.randint(3, 20)))
    tc.append({"input": f"{s}\n", "output": f"{s[::-1]}\n", "hidden": True})
EXTRA_TESTCASES['reverse-string'] = tc

# 3. palindrome-number
tc = []
for _ in range(10):
    is_pal = random.choice([True, False])
    if is_pal:
        s = "".join(random.choices("0123456789", k=random.randint(1, 5)))
        s = s + s[::-1]
    else:
        s = str(random.randint(10, 100000))
        if s == s[::-1]: s += "1"
    tc.append({"input": f"{s}\n", "output": f"{'true' if s==s[::-1] else 'false'}\n", "hidden": True})
EXTRA_TESTCASES['palindrome-number'] = tc

# 4. maximum-subarray
tc = []
for _ in range(10):
    nums = [random.randint(-100, 100) for _ in range(random.randint(5, 20))]
    ans = nums[0]
    curr = 0
    for n in nums:
        curr += n
        ans = max(ans, curr)
        if curr < 0: curr = 0
    tc.append({"input": " ".join(map(str, nums)) + "\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['maximum-subarray'] = tc

# 5. valid-anagram
tc = []
for _ in range(10):
    s = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(3, 15)))
    is_ana = random.choice([True, False])
    if is_ana:
        t = "".join(random.sample(s, len(s)))
    else:
        t = s + "a"
    tc.append({"input": f"{s}\n{t}\n", "output": f"{'true' if is_ana else 'false'}\n", "hidden": True})
EXTRA_TESTCASES['valid-anagram'] = tc

# 6. binary-search
tc = []
for _ in range(10):
    nums = sorted(list(set(random.randint(-100, 100) for _ in range(random.randint(5, 15)))))
    if random.choice([True, False]):
        target = random.choice(nums)
        ans = nums.index(target)
    else:
        target = random.randint(101, 200)
        ans = -1
    tc.append({"input": " ".join(map(str, nums)) + f"\n{target}\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['binary-search'] = tc

# 7. climbing-stairs
tc = []
for _ in range(10):
    n = random.randint(1, 20)
    a, b = 1, 1
    for i in range(n-1):
        a, b = b, a+b
    tc.append({"input": f"{n}\n", "output": f"{b}\n", "hidden": True})
EXTRA_TESTCASES['climbing-stairs'] = tc

with open('scripts/extra_tc_0.json', 'w') as f:
    json.dump(EXTRA_TESTCASES, f)

print("Generated part 0")
