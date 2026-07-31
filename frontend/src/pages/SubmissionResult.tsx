import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, Submission, Problem } from '../api'

// ─── Complexity / analysis helpers (duplicated from ProblemDetail for self-containment) ──────────

interface ComplexityInfo {
  time: string
  space: string
  tips: string
  approach: string
  keyInsight: string
}

const getComplexityAnalysis = (slug: string | undefined): ComplexityInfo => {
  const map: Record<string, ComplexityInfo> = {
    'two-sum': {
      time: 'O(N)', space: 'O(N)', approach: 'Hash Map',
      tips: 'A Hash Map achieves linear time O(N) by trading space complexity.',
      keyInsight: "Store each number's index as you iterate. For each element, check if its complement exists in the map.",
    },
    'reverse-string': {
      time: 'O(N)', space: 'O(1)', approach: 'Two Pointers',
      tips: 'An in-place two-pointer approach reverses the array with constant space.',
      keyInsight: 'Swap elements at the left and right pointers, moving them toward the center until they meet.',
    },
    'palindrome-number': {
      time: 'O(log₁₀N)', space: 'O(1)', approach: 'Math / Digit Reversal',
      tips: 'Reversing only half of the integer avoids potential overflow issues.',
      keyInsight: 'Negative numbers and numbers ending in 0 (except 0 itself) are never palindromes.',
    },
    'valid-parentheses': {
      time: 'O(N)', space: 'O(N)', approach: 'Stack',
      tips: 'Using a Stack ensures matching brackets are processed in LIFO order.',
      keyInsight: 'Push open brackets; for closing brackets, verify the top of the stack is the matching opener.',
    },
    'maximum-subarray': {
      time: 'O(N)', space: 'O(1)', approach: "Kadane's Algorithm / DP",
      tips: "Kadane's Algorithm maintains a running maximum subarray sum in a single pass.",
      keyInsight: 'If the current running sum drops below 0, reset it — a negative prefix never helps the subarray sum.',
    },
    'container-with-most-water': {
      time: 'O(N)', space: 'O(1)', approach: 'Greedy Two Pointers',
      tips: 'A two-pointer approach moving inwards from both ends ensures we maximize container width.',
      keyInsight: 'Always move the pointer pointing to the shorter line inward, since that is the only way to potentially increase area.',
    },
    'merge-two-sorted-lists': {
      time: 'O(N+M)', space: 'O(1)', approach: 'Iterative Linked List Merge',
      tips: 'Iterative merge with a dummy head node avoids complex edge cases.',
      keyInsight: 'Compare the heads of both lists, attach the smaller one to the result list, and advance that pointer.',
    },
    '3sum': {
      time: 'O(N²)', space: 'O(1)', approach: 'Sort + Two Pointers',
      tips: 'Sort the array first, then use a two-pointer approach for each fixed element.',
      keyInsight: 'Skip duplicate values for the outer loop and both inner pointers to avoid duplicate triplets.',
    },
    'longest-substring-without-repeating-characters': {
      time: 'O(N)', space: 'O(min(M,N))', approach: 'Sliding Window',
      tips: 'Sliding window with a hash set tracks unique characters in the current window.',
      keyInsight: 'When a duplicate is found, shrink the window from the left until the duplicate is removed.',
    },
    'trapping-rain-water': {
      time: 'O(N)', space: 'O(1)', approach: 'Two Pointers',
      tips: 'Two-pointer approach computes trapped water without extra space.',
      keyInsight: 'Water at any position is bounded by the minimum of the max-height walls on its left and right sides.',
    },
    'n-queens': {
      time: 'O(N!)', space: 'O(N)', approach: 'Backtracking',
      tips: 'Backtracking with column and diagonal sets prunes invalid paths efficiently.',
      keyInsight: 'Track occupied columns and both diagonals (row-col, row+col) to detect conflicts in O(1).',
    },
    'binary-search': {
      time: 'O(log N)', space: 'O(1)', approach: 'Binary Search',
      tips: 'Classic binary search halves the search space every iteration.',
      keyInsight: 'Avoid integer overflow when computing mid: use `left + (right - left) // 2`.',
    },
  }
  return map[slug ?? ''] ?? {
    time: 'O(N)', space: 'O(N)', approach: 'Algorithm',
    tips: 'Use dynamic programming, hash tables, or binary search to optimize runtime.',
    keyInsight: 'Consider the trade-offs between time and space complexity for your chosen approach.',
  }
}

const parseJudgeLog = (log: string | null) => {
  if (!log) return { passed: 0, failed: 0, total: 0 }
  const passed = (log.match(/Passed/gi) || []).length
  const failed = (log.match(/Failed/gi) || []).length
  return { passed, failed, total: passed + failed }
}

const STATUS_CONFIG: Record<string, { icon: string; label: string; colorClass: string; ringClass: string; gradFrom: string; gradTo: string; particleColor: string }> = {
  ACCEPTED:            { icon: '✓', label: 'Accepted',              colorClass: 'text-emerald-400', ringClass: 'ring-emerald-500/40', gradFrom: 'from-emerald-900/30', gradTo: 'to-emerald-800/10', particleColor: '#34d399' },
  WRONG_ANSWER:        { icon: '✗', label: 'Wrong Answer',          colorClass: 'text-red-400',     ringClass: 'ring-red-500/40',     gradFrom: 'from-red-900/30',     gradTo: 'to-red-800/10',     particleColor: '#f87171' },
  TIME_LIMIT_EXCEEDED: { icon: '⏱', label: 'Time Limit Exceeded',  colorClass: 'text-yellow-400',  ringClass: 'ring-yellow-500/40', gradFrom: 'from-yellow-900/30', gradTo: 'to-yellow-800/10', particleColor: '#facc15' },
  RUNTIME_ERROR:       { icon: '!', label: 'Runtime Error',         colorClass: 'text-orange-400',  ringClass: 'ring-orange-500/40', gradFrom: 'from-orange-900/30', gradTo: 'to-orange-800/10', particleColor: '#fb923c' },
  COMPILATION_ERROR:   { icon: '✗', label: 'Compilation Error',     colorClass: 'text-pink-400',    ringClass: 'ring-pink-500/40',   gradFrom: 'from-pink-900/30',   gradTo: 'to-pink-800/10',   particleColor: '#f472b6' },
  MEMORY_LIMIT_EXCEEDED:{ icon:'🗄', label:'Memory Limit Exceeded', colorClass: 'text-purple-400',  ringClass: 'ring-purple-500/40', gradFrom: 'from-purple-900/30', gradTo: 'to-purple-800/10', particleColor: '#c084fc' },
  INTERNAL_ERROR:      { icon: '?', label: 'Internal Error',        colorClass: 'text-gray-400',    ringClass: 'ring-gray-500/40',   gradFrom: 'from-gray-900/30',   gradTo: 'to-gray-800/10',   particleColor: '#9ca3af' },
}

// ─── Confetti particle component ───────────────────────────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#34d399','#60a5fa','#a78bfa','#f472b6','#facc15','#fb923c']
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      r: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 6,
      opacity: 1,
    }))

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 2)
        ctx.restore()
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotV
        if (p.y > canvas.height) p.opacity -= 0.02
      }
      if (particles.some(p => p.opacity > 0)) animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

// ─── Main Page ─────────────────────────────────────────────────────────────────────────────────
export default function SubmissionResult() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const sub = await api.getSubmission(Number(id))
        setSubmission(sub)
        const prob = await api.getProblemById(sub.problem_id)
        setProblem(prob)
      } catch {
        // submission or problem not found
      } finally {
        setLoading(false)
        setTimeout(() => setVisible(true), 50)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <span className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full" />
          <p className="text-gray-400 font-bold">Loading result…</p>
        </div>
      </div>
    )
  }

  if (!submission || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center space-y-4">
          <p className="text-2xl font-black text-white">Submission not found.</p>
          <button onClick={() => navigate('/problems')} className="glass-button-primary px-6 py-2 rounded-xl font-bold text-white">
            Back to Problems
          </button>
        </div>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[submission.status] ?? STATUS_CONFIG.INTERNAL_ERROR
  const isAccepted = submission.status === 'ACCEPTED'
  const complexity = getComplexityAnalysis(problem.slug)
  const tcStats = parseJudgeLog(submission.error_message)
  const runtime = submission.execution_time ?? 0
  const beats = runtime < 50 ? 98.4 : runtime < 100 ? 91.2 : runtime < 250 ? 84.6 : 67.3
  const linesOfCode = submission.code.split('\n').filter(l => l.trim() !== '').length
  const passRate = tcStats.total > 0
    ? isAccepted ? 100 : Math.round((tcStats.passed / tcStats.total) * 100)
    : isAccepted ? 100 : 0

  const handleDelete = async () => {
    if (!submission || !problem) return;
    if (window.confirm(`Delete submission #${submission.id}?`)) {
      try {
        await api.deleteSubmission(submission.id);
        navigate(`/problems/${problem.slug}`);
      } catch (err: any) {
        alert(err.response?.data?.detail || 'Failed to delete submission.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {isAccepted && <ConfettiCanvas />}

      {/* ── Hero band ────────────────────────────────────────────────────── */}
      <div className={`w-full bg-gradient-to-br ${cfg.gradFrom} ${cfg.gradTo} border-b border-white/5`}>
        <div className={`max-w-5xl mx-auto px-6 py-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-bold uppercase tracking-wider">
            <Link to="/problems" className="hover:text-gray-300 transition-colors">Problems</Link>
            <span>/</span>
            <Link to={`/problems/${problem.slug}`} className="hover:text-gray-300 transition-colors">{problem.title}</Link>
            <span>/</span>
            <span className="text-gray-400">Submission #{submission.id}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Status circle */}
            <div className={`flex-shrink-0 w-28 h-28 rounded-full ring-4 ${cfg.ringClass} bg-gray-900 flex items-center justify-center shadow-2xl`}>
              <span className={`text-4xl font-black ${cfg.colorClass}`}>{cfg.icon}</span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Result</p>
              <h1 className={`text-5xl font-black ${cfg.colorClass} leading-tight`}>{cfg.label}</h1>
              <p className="text-gray-400 mt-2 font-semibold text-sm">
                {problem.title} &nbsp;·&nbsp;
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${problem.difficulty === 'EASY' ? 'bg-emerald-900/40 text-emerald-300' :
                    problem.difficulty === 'MEDIUM' ? 'bg-yellow-900/40 text-yellow-300' :
                    'bg-red-900/40 text-red-300'}
                `}>{problem.difficulty}</span>
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 md:gap-8 flex-wrap">
              {[
                { label: 'Runtime', value: runtime > 0 ? `${runtime}ms` : 'N/A' },
                { label: 'Language', value: submission.language.toUpperCase() },
                { label: 'Lines', value: `${linesOfCode}` },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center md:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{s.label}</span>
                  <span className="text-2xl font-black text-white mt-0.5">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className={`max-w-5xl mx-auto px-6 py-10 space-y-6 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* ── Test case progress ── */}
        {tcStats.total > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Test Cases</h2>
              <span className="text-sm font-black text-gray-300">
                <span className={isAccepted ? 'text-emerald-400' : 'text-red-400'}>
                  {isAccepted ? tcStats.total : tcStats.passed}
                </span>
                &nbsp;/ {tcStats.total} passed
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${isAccepted
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                style={{ width: `${passRate}%` }}
              />
            </div>
            <div className="flex gap-5 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                {isAccepted ? tcStats.total : tcStats.passed} Passed
              </span>
              {!isAccepted && tcStats.failed > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                  {tcStats.failed} Failed
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Analysis */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-400 flex items-center gap-2">
              <span className="h-1 w-6 bg-brand-500 rounded-full inline-block" />
              Full Analysis
            </h2>

            {/* Complexity */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Time Complexity', value: complexity.time, sub: 'per operation' },
                { label: 'Space Complexity', value: complexity.space, sub: 'auxiliary memory' },
              ].map(c => (
                <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{c.label}</span>
                  <span className="text-2xl font-black text-white font-mono">{c.value}</span>
                  <span className="text-[10px] text-gray-600">{c.sub}</span>
                </div>
              ))}
            </div>

            {/* Approach + Ranking */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Optimal Approach</span>
                <span className="text-sm font-black text-brand-300 leading-tight mt-1">{complexity.approach}</span>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  {isAccepted ? 'Execution Ranking' : 'Runtime Recorded'}
                </span>
                {isAccepted
                  ? <span className="text-lg font-black text-emerald-400 mt-1">Beats {beats}%</span>
                  : <span className="text-lg font-black text-gray-400 mt-1">{runtime > 0 ? `${runtime}ms` : 'N/A'}</span>
                }
                <span className="text-[10px] text-gray-600">{isAccepted ? 'of all submissions' : 'before judge stopped'}</span>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-2">💡 Key Insight</p>
              <p className="text-sm text-indigo-200 leading-relaxed font-medium">{complexity.keyInsight}</p>
            </div>

            {/* Pro Tip */}
            <div className="bg-brand-950/20 border border-brand-800/20 rounded-xl p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-brand-400 mb-2">🚀 Pro Tip</p>
              <p className="text-sm text-brand-200 leading-relaxed font-medium">{complexity.tips}</p>
            </div>
          </div>

          {/* RIGHT: Judge Log + Code */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <span className="h-1 w-6 bg-gray-700 rounded-full inline-block" />
              {isAccepted ? 'Judge Log' : 'Error Details'}
            </h2>

            {submission.error_message ? (
              <pre className={`p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed border overflow-y-auto max-h-80 ${
                isAccepted
                  ? 'bg-emerald-950/20 text-emerald-300 border-emerald-900/30'
                  : submission.status === 'COMPILATION_ERROR'
                  ? 'bg-pink-950/20 text-pink-300 border-pink-900/30'
                  : 'bg-red-950/20 text-red-300 border-red-900/30'
              }`}>
                {submission.error_message}
              </pre>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-500 italic">No judge output available.</div>
            )}

            {/* Submission metadata */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">Submission Details</p>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {[
                  { k: 'Submission ID', v: `#${submission.id}` },
                  { k: 'Language', v: submission.language.toUpperCase() },
                  { k: 'Lines of Code', v: `${linesOfCode}` },
                  { k: 'Submitted At', v: new Date(submission.created_at).toLocaleString() },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <span className="block text-[10px] text-gray-600 font-bold uppercase tracking-wide">{k}</span>
                    <span className="text-gray-200 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Your Code ── */}
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
            <span className="h-1 w-6 bg-gray-700 rounded-full inline-block" />
            Your Code
          </h2>
          <pre className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96">
            {submission.code}
          </pre>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800">
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/problems/${problem.slug}`}
              className="px-6 py-3 rounded-xl font-black text-sm glass-button text-gray-200 border border-gray-700 hover:border-gray-500 transition-all"
            >
              ← Back to Problem
            </Link>
            {isAccepted && (
              <Link
                to="/problems"
                className="px-6 py-3 rounded-xl font-black text-sm bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg shadow-brand-500/20"
              >
                Solve Next Problem →
              </Link>
            )}
            {!isAccepted && (
              <Link
                to={`/problems/${problem.slug}`}
                className="px-6 py-3 rounded-xl font-black text-sm bg-red-600/80 hover:bg-red-500 text-white transition-all"
              >
                Try Again
              </Link>
            )}
            <Link
              to="/leaderboard"
              className="px-6 py-3 rounded-xl font-black text-sm glass-button text-gray-300 border border-gray-700 hover:border-gray-500 transition-all"
            >
              Leaderboard
            </Link>
          </div>
          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-xl font-black text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
          >
            🗑️ Delete Submission
          </button>
        </div>
      </div>
    </div>
  )
}
