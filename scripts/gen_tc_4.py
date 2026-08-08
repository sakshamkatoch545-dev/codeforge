import json
import random
import string

EXTRA_TESTCASES = {}

# 19. edit-distance
tc = []
for _ in range(10):
    word1 = "".join(random.choices(string.ascii_lowercase[:5], k=random.randint(0, 15)))
    word2 = "".join(random.choices(string.ascii_lowercase[:5], k=random.randint(0, 15)))
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]
            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    ans = dp[m][n]
    tc.append({"input": f"{word1}\n{word2}\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['edit-distance'] = tc

# 20. word-search
tc = []
for _ in range(10):
    m, n = random.randint(2, 5), random.randint(2, 5)
    board = [["".join(random.choices(string.ascii_uppercase[:5], k=1)) for _ in range(n)] for _ in range(m)]
    word = "".join(random.choices(string.ascii_uppercase[:5], k=random.randint(2, 8)))
    
    def exist(board, word):
        def dfs(i, j, k, visited):
            if k == len(word): return True
            if i < 0 or i >= m or j < 0 or j >= n or visited[i][j] or board[i][j] != word[k]: return False
            visited[i][j] = True
            res = dfs(i+1, j, k+1, visited) or dfs(i-1, j, k+1, visited) or dfs(i, j+1, k+1, visited) or dfs(i, j-1, k+1, visited)
            visited[i][j] = False
            return res
        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0, [[False]*n for _ in range(m)]): return True
        return False
        
    ans = exist(board, word)
    in_str = f"{m} {n}\n" + "\n".join(" ".join(row) for row in board) + f"\n{word}\n"
    tc.append({"input": in_str, "output": f"{str(ans).lower()}\n", "hidden": True})
EXTRA_TESTCASES['word-search'] = tc

# 21. best-time-to-buy-and-sell-stock
tc = []
for _ in range(10):
    prices = [random.randint(0, 20) for _ in range(random.randint(1, 15))]
    ans = 0
    if prices:
        min_p = prices[0]
        for p in prices:
            ans = max(ans, p - min_p)
            min_p = min(min_p, p)
    tc.append({"input": " ".join(map(str, prices)) + "\n", "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['best-time-to-buy-and-sell-stock'] = tc

# 22. linked-list-cycle
tc = []
for _ in range(10):
    n = random.randint(0, 15)
    vals = [random.randint(-10, 10) for _ in range(n)]
    pos = random.randint(-1, n - 1)
    ans = pos != -1
    tc.append({"input": " ".join(map(str, vals)) + f"\n{pos}\n", "output": f"{str(ans).lower()}\n", "hidden": True})
EXTRA_TESTCASES['linked-list-cycle'] = tc

# 23. longest-consecutive-sequence
tc = []
for _ in range(10):
    nums = [random.randint(0, 20) for _ in range(random.randint(0, 20))]
    s = set(nums)
    ans = 0
    for num in s:
        if num - 1 not in s:
            curr = num
            c = 1
            while curr + 1 in s:
                curr += 1
                c += 1
            ans = max(ans, c)
    in_str = " ".join(map(str, nums)) + "\n"
    if not nums: in_str = "\n"
    tc.append({"input": in_str, "output": f"{ans}\n", "hidden": True})
EXTRA_TESTCASES['longest-consecutive-sequence'] = tc

with open('scripts/extra_tc_4.json', 'w') as f:
    json.dump(EXTRA_TESTCASES, f)
print("Generated part 4")
