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
      <div className="max-w-5xl mx-auto p-6 mt-16 text-center text-gray-400 font-bold">
        Loading profile data...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-16 text-center text-red-400 font-bold">
        {error}
      </div>
    )
  }

  const solvedCount = new Set(submissions.filter(s => s.status === 'ACCEPTED').map(s => s.problem_id)).size
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-white">
      
      <div className="relative z-10 max-w-5xl mx-auto p-6 mt-16 space-y-8">
        
        {/* ── Dark Translucent Glass Hero Header ── */}
        <div className="bg-gradient-to-br from-brand-950/80 via-gray-900/80 to-indigo-950/80 border border-brand-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-float flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full ring-4 ring-brand-500/40 bg-gray-900 flex items-center justify-center font-black text-3xl shadow-2xl text-brand-400 border border-white/10 animate-bounce-subtle">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                ⚡ {user?.username}'s Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-semibold">
                Track your personal coding progress, statistics, and recent submissions.
              </p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="w-full md:w-72 bg-gray-950/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col gap-2 shadow-inner backdrop-blur-md">
            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
              <span>Overall Progress</span>
              <span className="text-brand-400 font-black">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden p-[2px] border border-gray-800 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-400">
              {solvedCount} of {totalProblems} solved
            </span>
          </div>
        </div>

        {/* ── Dark Translucent Glass Stats Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <div className="bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl hover:border-brand-500/40 transition-all duration-300">
            <div className="w-24 h-24 rounded-full ring-4 ring-brand-500/20 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-black text-4xl shadow-xl mb-4">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-white mb-1">
              {user?.username}
            </h2>
            <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
            <span className="mt-4 px-3.5 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-extrabold rounded-full uppercase tracking-wider">
              Active Coder
            </span>
            <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mt-6">
              MEMBER SINCE {user && new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
            </p>
          </div>

          {/* Activity Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl hover:border-brand-500/40 transition-all duration-300">
              <span className="text-3xl mb-2" role="img" aria-label="calendar">📅</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Days Logged In</span>
              <span className="text-3xl font-black text-white mt-2">
                {user?.login_days} {user?.login_days === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl hover:border-brand-500/40 transition-all duration-300">
              <span className="text-3xl mb-2" role="img" aria-label="code">💻</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Days Coded</span>
              <span className="text-3xl font-black text-white mt-2">
                {user?.coding_days} {user?.coding_days === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl hover:border-brand-500/40 transition-all duration-300">
              <span className="text-3xl mb-2" role="img" aria-label="rocket">🚀</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Practice Submissions</span>
              <span className="text-3xl font-black text-white mt-2">
                {user?.practice_count}
              </span>
            </div>

            <div className="bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl hover:border-brand-500/40 transition-all duration-300">
              <span className="text-3xl mb-2" role="img" aria-label="trophy">🏆</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Accepted Submissions</span>
              <span className="text-3xl font-black text-emerald-400 mt-2">
                {submissions.filter(s => s.status === 'ACCEPTED').length}
              </span>
            </div>
          </div>
        </div>

        {/* ── Dark Translucent Glass Recent Submissions Table ── */}
        <div className="bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            🕒 Recent Submissions
          </h3>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No submissions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-800/80 bg-gray-950/60 backdrop-blur-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-950/80 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-800">
                    <th className="px-6 py-4">Submission ID</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Runtime</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80 text-sm text-gray-300">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        <Link to={`/submissions/${sub.id}`} className="hover:text-brand-400 transition-colors">
                          #{sub.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 capitalize font-bold text-gray-300">{sub.language}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-extrabold rounded-lg border ${
                            sub.status === 'ACCEPTED'
                              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                              : sub.status === 'WRONG_ANSWER'
                              ? 'bg-red-950/50 text-red-300 border-red-500/40'
                              : 'bg-yellow-950/50 text-yellow-300 border-yellow-500/40'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-gray-300">
                        {sub.execution_time !== null ? `${sub.execution_time}ms` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                        {new Date(sub.created_at).toLocaleDateString()}{' '}
                        {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
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
