import urllib.request
import urllib.parse
import json

# Login to get token
login_data = urllib.parse.urlencode({
    'username': 'admin@example.com',
    'password': 'password123'
}).encode('utf-8')
login_req = urllib.request.Request("http://localhost:8000/api/v1/auth/login", data=login_data)
try:
    with urllib.request.urlopen(login_req) as res:
        token_data = json.loads(res.read().decode('utf-8'))
        token = token_data['access_token']
except Exception as e:
    # If admin@example.com doesn't work, let's try reading a valid token from db or just using test@example.com
    print("Login failed:", e)
    import sys
    sys.exit(1)

code = """class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        current = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next

            current = current.next

        if list1:
            current.next = list1
        else:
            current.next = list2

        return dummy.next"""

data = {
    "code": code,
    "language": "python",
    "input_data": "[1,2,4]\n[1,3,4]\n",
    "problem_id": 5
}
req = urllib.request.Request("http://localhost:8000/api/v1/run/", data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
try:
    with urllib.request.urlopen(req) as res:
        print(res.status)
        print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode('utf-8'))
