import sys, json

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

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

def build(lst):
    d = c = ListNode(0)
    for v in lst: c.next = ListNode(int(v)); c = c.next
    return d.next

if __name__ == '__main__':
    lines = ["[1,2,4]", "[1,3,4]"]
    l1 = build(json.loads(lines[0])) if len(lines)>0 and lines[0] else None
    l2 = build(json.loads(lines[1])) if len(lines)>1 and lines[1] else None
    res = Solution().mergeTwoLists(l1, l2)
    out = []
    while res: out.append(res.val); res = res.next
    print("[" + ",".join(map(str, out)) + "]")
