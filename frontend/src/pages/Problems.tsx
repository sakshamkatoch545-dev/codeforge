import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, Problem } from '../api'
import { problemsMetadata } from '../problemsConfig'

export default function Problems() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<Problem[]>([])
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProblems()
        setProblems(data)
      } catch (err) {
        // Fallback: show static problems from config instead of an error
        const fallbackProblems: Problem[] = Object.keys(problemsMetadata).map((slug, idx) => ({
          id: idx + 1,
          title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          slug,
          description: '',
          difficulty: ['binary-search', 'two-sum', 'valid-parentheses', 'reverse-string', 'merge-two-sorted-lists'].includes(slug)
            ? 'EASY'
            : ['n-queens', 'trapping-rain-water'].includes(slug)
            ? 'HARD'
            : 'MEDIUM',
          created_at: new Date().toISOString()
        }))
        setProblems(fallbackProblems)
      } finally {
        if (localStorage.getItem('codeforge_token')) {
          try {
            const solved = await api.getSolvedProblems()
            setSolvedIds(new Set(solved))
          } catch (e) {
            // ignore
          }
        }
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleProblemClick = (e: React.MouseEvent) => {
    const isLoggedIn = !!localStorage.getItem('codeforge_token')
    if (!isLoggedIn) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-8 text-center text-gray-500">
        Loading problems...
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 mt-16 animate-float">
        <div className="glass-panel p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden transform-gpu">
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-2">
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase mb-0">
                <span className="bg-gradient-to-r from-gray-900 dark:from-white via-cyan-600 dark:via-cyan-100 to-gray-900 dark:to-white bg-clip-text text-transparent drop-shadow-md">
                  Problems
                </span>
              </h1>
              
              {localStorage.getItem('codeforge_token') && (
                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                  <span className="text-xs font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-widest bg-cyan-100 dark:bg-cyan-950/80 px-4 py-2 rounded-2xl border border-cyan-300 dark:border-cyan-400/50 shadow-md">
                    ⚡ Progress: {solvedIds.size} / {problems.length}
                  </span>
                  <div className="w-full sm:w-64 h-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden shadow-inner border border-white/20">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${problems.length ? (solvedIds.size / problems.length) * 100 : 0}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-table overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest border-b border-white/20 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 w-24 text-center">Status</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4 w-32">Difficulty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {problems.map((prob, index) => (
                    <tr key={prob.id} className="transition-colors duration-300">
                      <td className="px-6 py-4 font-medium flex justify-center items-center">
                        {solvedIds.has(prob.id) ? (
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-700 font-bold">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/problems/${prob.slug}`}
                          onClick={handleProblemClick}
                          className="text-gray-950 dark:text-white font-extrabold hover:text-brand-500 dark:hover:text-cyan-300 transition-colors text-base"
                        >
                          {index + 1}. {prob.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                          prob.difficulty === 'EASY'
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                            : prob.difficulty === 'MEDIUM'
                            ? 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/10'
                            : 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/10'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                You need an account to practice code and submit solutions on CodeForge.
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
    </div>
  )
}
