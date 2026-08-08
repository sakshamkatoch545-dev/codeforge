import re
import os

path = r"c:\MY PROJECTS\codeforge\frontend\src\problemsConfig.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add paramNames to interface
if "paramNames?: string[];" not in content:
    content = content.replace("params: string[];", "params: string[];\n  paramNames?: string[];")

param_map = {
    'two-sum': "['nums', 'target']",
    'reverse-string': "['s']",
    'palindrome-number': "['x']",
    'valid-parentheses': "['s']",
    'merge-two-sorted-lists': "['list1', 'list2']",
    'maximum-subarray': "['nums']",
    'container-with-most-water': "['height']",
    '3sum': "['nums']",
    'longest-substring-without-repeating-characters': "['s']",
    'trapping-rain-water': "['height']",
    'n-queens': "['n']",
    'binary-search': "['nums', 'target']",
    'climbing-stairs': "['n']",
    'valid-anagram': "['s', 't']",
    'group-anagrams': "['strs']",
    'product-of-array-except-self': "['nums']",
    'longest-palindromic-substring': "['s']",
    'median-of-two-sorted-arrays': "['nums1', 'nums2']",
    'merge-k-sorted-lists': "['lists']",
    'search-in-rotated-sorted-array': "['nums', 'target']",
    'first-missing-positive': "['nums']",
    'permutations': "['nums']",
    'merge-intervals': "['intervals']",
    'jump-game': "['nums']",
    'unique-paths': "['m', 'n']",
    'edit-distance': "['word1', 'word2']",
    'word-search': "['board', 'word']",
    'best-time-to-buy-and-sell-stock': "['prices']",
    'linked-list-cycle': "['head']",
    'longest-consecutive-sequence': "['nums']",
}

for slug, pnames in param_map.items():
    if f"paramNames: {pnames}" not in content:
        pattern = r"slug:\s*'" + slug + r"',([^}]*?)returnType:\s*'([a-z\-]+)'"
        
        def repl(match):
            inner = match.group(1)
            ret = match.group(2)
            if "paramNames:" not in inner:
                return f"slug: '{slug}',{inner}paramNames: {pnames},\n    returnType: '{ret}'"
            return match.group(0)
            
        content = re.sub(pattern, repl, content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated paramNames in problemsMetadata!")
