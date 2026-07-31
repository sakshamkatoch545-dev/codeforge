import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { api, Problem, Submission, TestCase } from '../api'
import { getStarterCode, problemsMetadata, getWrappedCode as getWrappedCodeFromConfig } from '../problemsConfig'

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

  // Run Code state
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
    setCode(getStarterCode(problemSlug, lang));
  }

  // Update starter code when language changes
  useEffect(() => {
    if (!problem) return
    updateStarterCode(problem.slug, language)
  }, [language])

  const getWrappedCode = () => {
    if (!problem) return code;
    return getWrappedCodeFromConfig(problem.slug, language, code);
  }

  const handleRun = async () => {
    const token = localStorage.getItem('codeforge_token')
    if (!token) {
      alert('You must be logged in to run code.')
      navigate('/login')
      return
    }

    setRunning(true)
    setRunResult(null)
    setError('')
    setSubmission(null)

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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to run code.')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('codeforge_token')
    if (!token) {
      alert('You must be logged in to submit code.')
      navigate('/login')
      return
    }

    if (!problem) return

    setSubmitting(true)
    setSubmission(null)
    setRunResult(null)
    setError('')

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
          }
        } catch (pollErr) {
          clearInterval(interval)
          setSubmitting(false)
          setError('Failed to poll submission status.')
        }
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit solution.')
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
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'Fira Code, Menlo, Monaco, Consolas, Courier New, monospace',
              padding: { top: 16, bottom: 16 },
              lineHeight: 22,
            }}
          />
        </div>

        {/* Controls Bar (Moved away from header and made larger) */}
        <div className="h-20 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md flex items-center px-8 justify-between">
          <div className="flex items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-xl py-2.5 px-5 text-lg outline-none font-bold cursor-pointer shadow-sm"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="space-x-4 flex items-center">
            {running && (
              <span className="text-lg text-brand-600 animate-pulse font-bold mr-2">Running...</span>
            )}
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="px-8 py-3 text-lg font-black glass-button rounded-xl transition disabled:opacity-50 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105"
            >
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || running}
              className="px-8 py-3 text-lg font-black glass-button-primary rounded-xl transition disabled:opacity-50 shadow-md shadow-brand-500/30 hover:scale-105"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Results Panel overlay */}
        {(submission || submitting || error || runResult) && (
          <div className="absolute bottom-20 left-0 right-0 glass-panel !rounded-t-2xl !rounded-b-none border-t border-white/20 dark:border-white/10 shadow-2xl p-6 transition-all duration-300 z-20 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {runResult ? 'Run Output' : 'Submission Result'}
              </h3>
              <button
                onClick={() => {
                  setSubmission(null)
                  setRunResult(null)
                  setError('')
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            {/* Run Code Output */}
            {runResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${runResult.match ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {runResult.match ? 'Matches Expected Output!' : (runResult.status !== 'SUCCESS' ? runResult.status : 'Wrong Answer')}
                  </span>
                </div>
                
                {runResult.input && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Input</h4>
                    <div className="bg-gray-800 rounded p-3 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                      {runResult.input}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Your Output</h4>
                    <div className={`rounded p-3 font-mono text-sm whitespace-pre-wrap min-h-[40px] ${runResult.match ? 'bg-green-950/20 text-green-400 border border-green-900/30' : 'bg-red-950/20 text-red-400 border border-red-900/30'}`}>
                      {runResult.output || <span className="text-gray-600 italic">No output</span>}
                    </div>
                  </div>
                  
                  {runResult.expected && (
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Expected Output</h4>
                      <div className="bg-gray-800 rounded p-3 font-mono text-sm text-gray-300 whitespace-pre-wrap min-h-[40px]">
                        {runResult.expected}
                      </div>
                    </div>
                  )}
                </div>

                {runResult.error && (
                  <div>
                    <h4 className="text-xs font-bold text-red-400 uppercase mb-1">Standard Error</h4>
                    <div className="bg-red-950/20 rounded-lg p-3 font-mono text-sm text-red-400 whitespace-pre-wrap border border-red-900/30">
                      {runResult.error}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submission Output */}
            {submitting && (
              <div className="flex items-center gap-3 py-4 text-brand-600 dark:text-brand-400 font-semibold">
                <span className="animate-spin h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full" />
                <span>Running tests against code on judge worker (Status: {submission?.status || 'PENDING'})...</span>
              </div>
            )}

            {submission && !submitting && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-lg ${
                      submission.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : submission.status === 'WRONG_ANSWER'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}
                  >
                    {submission.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Execution time: {submission.execution_time !== null ? `${submission.execution_time}ms` : 'N/A'}
                  </span>
                </div>

                {submission.error_message && (
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Judge Log</h4>
                    <pre className={`p-4 rounded-lg text-xs overflow-x-auto border font-mono whitespace-pre-wrap ${
                      submission.status === 'ACCEPTED'
                        ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/20'
                    }`}>
                      {submission.error_message}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
