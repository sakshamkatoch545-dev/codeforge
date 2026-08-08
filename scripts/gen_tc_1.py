import json
import random
import string

EXTRA_TESTCASES = {}

# 1. valid-parentheses
tc = []
for _ in range(10):
    valid = random.choice([True, False])
    if valid:
        def gen_valid(depth):
            if depth == 0 or random.random() < 0.2: return ""
            inner = gen_valid(depth - 1)
            pair = random.choice(["()", "[]", "{}"])
            return pair[0] + inner + pair[1] + gen_valid(depth - 1)
        s = gen_valid(4)
        if not s: s = "()"
    else:
        s = "".join(random.choices("()[]{}", k=random.randint(1, 10)))
        
    stack = []
    ans = True
    for c in s:
        if c in "([{": stack.append(c)
        else:
            if not stack: ans = False; break
            if c == ')' and stack[-1] != '(': ans = False; break
            if c == ']' and stack[-1] != '[': ans = False; break
            if c == '}' and stack[-1] != '{': ans = False; break
            stack.pop()
    if stack: ans = False
    tc.append({"input": f"{s}\n", "output": f"{str(ans).lower()}\n", "hidden": True})
EXTRA_TESTCASES['valid-parentheses'] = tc

# 2. merge-two-sorted-lists
tc = []
for _ in range(10):
    l1 = sorted([random.randint(-50, 50) for _ in range(random.randint(0, 10))])
    l2 = sorted([random.randint(-50, 50) for _ in range(random.randint(0, 10))])
    merged = sorted(l1 + l2)
    in_str = json.dumps(l1).replace(" ", "") + "\n" + json.dumps(l2).replace(" ", "") + "\n"
    out_str = json.dumps(merged).replace(" ", "") + "\n"
    tc.append({"input": in_str, "output": out_str, "hidden": True})
EXTRA_TESTCASES['merge-two-sorted-lists'] = tc

# 3. container-with-most-water
tc = []
for _ in range(10):
    height = [random.randint(0, 100) for _ in range(random.randint(2, 20))]
    ans = 0
    l, r = 0, len(height) - 1
    while l < r:
        ans = max(ans, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]: l += 1
        else: r -= 1
    tc.append({"input": " ".join(map(str, height)) + "\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['container-with-most-water'] = tc

# 4. 3sum
tc = []
for _ in range(10):
    nums = [random.randint(-20, 20) for _ in range(random.randint(3, 15))]
    nums.sort()
    res = set()
    for i in range(len(nums)-2):
        l, r = i+1, len(nums)-1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.add((nums[i], nums[l], nums[r]))
                l += 1; r -= 1
            elif s < 0: l += 1
            else: r -= 1
    ans_list = [list(x) for x in sorted(res)]
    tc.append({"input": " ".join(map(str, nums)) + "\n", "output": f"{json.dumps(ans_list, separators=(',', ':'))}\n", "hidden": True})
EXTRA_TESTCASES['3sum'] = tc

# 5. longest-substring-without-repeating-characters
tc = []
for _ in range(10):
    s = "".join(random.choices(string.ascii_letters, k=random.randint(1, 20)))
    ans = 0
    seen = {}
    l = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        ans = max(ans, r - l + 1)
    tc.append({"input": f"{s}\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['longest-substring-without-repeating-characters'] = tc

# 6. trapping-rain-water
tc = []
for _ in range(10):
    height = [random.randint(0, 10) for _ in range(random.randint(1, 20))]
    ans = 0
    if height:
        l, r = 0, len(height) - 1
        l_max, r_max = height[l], height[r]
        while l < r:
            if height[l] < height[r]:
                l += 1
                l_max = max(l_max, height[l])
                ans += l_max - height[l]
            else:
                r -= 1
                r_max = max(r_max, height[r])
                ans += r_max - height[r]
    tc.append({"input": " ".join(map(str, height)) + "\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['trapping-rain-water'] = tc

with open('scripts/extra_tc_1.json', 'w') as f:
    json.dump(EXTRA_TESTCASES, f)
print("Generated part 1")
