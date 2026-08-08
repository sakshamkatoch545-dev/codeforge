import psycopg2

conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/codeforge")
cur = conn.cursor()

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
        return dummy.next
"""

cur.execute(
    "INSERT INTO submission (problem_id, user_id, language, code, status) VALUES (%s, %s, %s, %s, %s) RETURNING id",
    (441, 1, "python", code, "PENDING")
)
sub_id = cur.fetchone()[0]
conn.commit()

import redis
r = redis.Redis(host='localhost', port=6379, db=0)
r.lpush('judge_queue', str(sub_id))
print(f"Triggered submission {sub_id}")
