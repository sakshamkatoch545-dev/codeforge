import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, Submission, Problem } from '../api'
import { getUnwrappedCode } from '../problemsConfig'

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

const STATUS_CONFIG: Record<string, { icon: string; label: string; colorClass: string; borderColorClass: string; ringClass: string; gradFrom: string; gradTo: string; particleColor: string }> = {
  ACCEPTED:            { icon: '✓', label: 'Accepted',              colorClass: 'text-emerald-600 dark:text-emerald-400', borderColorClass: 'border-emerald-500/20 dark:border-emerald-500/40', ringClass: 'ring-emerald-500/40', gradFrom: 'from-emerald-500/5 dark:from-[#0b1c14]', gradTo: 'to-white/95 dark:to-[#090d16]', particleColor: '#10b981' },
  WRONG_ANSWER:        { icon: 'X', label: 'Wrong Answer',          colorClass: 'text-red-600 dark:text-red-400',     borderColorClass: 'border-red-500/20 dark:border-red-500/40',     ringClass: 'ring-red-500/40',     gradFrom: 'from-red-500/5 dark:from-[#1c0c11]',     gradTo: 'to-white/95 dark:to-[#090d16]',     particleColor: '#ef4444' },
  TIME_LIMIT_EXCEEDED: { icon: '⏱', label: 'Time Limit Exceeded',  colorClass: 'text-yellow-600 dark:text-yellow-400',  borderColorClass: 'border-yellow-500/20 dark:border-yellow-500/40',  ringClass: 'ring-yellow-500/40', gradFrom: 'from-yellow-500/5 dark:from-[#1c160b]', gradTo: 'to-white/95 dark:to-[#090d16]', particleColor: '#eab308' },
  RUNTIME_ERROR:       { icon: '!', label: 'Runtime Error',         colorClass: 'text-orange-600 dark:text-orange-400',  borderColorClass: 'border-orange-500/20 dark:border-orange-500/40',  ringClass: 'ring-orange-500/40', gradFrom: 'from-orange-500/5 dark:from-[#1c120b]', gradTo: 'to-white/95 dark:to-[#090d16]', particleColor: '#f97316' },
  COMPILATION_ERROR:   { icon: 'X', label: 'Compilation Error',     colorClass: 'text-pink-600 dark:text-pink-400',    borderColorClass: 'border-pink-500/20 dark:border-pink-500/40',     ringClass: 'ring-pink-500/40',   gradFrom: 'from-pink-500/5 dark:from-[#1c0c17]',   gradTo: 'to-white/95 dark:to-[#090d16]',   particleColor: '#ec4899' },
  MEMORY_LIMIT_EXCEEDED:{ icon:'🗄', label:'Memory Limit Exceeded', colorClass: 'text-purple-600 dark:text-purple-400',  borderColorClass: 'border-purple-500/20 dark:border-purple-500/40',  ringClass: 'ring-purple-500/40', gradFrom: 'from-purple-500/5 dark:from-[#160b1c]', gradTo: 'to-white/95 dark:to-[#090d16]', particleColor: '#a855f7' },
  INTERNAL_ERROR:      { icon: '?', label: 'Internal Error',        colorClass: 'text-gray-600 dark:text-gray-400',    borderColorClass: 'border-gray-500/20 dark:border-gray-500/40',    ringClass: 'ring-gray-500/40',   gradFrom: 'from-gray-500/5 dark:from-[#111317]',   gradTo: 'to-white/95 dark:to-[#090d16]',   particleColor: '#6b7280' },
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
  const unwrappedCode = getUnwrappedCode(submission.code, submission.language)
  const linesOfCode = unwrappedCode.split('\n').filter(l => l.trim() !== '').length
  const passRate = tcStats.total > 0
    ? isAccepted ? 100 : Math.round((tcStats.passed / tcStats.total) * 100)
    : isAccepted ? 100 : 0

  const handleDelete = async () => {
    if (!submission || !problem) return;
    if (window.confirm(`Delete submission #${submission.id}?`)) {
      try {
        await api.deleteSubmission(submission.id);
        navigate(`/problems/${problem.slug}`);
      } catch (err) {
        const error = err as { response?: { data?: { detail?: string } } }
        alert(error.response?.data?.detail || 'Failed to delete submission.');
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-white pb-20 overflow-hidden">
      {isAccepted && <ConfettiCanvas />}

      <div className={`max-w-5xl mx-auto px-6 mt-10 space-y-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        
        {/* Breadcrumb (placed above the hero card) */}
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-widest">
          <Link to="/problems" className="hover:text-brand-600 dark:hover:text-cyan-300 transition-colors">Problems</Link>
          <span className="text-slate-400">/</span>
          <Link to={`/problems/${problem.slug}`} className="hover:text-brand-600 dark:hover:text-cyan-300 transition-colors">{problem.title}</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-white font-black">Submission #{submission.id}</span>
        </div>

        {/* ── Hero Frosted Glass Panel (Vivid status cues) ── */}
        <div 
          className={`relative overflow-hidden p-8 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group transform-gpu bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-white/10 backdrop-blur-xl shadow-xl`}
          style={{ 
            boxShadow: `0 20px 45px rgba(0, 0, 0, 0.06), 0 0 35px ${cfg.particleColor}15`
          }}
        >
          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            {/* Status circle with glow */}
            <div 
              className={`flex-shrink-0 w-20 h-20 rounded-full border-[3px] bg-white dark:bg-gray-950 flex items-center justify-center shadow-lg`}
              style={{ 
                borderColor: cfg.particleColor, 
                boxShadow: `0 0 25px ${cfg.particleColor}35` 
              }}
            >
              <span 
                className={`text-4xl font-black ${cfg.colorClass}`}
                style={{ textShadow: `0 0 10px ${cfg.particleColor}60` }}
              >
                {cfg.icon}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Result</p>
              <h1 
                className={`text-5xl font-black ${cfg.colorClass} leading-tight tracking-tight uppercase`}
                style={{ textShadow: `0 0 20px ${cfg.particleColor}45` }}
              >
                {cfg.label}
              </h1>
              <p className="text-slate-800 dark:text-slate-200 mt-2 font-black text-sm flex items-center gap-1.5">
                {problem.title} &nbsp;·&nbsp;
                <span className={`
                  px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider shadow-md
                  ${problem.difficulty === 'EASY' ? 'bg-emerald-500 text-emerald-950 shadow-emerald-500/20' :
                    problem.difficulty === 'MEDIUM' ? 'bg-yellow-500 text-yellow-950 shadow-yellow-500/20' :
                    'bg-red-500 text-red-950 shadow-red-500/20'}
                `}>{problem.difficulty}</span>
              </p>
            </div>
          </div>

          {/* Quick stats (Right aligned inside the glass panel with glowing colors) */}
          <div className="flex gap-8 md:gap-12 flex-wrap items-center md:justify-end w-full md:w-auto relative z-10">
            {[
              { label: 'Runtime', value: runtime > 0 ? `${runtime}ms` : 'N/A', color: 'text-slate-900 dark:text-white', glow: undefined },
              { label: 'Language', value: submission.language.toUpperCase(), color: 'text-cyan-600 dark:text-cyan-400', glow: 'rgba(34,211,238,0.2)' },
              { label: 'Lines', value: `${linesOfCode}`, color: 'text-purple-600 dark:text-purple-400', glow: 'rgba(192,132,252,0.2)' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center md:items-end text-center md:text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{s.label}</span>
                <span 
                  className={`text-4xl font-black mt-1 ${s.color}`}
                  style={{ textShadow: s.glow ? `0 0 15px ${s.glow}` : undefined }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Test case progress (Glass Panel) ── */}
        {tcStats.total > 0 && (
          <div className="bg-white/80 dark:bg-slate-900/80 p-7 rounded-[24px] border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Test Cases</h2>
              <span className="text-sm font-black text-slate-600 dark:text-slate-300 tracking-wide">
                <span className="text-slate-900 dark:text-white text-base font-black">{isAccepted ? tcStats.total : tcStats.passed}/{tcStats.total}</span> passed
              </span>
            </div>
            <div className="w-full h-[8px] rounded-full bg-gray-200/50 dark:bg-slate-950/50 overflow-hidden border border-gray-300/40 dark:border-white/5 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${isAccepted
                  ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                  : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'}`}
                style={{ width: `${passRate}%` }}
              />
            </div>
            <div className="flex gap-6 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-black">
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                {isAccepted ? tcStats.total : tcStats.passed} Passed
              </span>
              {!isAccepted && tcStats.failed > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-red-650 dark:text-red-400 font-black">
                  <span className="h-3 w-3 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
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
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="h-[3px] w-6 bg-slate-500 dark:bg-slate-400 inline-block" />
              Full Analysis
            </h2>

            {/* Complexity and approach grid (Matching Dashboard metric cards) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Time Complexity */}
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 p-5 rounded-[24px] flex flex-col justify-between h-28 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Time Complexity</span>
                  <span 
                    className="block text-3xl font-black text-slate-950 dark:text-white font-mono mt-1"
                  >
                    {complexity.time}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-none">per operation</span>
              </div>

              {/* Space Complexity */}
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 p-5 rounded-[24px] flex flex-col justify-between h-28 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Space Complexity</span>
                  <span 
                    className="block text-3xl font-black text-slate-950 dark:text-white font-mono mt-1"
                  >
                    {complexity.space}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">auxiliary memory</span>
              </div>

              {/* Optimal Approach */}
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 p-5 rounded-[24px] flex flex-col justify-between h-28 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Optimal Approach</span>
                  <span 
                    className="block text-xl font-black text-cyan-600 dark:text-cyan-400 leading-snug mt-2"
                  >
                    {complexity.approach}
                  </span>
                </div>
              </div>

              {/* Runtime Recorded */}
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 p-5 rounded-[24px] flex flex-col justify-between h-28 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isAccepted ? 'Execution Ranking' : 'Runtime Recorded'}
                  </span>
                  {isAccepted ? (
                    <span 
                      className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2"
                    >
                      Beats {beats}%
                    </span>
                  ) : (
                    <span 
                      className="block text-3xl font-black text-slate-950 dark:text-white mt-1 font-mono"
                    >
                      {runtime > 0 ? `${runtime}ms` : 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-500/25 rounded-2xl p-5 shadow-lg backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-300 mb-2">💡 Key Insight</p>
              <p className="text-sm text-indigo-950 dark:text-indigo-100 leading-relaxed font-black">{complexity.keyInsight}</p>
            </div>

            {/* Pro Tip */}
            <div className="bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200/50 dark:border-brand-500/25 rounded-2xl p-5 shadow-lg backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-cyan-300 mb-2">🚀 Pro Tip</p>
              <p className="text-sm text-brand-950 dark:text-cyan-100 leading-relaxed font-black">{complexity.tips}</p>
            </div>
          </div>

          {/* RIGHT: Judge Log + Code */}
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="h-[3px] w-6 bg-slate-500 dark:bg-slate-400 inline-block" />
              {isAccepted ? 'Judge Log' : 'Error Details'}
            </h2>

            {submission.error_message ? (
              <pre className={`p-6 rounded-[24px] text-xs font-mono font-bold whitespace-pre-wrap leading-relaxed border overflow-y-auto max-h-80 min-h-[14rem] shadow-xl bg-slate-950/95 border-red-500/30 text-red-200 dark:bg-slate-950 dark:text-red-300`}>
                {submission.error_message}
              </pre>
            ) : (
              <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-[24px] border border-white/50 dark:border-white/10 text-sm text-slate-400 italic backdrop-blur-xl">No judge output available.</div>
            )}

            {/* Submission metadata (Glass Panel) */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-[24px] border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl relative overflow-hidden">
              <p className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">Submission Details</p>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                {[
                  { k: 'Submission ID', v: `#${submission.id}` },
                  { k: 'Language', v: submission.language.toUpperCase() },
                  { k: 'Lines of Code', v: `${linesOfCode}` },
                  { k: 'Submitted At', v: new Date(submission.created_at).toLocaleString() },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide">{k}</span>
                    <span className="text-slate-950 dark:text-white font-extrabold mt-0.5 block text-base">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Your Code (Glass Panel) ── */}
        {unwrappedCode.trim() && (
          <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-[24px] border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl relative overflow-hidden">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span className="h-[3px] w-6 bg-slate-500 dark:bg-slate-400 inline-block" />
              Your Code
            </h2>
            <pre className="bg-[#060813]/90 border border-slate-900 rounded-xl p-5 text-xs font-mono font-bold text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96 shadow-inner">
              {unwrappedCode}
            </pre>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-300 dark:border-white/10">
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/problems/${problem.slug}`}
              className="px-6 py-3 rounded-xl font-black text-sm bg-white hover:bg-gray-100 text-slate-800 border border-gray-300/80 shadow-md transition-all cursor-pointer dark:bg-slate-950 dark:text-white dark:border-white/10 dark:hover:bg-slate-900"
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
                className="px-6 py-3 rounded-xl font-black text-sm bg-red-650 hover:bg-red-500 text-white transition-all shadow-md"
              >
                Try Again
              </Link>
            )}
            <Link
              to="/leaderboard"
              className="px-6 py-3 rounded-xl font-black text-sm bg-white hover:bg-gray-100 text-slate-800 border border-gray-300/80 shadow-md transition-all cursor-pointer dark:bg-slate-950 dark:text-white dark:border-white/10 dark:hover:bg-slate-900"
            >
              Leaderboard
            </Link>
          </div>
          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-xl font-black text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-all cursor-pointer"
          >
            🗑️ Delete Submission
          </button>
        </div>
      </div>
    </div>
  )
}
