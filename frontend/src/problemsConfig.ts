export interface ProblemMetadata {
  slug: string;
  funcName: string;
  params: string[];
  returnType: 'json' | 'space-array' | 'bool' | 'val' | 'float' | 'inplace-str';
}

export const problemsMetadata: Record<string, ProblemMetadata> = {
  'two-sum': {
    slug: 'two-sum',
    funcName: 'twoSum',
    params: ['json-array', 'int'],
    returnType: 'json'
  },
  'reverse-string': {
    slug: 'reverse-string',
    funcName: 'reverseString',
    params: ['char-array'],
    returnType: 'inplace-str'
  },
  'palindrome-number': {
    slug: 'palindrome-number',
    funcName: 'isPalindrome',
    params: ['int'],
    returnType: 'bool'
  },
  'valid-parentheses': {
    slug: 'valid-parentheses',
    funcName: 'isValid',
    params: ['str'],
    returnType: 'bool'
  },
  'merge-two-sorted-lists': {
    slug: 'merge-two-sorted-lists',
    funcName: 'mergeTwoLists',
    params: ['space-array', 'space-array'],
    returnType: 'space-array'
  },
  'maximum-subarray': {
    slug: 'maximum-subarray',
    funcName: 'maxSubArray',
    params: ['space-array'],
    returnType: 'val'
  },
  'container-with-most-water': {
    slug: 'container-with-most-water',
    funcName: 'maxArea',
    params: ['space-array'],
    returnType: 'val'
  },
  '3sum': {
    slug: '3sum',
    funcName: 'threeSum',
    params: ['space-array'],
    returnType: 'json'
  },
  'longest-substring-without-repeating-characters': {
    slug: 'longest-substring-without-repeating-characters',
    funcName: 'lengthOfLongestSubstring',
    params: ['str'],
    returnType: 'val'
  },
  'trapping-rain-water': {
    slug: 'trapping-rain-water',
    funcName: 'trap',
    params: ['space-array'],
    returnType: 'val'
  },
  'n-queens': {
    slug: 'n-queens',
    funcName: 'solveNQueens',
    params: ['int'],
    returnType: 'json'
  },
  'binary-search': {
    slug: 'binary-search',
    funcName: 'search',
    params: ['space-array', 'int'],
    returnType: 'val'
  },
  'climbing-stairs': {
    slug: 'climbing-stairs',
    funcName: 'climbStairs',
    params: ['int'],
    returnType: 'val'
  },
  'valid-anagram': {
    slug: 'valid-anagram',
    funcName: 'isAnagram',
    params: ['str', 'str'],
    returnType: 'bool'
  },
  'group-anagrams': {
    slug: 'group-anagrams',
    funcName: 'groupAnagrams',
    params: ['space-str-array'],
    returnType: 'json'
  },
  'product-of-array-except-self': {
    slug: 'product-of-array-except-self',
    funcName: 'productExceptSelf',
    params: ['space-array'],
    returnType: 'space-array'
  },
  'longest-palindromic-substring': {
    slug: 'longest-palindromic-substring',
    funcName: 'longestPalindrome',
    params: ['str'],
    returnType: 'val'
  },
  'median-of-two-sorted-arrays': {
    slug: 'median-of-two-sorted-arrays',
    funcName: 'findMedianSortedArrays',
    params: ['space-array', 'space-array'],
    returnType: 'float'
  },
  'merge-k-sorted-lists': {
    slug: 'merge-k-sorted-lists',
    funcName: 'mergeKLists',
    params: ['merge-k'],
    returnType: 'space-array'
  },
  'search-in-rotated-sorted-array': {
    slug: 'search-in-rotated-sorted-array',
    funcName: 'search',
    params: ['space-array', 'int'],
    returnType: 'val'
  },
  'first-missing-positive': {
    slug: 'first-missing-positive',
    funcName: 'firstMissingPositive',
    params: ['space-array'],
    returnType: 'val'
  },
  'permutations': {
    slug: 'permutations',
    funcName: 'permute',
    params: ['space-array'],
    returnType: 'json'
  },
  'merge-intervals': {
    slug: 'merge-intervals',
    funcName: 'merge',
    params: ['lines-array'],
    returnType: 'json'
  },
  'jump-game': {
    slug: 'jump-game',
    funcName: 'canJump',
    params: ['space-array'],
    returnType: 'bool'
  },
  'unique-paths': {
    slug: 'unique-paths',
    funcName: 'uniquePaths',
    params: ['two-ints'],
    returnType: 'val'
  },
  'edit-distance': {
    slug: 'edit-distance',
    funcName: 'minDistance',
    params: ['str', 'str'],
    returnType: 'val'
  },
  'word-search': {
    slug: 'word-search',
    funcName: 'exist',
    params: ['grid-char'],
    returnType: 'bool'
  },
  'best-time-to-buy-and-sell-stock': {
    slug: 'best-time-to-buy-and-sell-stock',
    funcName: 'maxProfit',
    params: ['space-array'],
    returnType: 'val'
  },
  'linked-list-cycle': {
    slug: 'linked-list-cycle',
    funcName: 'hasCycle',
    params: ['space-array', 'int'],
    returnType: 'bool'
  },
  'longest-consecutive-sequence': {
    slug: 'longest-consecutive-sequence',
    funcName: 'longestConsecutive',
    params: ['space-array'],
    returnType: 'val'
  }
};

export function getStarterCode(slug: string, language: string): string {
  const meta = problemsMetadata[slug];
  if (!meta) {
    if (language === 'python') return `def solve():\n    # here goes the code\n    pass`;
    if (language === 'javascript') return `function solve() {\n    // here goes the code\n}`;
    if (language === 'java') return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // here goes the code\n    }\n}`;
    return `// here goes the code`;
  }

  const fn = meta.funcName;

  switch (language) {
    case 'python':
      return `class Solution:\n    def ${fn}(self, ${getPythonParams(meta.params)}) -> ${getPythonReturn(meta.returnType)}:\n        # here goes the code\n        pass`;
    case 'javascript':
      return `class Solution {\n    ${fn}(${getJsParams(meta.params)}) {\n        // here goes the code\n    }\n}`;
    case 'java':
      return `import java.util.*;\n\nclass Solution {\n    public ${getJavaReturn(meta.returnType)} ${fn}(${getJavaParams(meta.params)}) {\n        // here goes the code\n        return ${getJavaReturnDefault(meta.returnType)};\n    }\n}`;
    case 'cpp':
      return `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <queue>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    ${getCppReturn(meta.returnType)} ${fn}(${getCppParams(meta.params)}) {\n        // here goes the code\n    }\n};`;
    case 'c':
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n\n${getCReturn(meta.returnType)} ${fn}(${getCParams(meta.params)}) {\n    // here goes the code\n}`;
    default:
      return `// here goes the code`;
  }
}

/**
 * Detects whether user wrote a "raw / free-form" program that already handles
 * stdin and produces stdout on its own — vs. a LeetCode-style function/class solution
 * that needs a harness around it.
 *
 * Rules per language:
 *  Python     → raw if code has `if __name__` OR no `class Solution` AND no `def <funcName>`
 *  JavaScript → raw if code has `process.stdin`, `require('fs')`, `readline` OR no class/function match
 *  Java       → raw if code has `public static void main`
 *  C / C++    → raw if code has `int main(`
 */
function isFreeFormCode(code: string, language: string, meta: ProblemMetadata): boolean {
  const trimmed = code.trim();
  switch (language) {
    case 'python':
      if (trimmed.includes('if __name__')) return true;
      if (trimmed.includes('input()') || trimmed.includes('sys.stdin')) {
        // Has input handling but no Solution class / named function → raw script
        const hasClass = trimmed.includes('class Solution');
        const hasFunc  = trimmed.includes(`def ${meta.funcName}`);
        if (!hasClass && !hasFunc) return true;
      }
      return false;

    case 'javascript':
      if (
        trimmed.includes("process.stdin") ||
        trimmed.includes("require('readline')") ||
        trimmed.includes('require("readline")') ||
        trimmed.includes("require('fs')") ||
        trimmed.includes('require("fs")')
      ) return true;
      // No class Solution and no matching function declaration → raw
      if (
        !trimmed.includes('class Solution') &&
        !trimmed.includes(`function ${meta.funcName}`) &&
        !trimmed.match(new RegExp(`\\b${meta.funcName}\\s*\\(`))
      ) return true;
      return false;

    case 'java':
      return trimmed.includes('public static void main');

    case 'cpp':
    case 'c':
      return trimmed.includes('int main(');

    default:
      return false;
  }
}

export function getWrappedCode(slug: string, language: string, code: string): string {
  const meta = problemsMetadata[slug];

  // ── No metadata for this problem → best-effort passthrough ──────────────
  if (!meta) {
    // If it already looks like a complete program, run as-is
    if (
      (language === 'python'     && (code.includes('if __name__') || code.includes('input()'))) ||
      (language === 'javascript' && (code.includes('process.stdin') || code.includes("require("))) ||
      (language === 'java'       && code.includes('public static void main')) ||
      (['cpp','c'].includes(language) && code.includes('int main('))
    ) {
      return code;
    }
    // Generic fallback wrapper for unknown slugs
    if (language === 'python') {
      return `import sys\n\n${code}\n\nif __name__ == '__main__':\n    solve()`;
    } else if (language === 'javascript') {
      return `const fs = require('fs');\n\n${code}\n\nsolve();`;
    }
    return code;
  }

  // ── Free-form / raw code detection ──────────────────────────────────────
  // If the user wrote a standalone program that already handles I/O, run it as-is.
  if (isFreeFormCode(code, language, meta)) {
    return code;
  }

  // ── Structured (LeetCode-style) — wrap with harness ─────────────────────
  if (language === 'python')     return getPythonWrapper(code, meta);
  if (language === 'javascript') return getJsWrapper(code, meta);
  if (language === 'java')       return getJavaWrapper(code, meta);
  if (language === 'cpp')        return getCppWrapper(code, meta);
  if (language === 'c')          return getCWrapper(code, meta);

  return code;
}

// Language Specific Wrappers

function getPythonWrapper(code: string, meta: ProblemMetadata): string {
  const fn = meta.funcName;
  let parseBlock = "";
  const argNames: string[] = [];
  let lineIdx = 0;

  meta.params.forEach((param, idx) => {
    const argName = `arg${idx}`;
    if (param === 'grid-char') {
      parseBlock += `    grid_dims = [int(x) for x in lines[${lineIdx}].strip().split()]\n`;
      parseBlock += `    r = grid_dims[0]\n`;
      parseBlock += `    ${argName} = []\n`;
      parseBlock += `    for i in range(r):\n`;
      parseBlock += `        ${argName}.append(lines[${lineIdx} + 1 + i].strip().split())\n`;
      parseBlock += `    arg_word = lines[${lineIdx} + 1 + r].strip()\n`;
      argNames.push(argName);
      argNames.push('arg_word');
      lineIdx += 1000;
    } else if (param === 'lines-array') {
      parseBlock += `    ${argName} = []\n`;
      parseBlock += `    for l in lines:\n`;
      parseBlock += `        parts = [int(x) for x in l.strip().split() if x]\n`;
      parseBlock += `        if len(parts) == 2:\n`;
      parseBlock += `            ${argName}.append(parts)\n`;
      argNames.push(argName);
    } else if (param === 'merge-k') {
      parseBlock += `    k = int(lines[0].strip())\n`;
      parseBlock += `    ${argName} = []\n`;
      parseBlock += `    for i in range(k):\n`;
      parseBlock += `        ${argName}.append([int(x) for x in lines[1+i].strip().split() if x])\n`;
      argNames.push(argName);
    } else if (param === 'json-array') {
      parseBlock += `    ${argName} = json.loads(lines[${lineIdx}])\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'int') {
      parseBlock += `    ${argName} = int(lines[${lineIdx}].strip())\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'char-array') {
      // Pass as a list of characters, matching LeetCode's contract
      parseBlock += `    ${argName} = list(lines[${lineIdx}].strip())\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'str') {
      parseBlock += `    ${argName} = lines[${lineIdx}].strip()\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-array') {
      parseBlock += `    ${argName} = [int(x) for x in lines[${lineIdx}].strip().split() if x]\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-str-array') {
      parseBlock += `    ${argName} = [x for x in lines[${lineIdx}].strip().split() if x]\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'two-ints') {
      parseBlock += `    parts${idx} = lines[${lineIdx}].strip().split()\n`;
      parseBlock += `    ${argName}1 = int(parts${idx}[0])\n`;
      parseBlock += `    ${argName}2 = int(parts${idx}[1])\n`;
      argNames.push(`${argName}1`);
      argNames.push(`${argName}2`);
      lineIdx++;
    }
  });

  let returnFormatter = "print(ans)";
  if (meta.returnType === 'bool') {
    returnFormatter = "print(str(ans).lower())";
  } else if (meta.returnType === 'json') {
    returnFormatter = "print(json.dumps(ans).replace(' ', ''))";
  } else if (meta.returnType === 'space-array') {
    returnFormatter = "print(' '.join(str(x) for x in ans))";
  } else if (meta.returnType === 'float') {
    returnFormatter = "print('{:.5f}'.format(ans))";
  } else if (meta.returnType === 'inplace-str') {
    // Function mutates arg0 in-place (like reverseString); print the mutated list joined as string
    const firstArg = argNames[0] || 'arg0';
    returnFormatter = `print(''.join(${firstArg}))`;
  }

  return `import sys\nimport json\n\n${code}\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    lines = [l for l in lines if l.strip() != ""]\n    if not lines:\n        sys.exit(0)\n${parseBlock}    if 'Solution' in globals():\n        sol = Solution()\n        ans = sol.${fn}(${argNames.join(', ')})\n    else:\n        ans = ${fn}(${argNames.join(', ')})\n    ${returnFormatter}`;
}

function getJsWrapper(code: string, meta: ProblemMetadata): string {
  const fn = meta.funcName;
  let parseBlock = "";
  const argNames: string[] = [];
  let lineIdx = 0;

  meta.params.forEach((param, idx) => {
    const argName = `arg${idx}`;
    if (param === 'grid-char') {
      parseBlock += `    const dims = lines[${lineIdx}].trim().split(/\\s+/).map(Number);\n`;
      parseBlock += `    const r = dims[0];\n`;
      parseBlock += `    const ${argName} = [];\n`;
      parseBlock += `    for (let i = 0; i < r; i++) {\n`;
      parseBlock += `        ${argName}.push(lines[${lineIdx} + 1 + i].trim().split(/\\s+/));\n`;
      parseBlock += `    }\n`;
      parseBlock += `    const word = lines[${lineIdx} + 1 + r].trim();\n`;
      argNames.push(argName);
      argNames.push('word');
      lineIdx += 1000;
    } else if (param === 'lines-array') {
      parseBlock += `    const ${argName} = [];\n`;
      parseBlock += `    for (let l of lines) {\n`;
      parseBlock += `        const parts = l.trim().split(/\\s+/).filter(x => x).map(Number);\n`;
      parseBlock += `        if (parts.length === 2) ${argName}.push(parts);\n`;
      parseBlock += `    }\n`;
      argNames.push(argName);
    } else if (param === 'merge-k') {
      parseBlock += `    const k = parseInt(lines[0].trim(), 10);\n`;
      parseBlock += `    const ${argName} = [];\n`;
      parseBlock += `    for (let i = 0; i < k; i++) {\n`;
      parseBlock += `        ${argName}.push(lines[1 + i].trim().split(/\\s+/).filter(x => x).map(Number));\n`;
      parseBlock += `    }\n`;
      argNames.push(argName);
    } else if (param === 'json-array') {
      parseBlock += `    const ${argName} = JSON.parse(lines[${lineIdx}]);\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'int') {
      parseBlock += `    const ${argName} = parseInt(lines[${lineIdx}].trim(), 10);\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'str') {
      parseBlock += `    const ${argName} = lines[${lineIdx}].trim();\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-array') {
      parseBlock += `    const ${argName} = lines[${lineIdx}].trim().split(/\\s+/).filter(x => x).map(Number);\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-str-array') {
      parseBlock += `    const ${argName} = lines[${lineIdx}].trim().split(/\\s+/).filter(x => x);\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'two-ints') {
      parseBlock += `    const parts${idx} = lines[${lineIdx}].trim().split(/\\s+/);\n`;
      parseBlock += `    const ${argName}1 = parseInt(parts${idx}[0], 10);\n`;
      parseBlock += `    const ${argName}2 = parseInt(parts${idx}[1], 10);\n`;
      argNames.push(`${argName}1`);
      argNames.push(`${argName}2`);
      lineIdx++;
    }
  });

  let returnFormatter = "console.log(ans);";
  if (meta.returnType === 'bool') {
    returnFormatter = "console.log(ans ? 'true' : 'false');";
  } else if (meta.returnType === 'json') {
    returnFormatter = "console.log(JSON.stringify(ans).replace(/\\s/g, ''));";
  } else if (meta.returnType === 'space-array') {
    returnFormatter = "console.log(ans.join(' '));";
  } else if (meta.returnType === 'float') {
    returnFormatter = "console.log(ans.toFixed(5));";
  }

  return `const fs = require('fs');\n\n${code}\n\nfunction main() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n').filter(l => l.trim() !== '');\n    if (lines.length === 0) return;\n${parseBlock}    let ans;\n    if (typeof Solution !== 'undefined') {\n        const sol = new Solution();\n        ans = sol.${fn}(${argNames.join(', ')});\n    } else if (typeof ${fn} === 'function') {\n        ans = ${fn}(${argNames.join(', ')});\n    }\n    ${returnFormatter}\n}\nmain();`;
}

function getJavaWrapper(code: string, meta: ProblemMetadata): string {
  const cleanCode = code.replace(/public\s+class\s+Solution/g, "class Solution");
  const fn = meta.funcName;
  let parseBlock = "";
  const argNames: string[] = [];
  let lineIdx = 0;

  meta.params.forEach((param, idx) => {
    const argName = `arg${idx}`;
    if (param === 'json-array') {
      parseBlock += `        String clean${idx} = lines.get(${lineIdx}).replace("[", "").replace("]", "").trim();\n`;
      parseBlock += `        int[] ${argName} = clean${idx}.isEmpty() ? new int[0] : Arrays.stream(clean${idx}.split(",")).map(String::trim).mapToInt(Integer::parseInt).toArray();\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'int') {
      parseBlock += `        int ${argName} = Integer.parseInt(lines.get(${lineIdx}).trim());\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'str') {
      parseBlock += `        String ${argName} = lines.get(${lineIdx}).trim();\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-array') {
      parseBlock += `        String s${idx} = lines.get(${lineIdx}).trim();\n`;
      parseBlock += `        int[] ${argName} = s${idx}.isEmpty() ? new int[0] : Arrays.stream(s${idx}.split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-str-array') {
      parseBlock += `        String s${idx} = lines.get(${lineIdx}).trim();\n`;
      parseBlock += `        String[] ${argName} = s${idx}.isEmpty() ? new String[0] : s${idx}.split("\\\\s+");\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'two-ints') {
      parseBlock += `        String[] parts${idx} = lines.get(${lineIdx}).trim().split("\\\\s+");\n`;
      parseBlock += `        int ${argName}1 = Integer.parseInt(parts${idx}[0]);\n`;
      parseBlock += `        int ${argName}2 = Integer.parseInt(parts${idx}[1]);\n`;
      argNames.push(`${argName}1`);
      argNames.push(`${argName}2`);
      lineIdx++;
    } else if (param === 'grid-char') {
      parseBlock += `        String[] dims = lines.get(${lineIdx}).trim().split("\\\\s+");\n`;
      parseBlock += `        int r = Integer.parseInt(dims[0]);\n`;
      parseBlock += `        char[][] ${argName} = new char[r][];\n`;
      parseBlock += `        for (int row=0; row<r; row++) {\n`;
      parseBlock += `            String[] chars = lines.get(${lineIdx} + 1 + row).trim().split("\\\\s+");\n`;
      parseBlock += `            ${argName}[row] = new char[chars.length];\n`;
      parseBlock += `            for (int col=0; col<chars.length; col++) ${argName}[row][col] = chars[col].charAt(0);\n`;
      parseBlock += `        }\n`;
      parseBlock += `        String word = lines.get(${lineIdx} + 1 + r).trim();\n`;
      argNames.push(argName);
      argNames.push('word');
      lineIdx += 1000;
    } else if (param === 'lines-array') {
      parseBlock += `        List<int[]> intervalsList = new ArrayList<>();\n`;
      parseBlock += `        for (int j = ${lineIdx}; j < lines.size(); j++) {\n`;
      parseBlock += `            String[] parts = lines.get(j).trim().split("\\\\s+");\n`;
      parseBlock += `            if (parts.length == 2) {\n`;
      parseBlock += `                intervalsList.add(new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1])});\n`;
      parseBlock += `            }\n`;
      parseBlock += `        }\n`;
      parseBlock += `        int[][] ${argName} = intervalsList.toArray(new int[0][]);\n`;
      argNames.push(argName);
    } else if (param === 'merge-k') {
      parseBlock += `        int k = Integer.parseInt(lines.get(${lineIdx}).trim());\n`;
      parseBlock += `        List<int[]> lists = new ArrayList<>();\n`;
      parseBlock += `        for (int j = 0; j < k; j++) {\n`;
      parseBlock += `            String s = lines.get(${lineIdx} + 1 + j).trim();\n`;
      parseBlock += `            lists.add(s.isEmpty() ? new int[0] : Arrays.stream(s.split("\\\\s+")).mapToInt(Integer::parseInt).toArray());\n`;
      parseBlock += `        }\n`;
      parseBlock += `        List<List<Integer>> ${argName} = new ArrayList<>();\n`;
      parseBlock += `        for (int[] arr : lists) {\n`;
      parseBlock += `            List<Integer> list = new ArrayList<>();\n`;
      parseBlock += `            for (int val : arr) list.add(val);\n`;
      parseBlock += `            ${argName}.add(list);\n`;
      parseBlock += `        }\n`;
      argNames.push(argName);
    }
  });

  let formatterBlock = "";
  const callStr = `sol.${fn}(${argNames.join(', ')})`;
  if (meta.returnType === 'bool') {
    formatterBlock = `System.out.println(${callStr} ? "true" : "false");`;
  } else if (meta.returnType === 'json') {
    formatterBlock = `System.out.println(formatJson(${callStr}));`;
  } else if (meta.returnType === 'space-array') {
    formatterBlock = `System.out.println(Arrays.toString(${callStr}).replace("[", "").replace("]", "").replace(",", ""));`;
  } else if (meta.returnType === 'float') {
    formatterBlock = `System.out.printf(Locale.US, "%.5f\\n", ${callStr});`;
  } else {
    formatterBlock = `System.out.println(${callStr});`;
  }

  const jsonFormatterHelper = `
    private static String formatJson(Object obj) {
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(formatJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        } else if (obj instanceof int[]) {
            return Arrays.toString((int[]) obj).replace(" ", "");
        } else if (obj instanceof int[][]) {
            int[][] grid = (int[][]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < grid.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(Arrays.toString(grid[i]).replace(" ", ""));
            }
            sb.append("]");
            return sb.toString();
        } else if (obj instanceof String[]) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < ((String[]) obj).length; i++) {
                if (i > 0) sb.append(",");
                sb.append("\\"" + ((String[]) obj)[i] + "\\"");
            }
            sb.append("]");
            return sb.toString();
        } else if (obj instanceof String) {
            return "\\"" + obj + "\\"";
        }
        return String.valueOf(obj);
    }
  `;

  return `import java.util.*;\nimport java.io.*;\nimport java.util.stream.*;\n\n${cleanCode}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        List<String> lines = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) {\n            if (!line.trim().isEmpty()) {\n                lines.add(line);\n            }\n        }\n        if (lines.isEmpty()) return;\n        \n${parseBlock}        Solution sol = new Solution();\n        ${formatterBlock}\n    }\n    ${meta.returnType === 'json' ? jsonFormatterHelper : ''}\n}\n`;
}

function getCppWrapper(code: string, meta: ProblemMetadata): string {
  const fn = meta.funcName;
  let parseBlock = "";
  const argNames: string[] = [];
  let lineIdx = 0;

  meta.params.forEach((param, idx) => {
    const argName = `arg${idx}`;
    if (param === 'json-array') {
      parseBlock += `    string clean${idx} = lines[${lineIdx}];\n`;
      parseBlock += `    clean${idx}.erase(remove(clean${idx}.begin(), clean${idx}.end(), '['), clean${idx}.end());\n`;
      parseBlock += `    clean${idx}.erase(remove(clean${idx}.begin(), clean${idx}.end(), ']'), clean${idx}.end());\n`;
      parseBlock += `    vector<int> ${argName};\n`;
      parseBlock += `    stringstream ss${idx}(clean${idx});\n`;
      parseBlock += `    string token${idx};\n`;
      parseBlock += `    while(getline(ss${idx}, token${idx}, ',')) {\n`;
      parseBlock += `        if (!token${idx}.empty()) ${argName}.push_back(stoi(token${idx}));\n`;
      parseBlock += `    }\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'int') {
      parseBlock += `    int ${argName} = stoi(lines[${lineIdx}]);\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'str') {
      parseBlock += `    string ${argName} = lines[${lineIdx}];\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-array') {
      parseBlock += `    vector<int> ${argName};\n`;
      parseBlock += `    stringstream ss${idx}(lines[${lineIdx}]);\n`;
      parseBlock += `    int val${idx};\n`;
      parseBlock += `    while (ss${idx} >> val${idx}) ${argName}.push_back(val${idx});\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-str-array') {
      parseBlock += `    vector<string> ${argName};\n`;
      parseBlock += `    stringstream ss${idx}(lines[${lineIdx}]);\n`;
      parseBlock += `    string val${idx};\n`;
      parseBlock += `    while (ss${idx} >> val${idx}) ${argName}.push_back(val${idx});\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'two-ints') {
      parseBlock += `    stringstream ss${idx}(lines[${lineIdx}]);\n`;
      parseBlock += `    int val${idx}_1, val${idx}_2;\n`;
      parseBlock += `    ss${idx} >> val${idx}_1 >> val${idx}_2;\n`;
      argNames.push(`val${idx}_1`);
      argNames.push(`val${idx}_2`);
      lineIdx++;
    } else if (param === 'grid-char') {
      parseBlock += `    stringstream ss${idx}(lines[${lineIdx}]);\n`;
      parseBlock += `    int r, c;\n`;
      parseBlock += `    ss${idx} >> r >> c;\n`;
      parseBlock += `    vector<vector<char>> ${argName}(r);\n`;
      parseBlock += `    for (int row=0; row<r; row++) {\n`;
      parseBlock += `        stringstream row_ss(lines[${lineIdx} + 1 + row]);\n`;
      parseBlock += `        char ch;\n`;
      parseBlock += `        while (row_ss >> ch) ${argName}[row].push_back(ch);\n`;
      parseBlock += `    }\n`;
      parseBlock += `    string word = lines[${lineIdx} + 1 + r];\n`;
      argNames.push(argName);
      argNames.push('word');
      lineIdx += 1000;
    } else if (param === 'lines-array') {
      parseBlock += `    vector<vector<int>> ${argName};\n`;
      parseBlock += `    for (size_t j = ${lineIdx}; j < lines.size(); j++) {\n`;
      parseBlock += `        stringstream ss(lines[j]);\n`;
      parseBlock += `        int a, b;\n`;
      parseBlock += `        if (ss >> a >> b) ${argName}.push_back({a, b});\n`;
      parseBlock += `    }\n`;
      argNames.push(argName);
    } else if (param === 'merge-k') {
      parseBlock += `    int k = stoi(lines[0]);\n`;
      parseBlock += `    vector<vector<int>> ${argName};\n`;
      parseBlock += `    for (int j = 0; j < k; j++) {\n`;
      parseBlock += `        vector<int> row;\n`;
      parseBlock += `        stringstream ss(lines[1 + j]);\n`;
      parseBlock += `        int val;\n`;
      parseBlock += `        while (ss >> val) row.push_back(val);\n`;
      parseBlock += `        ${argName}.push_back(row);\n`;
      parseBlock += `    }\n`;
      argNames.push(argName);
    }
  });

  let formatterBlock = "";
  const callStr = `sol.${fn}(${argNames.join(', ')})`;
  if (meta.returnType === 'bool') {
    formatterBlock = `cout << (ans ? "true" : "false") << endl;`;
  } else if (meta.returnType === 'json') {
    formatterBlock = `cout << formatJson(ans) << endl;`;
  } else if (meta.returnType === 'space-array') {
    formatterBlock = `for (size_t i=0; i<ans.size(); i++) cout << ans[i] << (i+1==ans.size()?"":" ");\n    cout << endl;`;
  } else if (meta.returnType === 'float') {
    formatterBlock = `printf("%.5f\\n", ans);`;
  } else {
    formatterBlock = `cout << ans << endl;`;
  }

  const jsonFormatterHelper = `
#include <sstream>
template<typename T>
string formatJson(const T& val) {
    stringstream ss;
    ss << val;
    return ss.str();
}
string formatJson(const string& val) {
    return "\\"" + val + "\\"";
}
string formatJson(bool val) {
    return val ? "true" : "false";
}
template<typename T>
string formatJson(const vector<T>& vec) {
    stringstream ss;
    ss << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        if (i > 0) ss << ",";
        ss << formatJson(vec[i]);
    }
    ss << "]";
    return ss.str();
}
`;

  return `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n#include <unordered_map>\n#include <unordered_set>\n#include <queue>\n\nusing namespace std;\n\n${meta.returnType === 'json' ? jsonFormatterHelper : ''}\n\n${code}\n\nint main() {\n    vector<string> lines;\n    string line;\n    while (getline(cin, line)) {\n        if (!line.empty()) {\n            lines.push_back(line);\n        }\n    }\n    if (lines.empty()) return 0;\n\n${parseBlock}    Solution sol;\n    auto ans = ${callStr};\n    ${formatterBlock}\n    return 0;\n}\n`;
}

function getCWrapper(code: string, meta: ProblemMetadata): string {
  const fn = meta.funcName;
  let parseBlock = "";
  const argNames: string[] = [];
  let lineIdx = 0;

  meta.params.forEach((param, idx) => {
    const argName = `arg${idx}`;
    if (param === 'json-array') {
      parseBlock += `    char clean${idx}[1000];\n`;
      parseBlock += `    strcpy(clean${idx}, lines[${lineIdx}]);\n`;
      parseBlock += `    int ${argName}Size = 0;\n`;
      parseBlock += `    int* ${argName} = parse_json_array(clean${idx}, &${argName}Size);\n`;
      argNames.push(argName);
      argNames.push(`${argName}Size`);
      lineIdx++;
    } else if (param === 'int') {
      parseBlock += `    int ${argName} = atoi(lines[${lineIdx}]);\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'str') {
      parseBlock += `    char* ${argName} = lines[${lineIdx}];\n`;
      argNames.push(argName);
      lineIdx++;
    } else if (param === 'space-array') {
      parseBlock += `    int ${argName}Size = 0;\n`;
      parseBlock += `    int* ${argName} = parse_space_array(lines[${lineIdx}], &${argName}Size);\n`;
      argNames.push(argName);
      argNames.push(`${argName}Size`);
      lineIdx++;
    } else if (param === 'space-str-array') {
      parseBlock += `    int ${argName}Size = 0;\n`;
      parseBlock += `    char** ${argName} = parse_space_str_array(lines[${lineIdx}], &${argName}Size);\n`;
      argNames.push(argName);
      argNames.push(`${argName}Size`);
      lineIdx++;
    } else if (param === 'two-ints') {
      parseBlock += `    int val${idx}_1, val${idx}_2;\n`;
      parseBlock += `    sscanf(lines[${lineIdx}], "%d %d", &val${idx}_1, &val${idx}_2);\n`;
      argNames.push(`val${idx}_1`);
      argNames.push(`val${idx}_2`);
      lineIdx++;
    }
  });

  let formatterBlock = "";
  if (meta.returnType === 'bool') {
    formatterBlock = `printf(ans ? "true\\n" : "false\\n");`;
  } else if (meta.returnType === 'val') {
    formatterBlock = `printf("%d\\n", ans);`;
  } else if (meta.returnType === 'float') {
    formatterBlock = `printf("%.5f\\n", ans);`;
  }

  const helpers = `
int* parse_space_array(char* line, int* size) {
    int* arr = malloc(2000 * sizeof(int));
    int count = 0;
    char* token = strtok(line, " \\t\\n\\r");
    while (token != NULL) {
        arr[count++] = atoi(token);
        token = strtok(NULL, " \\t\\n\\r");
    }
    *size = count;
    return arr;
}
int* parse_json_array(char* line, int* size) {
    char* clean = line;
    if (clean[0] == '[') clean++;
    int len = strlen(clean);
    if (clean[len-1] == ']') clean[len-1] = '\\0';
    
    int* arr = malloc(2000 * sizeof(int));
    int count = 0;
    char* token = strtok(clean, ",");
    while (token != NULL) {
        arr[count++] = atoi(token);
        token = strtok(NULL, ",");
    }
    *size = count;
    return arr;
}
  `;

  return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n\n${helpers}\n\n${code}\n\nint main() {\n    char lines[100][1000];\n    int line_count = 0;\n    char buffer[1000];\n    while (fgets(buffer, sizeof(buffer), stdin)) {\n        buffer[strcspn(buffer, "\\r\\n")] = 0;\n        if (strlen(buffer) > 0) {\n            strcpy(lines[line_count++], buffer);\n        }\n    }\n    if (line_count == 0) return 0;\n\n${parseBlock}    auto ans = ${fn}(${argNames.join(', ')});\n    ${formatterBlock}\n    return 0;\n}\n`;
}

function getPythonParams(params: string[]): string {
  return params.map((p, idx) => {
    const name = p.includes('array') || p === 'merge-k' ? 'nums' : p === 'str' ? 's' : 'x';
    const finalName = params.length > 1 ? `${name}${idx + 1}` : name;
    if (p === 'int') return `${finalName}: int`;
    if (p === 'str') return `${finalName}: str`;
    if (p === 'char-array') return `${finalName}: list[str]`;
    if (p === 'space-str-array') return `${finalName}: list[str]`;
    return `${finalName}: list[int]`;
  }).join(', ');
}

function getPythonReturn(ret: string): string {
  if (ret === 'bool') return 'bool';
  if (ret === 'val') return 'int';
  if (ret === 'float') return 'float';
  if (ret === 'space-array') return 'list[int]';
  if (ret === 'inplace-str') return 'None';
  return 'any';
}

function getJsParams(params: string[]): string {
  return params.map((p, idx) => {
    const name = p.includes('array') || p === 'merge-k' ? 'nums' : p === 'str' ? 's' : 'x';
    return params.length > 1 ? `${name}${idx + 1}` : name;
  }).join(', ');
}

function getJavaParams(params: string[]): string {
  return params.map((p, idx) => {
    const name = p.includes('array') || p === 'merge-k' ? 'nums' : p === 'str' ? 's' : 'x';
    const finalName = params.length > 1 ? `${name}${idx + 1}` : name;
    if (p === 'int') return `int ${finalName}`;
    if (p === 'str') return `String ${finalName}`;
    if (p === 'space-str-array') return `String[] ${finalName}`;
    return `int[] ${finalName}`;
  }).join(', ');
}

function getJavaReturn(ret: string): string {
  if (ret === 'bool') return 'boolean';
  if (ret === 'val') return 'int';
  if (ret === 'float') return 'double';
  if (ret === 'space-array') return 'int[]';
  return 'List<List<Integer>>';
}

function getJavaReturnDefault(ret: string): string {
  if (ret === 'bool') return 'false';
  if (ret === 'val') return '0';
  if (ret === 'float') return '0.0';
  if (ret === 'space-array') return 'new int[]{}';
  return 'new ArrayList<>()';
}

function getCppParams(params: string[]): string {
  return params.map((p, idx) => {
    const name = p.includes('array') || p === 'merge-k' ? 'nums' : p === 'str' ? 's' : 'x';
    const finalName = params.length > 1 ? `${name}${idx + 1}` : name;
    if (p === 'int') return `int ${finalName}`;
    if (p === 'str') return `string ${finalName}`;
    if (p === 'space-str-array') return `vector<string>& ${finalName}`;
    return `vector<int>& ${finalName}`;
  }).join(', ');
}

function getCppReturn(ret: string): string {
  if (ret === 'bool') return 'bool';
  if (ret === 'val') return 'int';
  if (ret === 'float') return 'double';
  if (ret === 'space-array') return 'vector<int>';
  return 'vector<vector<int>>';
}

function getCParams(params: string[]): string {
  return params.map((p, idx) => {
    const name = p.includes('array') || p === 'merge-k' ? 'nums' : p === 'str' ? 's' : 'x';
    const finalName = params.length > 1 ? `${name}${idx + 1}` : name;
    if (p === 'int') return `int ${finalName}`;
    if (p === 'str') return `char* ${finalName}`;
    if (p === 'space-str-array') return `char** ${finalName}, int ${finalName}Size`;
    return `int* ${finalName}, int ${finalName}Size`;
  }).join(', ');
}

function getCReturn(ret: string): string {
  if (ret === 'bool') return 'bool';
  if (ret === 'val') return 'int';
  if (ret === 'float') return 'double';
  if (ret === 'space-array') return 'int*';
  return 'int**';
}

export function getUnwrappedCode(code: string, language: string): string {
  const trimmed = code.trim();
  
  if (language === 'python') {
    const idx = trimmed.indexOf("if __name__ == '__main__':");
    if (idx !== -1) {
      let userCode = trimmed.substring(0, idx).trim();
      const prefix = "import sys\nimport json";
      if (userCode.replace(/\r/g, "").startsWith(prefix)) {
        userCode = userCode.substring(userCode.indexOf(prefix) + prefix.length).trim();
      }
      return userCode;
    }
  }
  
  if (language === 'javascript') {
    const idx = trimmed.indexOf("function main() {");
    if (idx !== -1) {
      let userCode = trimmed.substring(0, idx).trim();
      const prefix = "const fs = require('fs');";
      if (userCode.replace(/\r/g, "").startsWith(prefix)) {
        userCode = userCode.substring(userCode.indexOf(prefix) + prefix.length).trim();
      }
      return userCode;
    }
  }
  
  if (language === 'java') {
    const idx = trimmed.indexOf("public class Main {");
    if (idx !== -1) {
      let userCode = trimmed.substring(0, idx).trim();
      const prefix = "import java.util.*;\nimport java.io.*;\nimport java.util.stream.*;";
      if (userCode.replace(/\r/g, "").startsWith(prefix.replace(/\r/g, ""))) {
        userCode = userCode.substring(userCode.indexOf("import java.util.stream.*;") + "import java.util.stream.*;".length).trim();
      }
      return userCode;
    }
  }

  if (language === 'cpp') {
    const idx = trimmed.indexOf("int main() {");
    if (idx !== -1) {
      let userCode = trimmed.substring(0, idx).trim();
      const prefixMarker = "using namespace std;";
      const markerIdx = userCode.indexOf(prefixMarker);
      if (markerIdx !== -1) {
        userCode = userCode.substring(markerIdx + prefixMarker.length).trim();
      }
      // Also remove formatJson helper if present
      const helperMarker = "string formatJson(const vector<T>& vec)";
      const helperIdx = userCode.indexOf(helperMarker);
      if (helperIdx !== -1) {
        const helperEndMarker = "}";
        const afterHelperIdx = userCode.indexOf(helperEndMarker, helperIdx + helperMarker.length);
        if (afterHelperIdx !== -1) {
          userCode = userCode.substring(afterHelperIdx + 1).trim();
        }
      }
      return userCode;
    }
  }

  if (language === 'c') {
    const idx = trimmed.indexOf("int main() {");
    if (idx !== -1) {
      let userCode = trimmed.substring(0, idx).trim();
      const classSolutionIdx = userCode.indexOf("class Solution");
      const structSolutionIdx = userCode.indexOf("struct Solution");
      if (classSolutionIdx !== -1) {
        userCode = userCode.substring(classSolutionIdx).trim();
      } else if (structSolutionIdx !== -1) {
        userCode = userCode.substring(structSolutionIdx).trim();
      }
      return userCode;
    }
  }

  return code;
}
