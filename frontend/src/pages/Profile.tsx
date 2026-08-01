import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, UserInfo, Submission } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [totalProblems, setTotalProblems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('codeforge_token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const [me, subs, problems] = await Promise.all([
          api.getMe(),
          api.getMySubmissions(),
          api.getProblems()
        ])
        setUser(me)
        setSubmissions(subs)
        setTotalProblems(problems.length)
      } catch (err) {
        setError('Failed to load user profile or submissions.')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleDeleteSubmission = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete submission #${id}?`)) return;
    try {
      await api.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete submission.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-16 text-center text-gray-500 font-bold">
        Loading profile data...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-16 text-center text-red-500 font-bold">
        {error}
      </div>
    )
  }

  const solvedCount = new Set(submissions.filter(s => s.status === 'ACCEPTED').map(s => s.problem_id)).size
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      
      <div className="relative z-10 max-w-5xl mx-auto p-6 mt-16 space-y-8">
        
        {/* ── Hero Glass Header ── */}
        <div className="glass-panel p-8 shadow-2xl animate-float flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-purple-500 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-brand-500/30 animate-bounce-subtle">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white flex items-center gap-3">
                ⚡ {user?.username}'s Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-semibold">
                Track your personal coding progress, statistics, and recent submissions.
              </p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="w-full md:w-72 bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 p-5 rounded-2xl flex flex-col gap-2 shadow-inner backdrop-blur-md">
            <div className="flex justify-between text-xs font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
              <span>Overall Progress</span>
              <span className="text-brand-600 dark:text-brand-400">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden p-[2px] shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              {solvedCount} of {totalProblems} solved
            </span>
          </div>
        </div>

        {/* ── Stats Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-black text-4xl shadow-xl mb-4">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
              {user?.username}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{user?.email}</p>
            <span className="mt-4 px-3.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40 text-xs font-extrabold rounded-full uppercase tracking-wider">
              Active Coder
            </span>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-6">
              MEMBER SINCE {user && new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
            </p>
          </div>

          {/* Activity Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2" role="img" aria-label="calendar">📅</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Days Logged In</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                {user?.login_days} {user?.login_days === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2" role="img" aria-label="code">💻</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Days Coded</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                {user?.coding_days} {user?.coding_days === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2" role="img" aria-label="rocket">🚀</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Practice Submissions</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                {user?.practice_count}
              </span>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2" role="img" aria-label="trophy">🏆</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Accepted Submissions</span>
              <span className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">
                {submissions.filter(s => s.status === 'ACCEPTED').length}
              </span>
            </div>
          </div>
        </div>

        {/* ── Recent Submissions Glass Table ── */}
        <div className="glass-panel p-6">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            🕒 Recent Submissions
          </h3>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No submissions recorded yet.</p>
          ) : (
            <div className="glass-table">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-4">Submission ID</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Runtime</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50 text-sm">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold">
                        <Link to={`/submissions/${sub.id}`} className="text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors">
                          #{sub.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold text-gray-700 dark:text-gray-300">{sub.language}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-lg ${
                            sub.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : sub.status === 'WRONG_ANSWER'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                        {sub.execution_time !== null ? `${sub.execution_time}ms` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(sub.created_at).toLocaleDateString()}{' '}
                        {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          title="Delete this submission"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
