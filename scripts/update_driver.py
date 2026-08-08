import os
import psycopg2
import json

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/codeforge")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

new_driver = """import sys, json
from typing import *
import collections
import math
import itertools
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
{USER_CODE}
def build(lst):
    d = c = ListNode(0)
    for v in lst: c.next = ListNode(int(v)); c = c.next
    return d.next
if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    lines = [line.strip() for line in lines if line.strip()]
    if lines and len(lines[0].split()) == 1 and str(len(lines) - 1) == lines[0]:
        lines = lines[1:]
    lists = [build(line.split()) for line in lines]
    res = Solution().mergeKLists(lists)
    out = []
    while res: out.append(res.val); res = res.next
    print("[" + ",".join(map(str, out)) + "]")
"""

# Fetch the current driver_code
cursor.execute("SELECT driver_code FROM problem WHERE slug = 'merge-k-sorted-lists'")
row = cursor.fetchone()
if row:
    driver_code = row[0]
    driver_code["python"] = new_driver
    
    # Update back to db
    cursor.execute("UPDATE problem SET driver_code = %s WHERE slug = 'merge-k-sorted-lists'", (json.dumps(driver_code),))
    conn.commit()
    print("Updated driver successfully!")
else:
    print("Problem not found.")

cursor.close()
conn.close()
