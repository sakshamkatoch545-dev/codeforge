import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { api, Problem, Submission, TestCase } from '../api'
import { getStarterCode, getWrappedCode as getWrappedCodeFromConfig, getUnwrappedCode } from '../problemsConfig'

const renderFormattedDescription = (text: string | undefined) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    const formatLineText = (txt: string) => {
      const parts = txt.split('`');
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <code key={i} className="px-2 py-0.5 mx-1 font-mono text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 rounded-md font-bold">
              {part}
            </code>
          );
        }
        return part;
      });
    };

    if (trimmed.startsWith('Example ') || trimmed.startsWith('Constraints:')) {
      elements.push(
        <h3 key={idx} className="text-xl font-extrabold mt-6 mb-3 text-gray-900 dark:text-white border-l-4 border-indigo-500 pl-3">
          {trimmed}
        </h3>
      );
    } else if (trimmed.startsWith('Input:') || trimmed.startsWith('Output:') || trimmed.startsWith('Explanation:')) {
      elements.push(
        <div key={idx} className="font-mono text-[0.95rem] pl-4 my-1 border-l-2 border-indigo-300 dark:border-indigo-800 text-gray-800 dark:text-gray-200 leading-relaxed font-bold">
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{trimmed.split(':')[0]}:</span>
          {formatLineText(trimmed.substring(trimmed.indexOf(':') + 1))}
        </div>
      );
    } else if (trimmed === '```' || trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${idx}`} className="p-4 my-3 font-mono text-[0.9rem] bg-gray-100/50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-xl overflow-x-auto leading-relaxed font-bold shadow-inner">
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
    } else if (inCodeBlock) {
      codeBlockLines.push(line);
    } else {
      if (trimmed !== '') {
        elements.push(
          <p key={idx} className="font-semibold text-[1.05rem] leading-relaxed text-gray-800 dark:text-gray-200">
            {formatLineText(line)}
          </p>
        );
      }
    }
  });

  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <pre key="code-leftover" className="p-4 my-3 font-mono text-[0.9rem] bg-gray-100/50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-xl overflow-x-auto leading-relaxed font-bold shadow-inner">
        <code>{codeBlockLines.join('\n')}</code>
      </pre>
    );
  }

  return <div className="space-y-4">{elements}</div>;
};

interface ComplexityInfo {
  time: string;
  space: string;
  tips: string;
  approach: string;
  keyInsight: string;
}

const getComplexityAnalysis = (slug: string | undefined): ComplexityInfo => {
  if (!slug) return {
    time: 'O(N)', space: 'O(N)',
    tips: 'Optimize your algorithm by minimizing nested loops.',
    approach: 'General',
    keyInsight: 'Consider using auxiliary data structures to trade space for time.'
  };
  
  const complexityMap: Record<string, ComplexityInfo> = {
    'two-sum': {
      time: 'O(N)', space: 'O(N)',
      tips: 'A Hash Map achieves linear time O(N) by trading space complexity.',
      approach: 'Hash Map',
      keyInsight: 'Store each number\'s index as you iterate. For each element, check if its complement exists in the map.'
    },
    'reverse-string': {
      time: 'O(N)', space: 'O(1)',
      tips: 'An in-place two-pointer approach reverses the array with constant space.',
      approach: 'Two Pointers',
      keyInsight: 'Swap elements at the left and right pointers, moving them toward the center until they meet.'
    },
    'palindrome-number': {
      time: 'O(log₁₀(N))', space: 'O(1)',
      tips: 'Reversing only half of the integer avoids potential overflow issues.',
      approach: 'Math / Digit Reversal',
      keyInsight: 'Negative numbers and numbers ending in 0 (except 0 itself) are never palindromes.'
    },
    'valid-parentheses': {
      time: 'O(N)', space: 'O(N)',
      tips: 'Using a Stack ensures matching brackets are processed in LIFO order.',
      approach: 'Stack',
      keyInsight: 'Push open brackets; for closing brackets, verify the top of the stack is the matching opener.'
    },
    'maximum-subarray': {
      time: 'O(N)', space: 'O(1)',
      tips: "Kadane's Algorithm maintains a running maximum subarray sum in a single pass.",
      approach: "Kadane's Algorithm / DP",
      keyInsight: 'If the current running sum drops below 0, reset it — a negative prefix never helps the subarray sum.'
    },
    'container-with-most-water': {
      time: 'O(N)', space: 'O(1)',
      tips: 'A two-pointer approach moving inwards from both ends ensures we maximize container width.',
      approach: 'Greedy Two Pointers',
      keyInsight: 'Always move the pointer pointing to the shorter line inward, since that is the only way to potentially increase area.'
    },
    'merge-two-sorted-lists': {
      time: 'O(N+M)', space: 'O(1)',
      tips: 'Iterative merge with a dummy head node avoids complex edge cases.',
      approach: 'Iterative Linked List Merge',
      keyInsight: 'Compare the heads of both lists, attach the smaller one to the result list, and advance that pointer.'
    },
    '3sum': {
      time: 'O(N²)', space: 'O(1)',
      tips: 'Sort the array first, then use a two-pointer approach for each fixed element.',
      approach: 'Sort + Two Pointers',
      keyInsight: 'Skip duplicate values for the outer loop and both inner pointers to avoid duplicate triplets.'
    },
    'longest-substring-without-repeating-characters': {
      time: 'O(N)', space: 'O(min(M,N))',
      tips: 'Sliding window with a hash set tracks unique characters in the current window.',
      approach: 'Sliding Window',
      keyInsight: 'When a duplicate is found, shrink the window from the left until the duplicate is removed.'
    },
    'trapping-rain-water': {
      time: 'O(N)', space: 'O(1)',
      tips: 'Two-pointer approach computes trapped water without extra space.',
      approach: 'Two Pointers',
      keyInsight: 'Water at any position is bounded by the minimum of the max-height walls on its left and right sides.'
    },
    'n-queens': {
      time: 'O(N!)', space: 'O(N)',
      tips: 'Backtracking with column and diagonal sets prunes invalid paths efficiently.',
      approach: 'Backtracking',
      keyInsight: 'Track occupied columns and both diagonals (row-col, row+col) to detect conflicts in O(1).'
    },
    'binary-search': {
      time: 'O(log N)', space: 'O(1)',
      tips: 'Classic binary search halves the search space every iteration.',
      approach: 'Binary Search',
      keyInsight: 'Avoid integer overflow when computing mid: use `left + (right - left) // 2`.'
    },
  };

  return complexityMap[slug] || {
    time: 'O(N)', space: 'O(N)',
    tips: 'Use dynamic programming, hash tables, or binary search to optimize runtime.',
    approach: 'Algorithm',
    keyInsight: 'Consider the trade-offs between time and space complexity for your chosen approach.'
  };
};

const parseJudgeLog = (log: string | null): { passed: number; failed: number; total: number } => {
  if (!log) return { passed: 0, failed: 0, total: 0 };
  const passedMatches = (log.match(/Passed/gi) || []).length;
  const failedMatches = (log.match(/Failed/gi) || []).length;
  const total = passedMatches + failedMatches;
  return { passed: passedMatches, failed: failedMatches, total };
};

const getStatusConfig = (status: string) => {
  const configs: Record<string, { icon: string; label: string; color: string; bg: string; border: string; glow: string }> = {
    ACCEPTED:           { icon: '✅', label: 'Accepted',             color: 'text-green-300',  bg: 'bg-green-900/20',  border: 'border-green-700/50',  glow: 'shadow-green-500/20' },
    WRONG_ANSWER:       { icon: '❌', label: 'Wrong Answer',          color: 'text-red-300',    bg: 'bg-red-900/20',    border: 'border-red-700/50',    glow: 'shadow-red-500/20' },
    TIME_LIMIT_EXCEEDED:{ icon: '⏱️', label: 'Time Limit Exceeded',   color: 'text-yellow-300', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', glow: 'shadow-yellow-500/20' },
    RUNTIME_ERROR:      { icon: '💥', label: 'Runtime Error',         color: 'text-orange-300', bg: 'bg-orange-900/20', border: 'border-orange-700/50', glow: 'shadow-orange-500/20' },
    COMPILATION_ERROR:  { icon: '🔧', label: 'Compilation Error',     color: 'text-pink-300',   bg: 'bg-pink-900/20',   border: 'border-pink-700/50',   glow: 'shadow-pink-500/20' },
    MEMORY_LIMIT_EXCEEDED:{ icon:'🗄️', label:'Memory Limit Exceeded', color: 'text-purple-300', bg: 'bg-purple-900/20', border: 'border-purple-700/50', glow: 'shadow-purple-500/20' },
    INTERNAL_ERROR:     { icon: '⚠️', label: 'Internal Error',        color: 'text-gray-300',   bg: 'bg-gray-900/20',   border: 'border-gray-700/50',   glow: 'shadow-gray-500/20' },
  };
  return configs[status] || configs.INTERNAL_ERROR;
};

export default function ProblemDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  
  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)

  // Console visibility state
  const [showConsole, setShowConsole] = useState(false)

  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<{output: string, error: string, status: string, expected?: string, match?: boolean, input?: string} | null>(null)

  useEffect(() => {
    async function loadProblem() {
      if (!slug) return
      try {
        const data = await api.getProblemBySlug(slug)
        setProblem(data)
        const tcs = await api.getProblemTestcases(data.id)
        setTestCases(tcs)
        
        // Setup initial starter code based on problem and language
        updateStarterCode(data.slug, 'python')
      } catch (err) {
        setError('Failed to load problem details.')
      } finally {
        setLoading(false)
      }
    }
    loadProblem()
  }, [slug])

  const updateStarterCode = (problemSlug: string, lang: string) => {
    const saved = localStorage.getItem(`codeforge_code_${problemSlug}_${lang}`);
    if (saved !== null) {
      setCode(saved);
    } else {
      setCode(getStarterCode(problemSlug, lang));
    }
  }

  const handleCodeChange = (val: string | undefined) => {
    const newCode = val || '';
    setCode(newCode);
    if (problem) {
      localStorage.setItem(`codeforge_code_${problem.slug}_${language}`, newCode);
    }
  }

  const handleResetCode = () => {
    if (!problem) return;
    if (window.confirm('Reset code to original starter template?')) {
      localStorage.removeItem(`codeforge_code_${problem.slug}_${language}`);
      setCode(getStarterCode(problem.slug, language));
    }
  }

  // Update code when language changes
  useEffect(() => {
    if (!problem) return
    updateStarterCode(problem.slug, language)
  }, [language, problem])

  const getWrappedCode = () => {
    if (!problem) return code;
    return getWrappedCodeFromConfig(problem.slug, language, code);
  }

  // Auth Requirement Modal state
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleRun = async () => {
    const token = localStorage.getItem('codeforge_token')
    if (!token) {
      setShowAuthModal(true)
      return
    }

    setRunning(true)
    setRunResult(null)
    setError('')
    setSubmission(null)
    setShowConsole(true)

    try {
      let langParam = 'python'
      if (language === 'javascript') langParam = 'javascript'
      
      const tc = testCases.length > 0 ? testCases[0] : null
      const inputData = tc ? tc.input_data : ''
      const expectedOutput = tc ? tc.expected_output.trim() : ''
      
      const wrappedCode = getWrappedCode()

      const res = await api.runCode(wrappedCode, langParam, inputData)
      
      setRunResult({
        ...res,
        input: inputData,
        expected: expectedOutput,
        match: res.status === 'SUCCESS' && res.output.trim() === expectedOutput
      })
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Failed to run code.')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('codeforge_token')
    if (!token) {
      setShowAuthModal(true)
      return
    }

    if (!problem) return

    setSubmitting(true)
    setSubmission(null)
    setRunResult(null)
    setError('')
    setShowConsole(true)

    try {
      let langParam = 'python'
      if (language === 'javascript') langParam = 'javascript'
      if (language === 'c') langParam = 'c'
      if (language === 'cpp') langParam = 'cpp'
      if (language === 'java') langParam = 'java'
      
      const wrappedCode = getWrappedCode()

      const sub = await api.submitSolution(problem.id, langParam, wrappedCode)
      setSubmission(sub)

      const interval = setInterval(async () => {
        try {
          const updatedSub = await api.getSubmission(sub.id)
          setSubmission(updatedSub)
          if (updatedSub.status !== 'PENDING' && updatedSub.status !== 'RUNNING') {
            clearInterval(interval)
            setSubmitting(false)
            // Navigate to the dedicated results page
            navigate(`/submissions/${updatedSub.id}`)
          }
        } catch (pollErr) {
          clearInterval(interval)
          setSubmitting(false)
          setError('Failed to poll submission status.')
        }
      }, 1000)
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Failed to submit solution.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 text-lg">Loading problem info...</div>
      </div>
    )
  }

  if (error && !problem) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <>
    <div className="flex flex-col lg:flex-row gap-6 mb-12 mt-20 mx-6 max-w-7xl lg:mx-auto">

      {/* Problem Description Panel */}
      <div className="relative z-10 w-full lg:w-1/2 p-8 border border-white/20 dark:border-white/10 glass-panel shadow-2xl rounded-2xl flex flex-col justify-between min-h-[500px]">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                problem?.difficulty === 'EASY'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : problem?.difficulty === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {problem?.difficulty}
            </span>
            <span className="text-xs text-gray-500">Limits: {problem?.time_limit}ms / {problem?.memory_limit}MB</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            {problem?.title}
          </h1>

          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            {renderFormattedDescription(problem?.description)}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-8 text-xs text-gray-500">
          Created at: {problem && new Date(problem.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Code Editor Panel */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-md glass-panel shadow-2xl rounded-2xl overflow-hidden">


        {/* Editor Container */}
        <div className="h-[550px] border-b border-white/20 dark:border-white/10">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'Fira Code, Menlo, Monaco, Consolas, Courier New, monospace',
              padding: { top: 16, bottom: 16 },
              lineHeight: 22,
            }}
          />
        </div>

        {/* Controls Bar */}
        <div className="h-auto md:h-20 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md flex flex-col md:flex-row items-center px-4 md:px-8 py-4 md:py-0 justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-xl py-2 px-3 md:py-2.5 md:px-5 text-sm md:text-lg outline-none font-bold cursor-pointer shadow-sm"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={handleResetCode}
              className="px-3 py-2 text-xs font-bold bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition cursor-pointer"
              title="Reset code to original starter code"
            >
              ↺ Reset
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {running && (
              <span className="text-sm md:text-lg text-brand-600 animate-pulse font-bold mr-2">Running...</span>
            )}
            {(runResult || submission || error || submitting) && (
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-extrabold rounded-xl border transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                  showConsole
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 hover:bg-brand-500/30'
                    : 'bg-gray-800/80 text-gray-200 border-gray-700 hover:bg-gray-700'
                }`}
                title={showConsole ? "Hide Execution Console" : "Show Execution Console"}
              >
                <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                Console {showConsole ? '▼' : '▲'}
              </button>
            )}
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg font-black glass-button rounded-xl transition disabled:opacity-50 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105"
            >
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || running}
              className="px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg font-black glass-button-primary rounded-xl transition disabled:opacity-50 shadow-md shadow-brand-500/30 hover:scale-105"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Results Panel overlay */}
        {showConsole && (submission || submitting || error || runResult) && (
          <div className="absolute bottom-[88px] left-3 right-3 bg-gray-950/98 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl shadow-black/90 z-20 max-h-[380px] overflow-y-auto">
            {/* Console Header Bar */}
            <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md z-10 flex justify-between items-center px-6 py-3.5 border-b border-gray-800/80">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-brand-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                {runResult ? '💻 Execution Console' : '🚀 Submission Judge'}
              </h3>
              <button
                onClick={() => setShowConsole(false)}
                className="bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hide Console
              </button>
            </div>
            <div className="px-6 py-5">

            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            {/* Run Code Output */}
            {runResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                    runResult.match
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-900/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/40 shadow-red-900/30'
                  }`}>
                    {runResult.match ? '✓ Matches Expected Output!' : (runResult.status !== 'SUCCESS' ? runResult.status : '✗ Wrong Answer')}
                  </span>
                </div>
                
                {runResult.input && (
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-300 uppercase tracking-widest mb-1.5">Input</h4>
                    <div className="bg-gray-900/90 border border-gray-700/80 rounded-xl p-3.5 font-mono text-base font-bold text-white whitespace-pre-wrap leading-relaxed shadow-inner">
                      {runResult.input}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      Your Output
                      {runResult.match && <span className="text-emerald-400 font-bold">✓</span>}
                    </h4>
                    <div className={`rounded-xl p-3.5 font-mono text-base font-bold whitespace-pre-wrap leading-relaxed min-h-[48px] shadow-inner ${
                      runResult.match
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/50'
                        : 'bg-red-950/40 text-red-300 border border-red-500/50'
                    }`}>
                      {runResult.output || <span className="text-gray-500 italic">No output produced</span>}
                    </div>
                  </div>
                  
                  {runResult.expected && (
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-300 uppercase tracking-widest mb-1.5 text-emerald-400">Expected Output</h4>
                      <div className="bg-gray-900/90 border border-emerald-900/50 text-emerald-300 rounded-xl p-3.5 font-mono text-base font-bold whitespace-pre-wrap leading-relaxed min-h-[48px] shadow-inner">
                        {runResult.expected}
                      </div>
                    </div>
                  )}
                </div>

                {runResult.error && (
                  <div>
                    <h4 className="text-xs font-extrabold text-red-400 uppercase tracking-widest mb-1.5">Standard Error</h4>
                    <div className="bg-red-950/50 rounded-xl p-3.5 font-mono text-sm font-bold text-red-300 whitespace-pre-wrap border border-red-500/40 shadow-inner">
                      {runResult.error}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submission Output — Loading State */}
            {submitting && (
              <div className="flex flex-col gap-3 py-5">
                <div className="flex items-center gap-3 text-brand-400 font-semibold">
                  <span className="animate-spin h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full" />
                  <span>Judge worker is evaluating your code…</span>
                </div>
                <div className="text-xs text-gray-500">Status: <span className="text-brand-400 font-bold">{submission?.status || 'PENDING'}</span></div>
              </div>
            )}

            {/* Full Submission Analysis */}
            {submission && !submitting && (() => {
              const statusCfg = getStatusConfig(submission.status);
              const complexity = getComplexityAnalysis(problem?.slug);
              const tcStats = parseJudgeLog(submission.error_message);
              const runtime = submission.execution_time || 0;
              const beats = runtime < 50 ? 98.4 : runtime < 100 ? 91.2 : runtime < 250 ? 84.6 : 67.3;
              const unwrappedCode = getUnwrappedCode(submission.code, submission.language);
              const linesOfCode = unwrappedCode.split('\n').filter(l => l.trim() !== '').length;
              const isAccepted = submission.status === 'ACCEPTED';

              return (
                <div className="space-y-4 animate-in">

                  {/* ── Status Banner ── */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${statusCfg.bg} ${statusCfg.border} shadow-lg ${statusCfg.glow}`}>
                    <span className="text-2xl">{statusCfg.icon}</span>
                    <div>
                      <p className={`text-lg font-black ${statusCfg.color}`}>{statusCfg.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {runtime > 0 ? `Runtime: ${runtime}ms` : 'No runtime recorded'} &nbsp;·&nbsp;
                        {linesOfCode} line{linesOfCode !== 1 ? 's' : ''} of code &nbsp;·&nbsp;
                        Language: <span className="font-bold text-gray-400 capitalize">{submission.language}</span>
                      </p>
                    </div>
                  </div>

                  {/* ── Test Cases Progress ── */}
                  {tcStats.total > 0 && (
                    <div className="bg-gray-900/90 border border-gray-700/80 rounded-xl p-4 shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-300">Test Case Results</span>
                        <span className="text-sm font-black text-gray-200">
                          <span className={isAccepted ? 'text-emerald-400' : 'text-emerald-400'}>{isAccepted ? tcStats.total : tcStats.passed}</span> / {tcStats.total} passed
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isAccepted ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                          style={{ width: `${isAccepted ? 100 : Math.round(((tcStats.passed) / tcStats.total) * 100)}%` }}
                        />
                      </div>
                      <div className="flex gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                          {isAccepted ? tcStats.total : tcStats.passed} Passed
                        </span>
                        {!isAccepted && tcStats.failed > 0 && (
                          <span className="flex items-center gap-1.5 text-xs text-red-400 font-extrabold">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />
                            {tcStats.failed} Failed
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Judge Log / Error Details ── */}
                  {submission.error_message && (
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-300 mb-2">
                        {isAccepted ? '📋 Judge Log' : '🔍 Error Details'}
                      </h4>
                      <pre className={`p-4 rounded-xl text-sm font-bold overflow-x-auto border font-mono whitespace-pre-wrap leading-relaxed shadow-inner ${
                        isAccepted
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                          : submission.status === 'COMPILATION_ERROR'
                          ? 'bg-pink-950/40 text-pink-300 border-pink-500/40'
                          : 'bg-red-950/40 text-red-300 border-red-500/40'
                      }`}>
                        {submission.error_message}
                      </pre>
                    </div>
                  )}

                  {/* ── Full Analysis (always shown) ── */}
                  <div className="border border-gray-700/80 bg-gray-900/90 rounded-2xl p-5 flex flex-col gap-4 shadow-inner">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-400 flex items-center gap-2">
                      <span>📊</span> Full Analysis
                    </h4>

                    {/* Complexity Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-950/80 border border-gray-700/80 rounded-xl p-3.5 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Time Complexity</span>
                        <span className="text-2xl font-black text-white font-mono">{complexity.time}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">per operation</span>
                      </div>
                      <div className="bg-gray-950/80 border border-gray-700/80 rounded-xl p-3.5 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Space Complexity</span>
                        <span className="text-2xl font-black text-white font-mono">{complexity.space}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">auxiliary memory</span>
                      </div>
                    </div>

                    {/* Approach Tag + Runtime Ranking (if accepted) */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-950/80 border border-gray-700/80 rounded-xl p-3.5 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Optimal Approach</span>
                        <span className="text-sm font-black text-brand-300 leading-tight mt-0.5">{complexity.approach}</span>
                      </div>
                      <div className="bg-gray-950/80 border border-gray-700/80 rounded-xl p-3.5 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          {isAccepted ? 'Execution Ranking' : 'Runtime Recorded'}
                        </span>
                        {isAccepted ? (
                          <span className="text-base font-black text-emerald-400 mt-0.5">Beats {beats}%</span>
                        ) : (
                          <span className="text-base font-black text-gray-300 mt-0.5">{runtime > 0 ? `${runtime}ms` : 'N/A'}</span>
                        )}
                        <span className="text-[10px] text-gray-400">{isAccepted ? 'of all submissions' : 'before judge stopped'}</span>
                      </div>
                    </div>

                    {/* Key Insight */}
                    <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-1.5">💡 Key Insight</p>
                      <p className="text-sm text-indigo-200 leading-relaxed font-semibold">{complexity.keyInsight}</p>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-brand-950/30 border border-brand-500/30 rounded-xl p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-400 mb-1.5">🚀 Pro Tip</p>
                      <p className="text-sm text-brand-200 leading-relaxed font-semibold">{complexity.tips}</p>
                    </div>

                    {/* Code Stats */}
                    <div className="flex gap-6 pt-2 border-t border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Lines Written</span>
                        <span className="text-sm font-black text-white">{linesOfCode}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Language</span>
                        <span className="text-sm font-black text-white capitalize">{submission.language}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Submitted</span>
                        <span className="text-sm font-black text-white">{new Date(submission.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            </div>{/* end px-6 pb-5 inner wrapper */}
          </div>
        )}
      </div>
    </div>

      {/* ── Auth Requirement Modal ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 max-w-sm w-full rounded-2xl p-7 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center text-3xl mx-auto">
              🔒
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Login Required</h3>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                You need an account to run code, execute tests, and submit solutions on CodeForge.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-black transition shadow-lg cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Register (New Account)
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-gray-500 hover:text-gray-300 transition py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
