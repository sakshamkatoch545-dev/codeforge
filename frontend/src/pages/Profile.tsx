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
  }, [navigate])

  const handleDeleteSubmission = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete submission #${id}?`)) return;
    try {
      await api.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } }
      alert(error.response?.data?.detail || 'Failed to delete submission.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-4 bg-gray-900/80 border border-cyan-500/40 p-8 rounded-3xl backdrop-blur-xl shadow-2xl animate-pulse">
          <span className="animate-spin h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full" />
          <p className="text-cyan-300 font-black tracking-wider uppercase text-sm">Loading Workspace Dashboard…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 text-white">
        <div className="bg-red-950/80 border border-red-500/50 p-8 rounded-3xl backdrop-blur-xl text-red-300 font-bold shadow-2xl text-center space-y-3 max-w-md">
          <span className="text-4xl block">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const solvedCount = new Set(submissions.filter(s => s.status === 'ACCEPTED').map(s => s.problem_id)).size
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0
  const acceptedCount = submissions.filter(s => s.status === 'ACCEPTED').length

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-gray-900 dark:text-white pb-20 overflow-hidden">
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-10 space-y-10 animate-fade-in">
        
        {/* ── Ultra Translucent Hero Glass Banner (Matching Landing Page glass-panel) ── */}
        <div className="relative overflow-hidden glass-panel p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group transform-gpu">
          
          <div className="flex items-center gap-6 relative z-10">
            {/* Glowing Avatar Ring */}
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-brand-600 to-purple-600 ring-4 ring-cyan-400/50 shadow-2xl shadow-cyan-500/50 text-white font-black text-4xl shrink-0 transform-gpu">
              {user?.username.charAt(0).toUpperCase()}
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-400 ring-4 ring-gray-950 dark:ring-gray-900 shadow-md" title="Online" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white drop-shadow-md">
                  {user?.username}'s Dashboard
                </h1>
                <span className="px-3.5 py-1.5 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-400/50 text-cyan-800 dark:text-cyan-300 text-xs font-black rounded-full uppercase tracking-wider shadow-md">
                  ⚡ Active Coder
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 font-medium flex items-center gap-2">
                <span>✉️ {user?.email}</span>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Joined {user && new Date(user.created_at).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Overall Progress Glass Card */}
          <div className="w-full md:w-80 bg-gray-100/50 dark:bg-gray-950/60 border border-gray-200/50 dark:border-white/15 p-5 rounded-2xl flex flex-col gap-2.5 shadow-xl backdrop-blur-md relative z-10 hover:border-cyan-400/50 transition-colors">
            <div className="flex justify-between text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Overall Progress
              </span>
              <span className="text-cyan-600 dark:text-cyan-300 font-black text-sm">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3.5 bg-gray-200 dark:bg-gray-900/90 rounded-full overflow-hidden p-[2px] border border-gray-300 dark:border-gray-800 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-brand-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-500/50"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>{solvedCount} solved</span>
              <span>{totalProblems} total problems</span>
            </div>
          </div>
        </div>

        {/* ── 4-Card Metric Grid with Glass Parity ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Days Logged In */}
          <div className="relative overflow-hidden glass-card p-6 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out group transform-gpu will-change-transform">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Days Logged In</span>
              <span className="text-2xl group-hover:scale-115 transition-transform duration-200">📅</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              {user?.login_days} <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{user?.login_days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-3">Platform activity record</p>
          </div>

          {/* Card 2: Days Coded */}
          <div className="relative overflow-hidden glass-card p-6 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out group transform-gpu will-change-transform">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Days Coded</span>
              <span className="text-2xl group-hover:scale-115 transition-transform duration-200">💻</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
              {user?.coding_days} <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{user?.coding_days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-3">Active problem solving</p>
          </div>

          {/* Card 3: Practice Count */}
          <div className="relative overflow-hidden glass-card p-6 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out group transform-gpu will-change-transform">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Practice Count</span>
              <span className="text-2xl group-hover:scale-115 transition-transform duration-200">🚀</span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
              {user?.practice_count} <span className="text-sm font-bold text-gray-500 dark:text-gray-400">submissions</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-3">Total code runs</p>
          </div>

          {/* Card 4: Submissions Accepted */}
          <div className="relative overflow-hidden glass-card p-6 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out group transform-gpu will-change-transform">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Accepted Codes</span>
              <span className="text-2xl group-hover:scale-115 transition-transform duration-200">🏆</span>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
              {acceptedCount} <span className="text-sm font-bold text-emerald-700/80 dark:text-emerald-400/80">passed</span>
            </div>
            <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-bold uppercase tracking-wider mt-3">Successful solutions</p>
          </div>

        </div>

        {/* ── Table Container (Matching Landing Page glass-panel) ── */}
        <div className="glass-panel p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden transform-gpu">
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-brand-600 to-purple-600 text-white text-base shadow-xl shadow-cyan-500/40">
                  🕒
                </span>
                <span className="bg-gradient-to-r from-gray-900 dark:from-white via-cyan-600 dark:via-cyan-100 to-gray-900 dark:to-white bg-clip-text text-transparent drop-shadow-md">
                  Recent Submissions
                </span>
              </h3>
              <span className="text-xs font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-widest bg-cyan-100 dark:bg-cyan-950/80 px-4 py-2 rounded-2xl border border-cyan-300 dark:border-cyan-400/50 shadow-md">
                ⚡ {submissions.length} Records Total
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-gray-200 dark:border-white/20 rounded-3xl bg-gray-50/20 dark:bg-gray-950/20 space-y-3 backdrop-blur-md">
                <span className="text-4xl block">📥</span>
                <p className="text-base text-gray-900 dark:text-gray-300 font-bold">No submissions recorded yet.</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Solve problems in the workspace to build your activity history!</p>
              </div>
            ) : (
              <div className="glass-table overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest border-b border-white/20 dark:border-white/10">
                    <tr>
                      <th className="px-6 py-4">Submission ID</th>
                      <th className="px-6 py-4">Language</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Runtime</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm text-gray-700 dark:text-gray-200">
                    {submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="group transition-all duration-300 ease-out cursor-pointer"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-gray-950 dark:text-white flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            sub.status === 'ACCEPTED'
                              ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                              : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                          }`} />
                          <Link to={`/submissions/${sub.id}`} className="text-gray-950 dark:text-white font-extrabold hover:text-brand-500 transition-colors flex items-center gap-1">
                            <span>#{sub.id}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 capitalize font-bold text-gray-600 dark:text-gray-300">
                          <span className="px-3.5 py-1 rounded-full bg-gray-100/90 dark:bg-gray-950/80 border border-gray-200/50 dark:border-white/5 text-gray-800 dark:text-gray-200 text-xs font-black font-mono shadow-sm">
                            {sub.language}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-all group-hover:scale-105 shadow-sm ${
                              sub.status === 'ACCEPTED'
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                                : sub.status === 'WRONG_ANSWER'
                                ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/10'
                                : 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/10'
                            }`}
                          >
                            {sub.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-extrabold text-gray-950 dark:text-white">
                          {sub.execution_time !== null ? `${sub.execution_time}ms` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-xs font-bold">
                          {new Date(sub.created_at).toLocaleDateString()}{' '}
                          <span className="text-gray-500 dark:text-gray-500 font-semibold">
                            {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubmission(sub.id);
                            }}
                            className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
    </div>
  )
}
