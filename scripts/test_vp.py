import urllib.request
import urllib.parse
import json

try:
    login_data = urllib.parse.urlencode({'username': 'saksham', 'password': 'password123'}).encode('utf-8')
    login_req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=login_data)
    with urllib.request.urlopen(login_req) as res:
        token = json.loads(res.read().decode('utf-8'))['access_token']
except Exception as e:
    login_data = urllib.parse.urlencode({'username': 'admin@example.com', 'password': 'password123'}).encode('utf-8')
    login_req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=login_data)
    with urllib.request.urlopen(login_req) as res:
        token = json.loads(res.read().decode('utf-8'))['access_token']

code = """class Solution:
    def isValid(self, s: str) -> bool:
        return s == "()[]{}"
"""
data = {'code': code, 'language': 'python', 'input_data': '()[]{}\n', 'problem_id': 4}
req = urllib.request.Request('http://localhost:8000/api/v1/run/', data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
try:
    with urllib.request.urlopen(req) as res:
        print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
