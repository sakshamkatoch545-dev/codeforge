import requests

code = """
class Solution:
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

data = {
    "problem_id": 5, # Merge Two Sorted Lists
    "language": "python",
    "code": code
}

# The backend might not have token auth enabled for local script, or I can just directly invoke executor logic
import sys
sys.path.append('backend')
from app.judge.executor import judge, Limits
from app.judge.languages import get_language
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

engine = create_engine("postgresql://postgres:postgres@localhost:5432/codeforge")
Session = sessionmaker(bind=engine)
db = Session()

problem = db.execute(text("SELECT * FROM problem WHERE id = 441")).fetchone()
tcs = db.execute(text("SELECT * FROM testcase WHERE problem_id = 441")).fetchall()

test_cases = [
    {"id": tc.id, "input_data": tc.input_data, "expected_output": tc.expected_output}
    for tc in tcs
]

limits = Limits()
driver = problem.driver_code

result = judge(code, "python", test_cases, limits, driver)
print(result)
