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

  const handleProblemClick = (e: React.MouseEvent, slug: string) => {
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

      <div className="relative z-10 max-w-6xl mx-auto p-6 mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase mb-0">Problems</h1>
          
          {localStorage.getItem('codeforge_token') && (
            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Progress: {solvedIds.size} / {problems.length}
              </span>
              <div className="w-full sm:w-64 h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
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

        <div className="glass-table animate-float">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 w-24 text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 w-32">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {problems.map((prob, index) => (
                <tr key={prob.id} className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium flex justify-center items-center">
                    {solvedIds.has(prob.id) ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm shadow-green-500/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600 font-bold">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/problems/${prob.slug}`}
                      onClick={(e) => handleProblemClick(e, prob.slug)}
                      className="text-brand-600 dark:text-brand-400 font-bold hover:text-brand-500 dark:hover:text-brand-300 text-lg transition-colors"
                    >
                      {index + 1}. {prob.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${
                      prob.difficulty === 'EASY' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      prob.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
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
