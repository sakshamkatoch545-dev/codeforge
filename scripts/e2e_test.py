import requests, json

# Test 1: API returns starter_code
r = requests.get('http://localhost:8000/api/v1/problems/by-slug/two-sum')
d = r.json()
sc = d.get('starter_code', {})
if 'python' in sc:
    print("OK starter_code in API")
    print("  Python:", sc.get('python', '')[:60])
else:
    print("FAIL starter_code MISSING")

# Test 2: login and run code via /run/ with problem_id
login_r = requests.post('http://localhost:8000/api/v1/auth/login',
    data={'username': 'saksham', 'password': 'password123'})
token = login_r.json().get('access_token')
print("Got token:" + str(bool(token)))

if token:
    code = """class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, n in enumerate(nums):
            if target - n in seen:
                return [seen[target-n], i]
            seen[n] = i"""
    
    run_r = requests.post('http://localhost:8000/api/v1/run/',
        json={'code': code, 'language': 'python', 'input_data': '2 7 11 15\n9', 'problem_id': d['id']},
        headers={'Authorization': 'Bearer ' + token})
    result = run_r.json()
    print("Run status:", result.get("status"))
    print("Output:", result.get("output", "").strip())
    print("Error:", result.get("error", "")[:100])
