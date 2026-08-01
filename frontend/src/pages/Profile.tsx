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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-transparent text-white">
        <div className="flex flex-col items-center gap-4 bg-gray-900/80 border border-brand-500/30 p-8 rounded-3xl backdrop-blur-xl shadow-2xl animate-pulse">
          <span className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full" />
          <p className="text-brand-300 font-black tracking-wider uppercase text-sm">Loading Workspace Dashboard…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-transparent text-white">
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
    <div className="relative min-h-[calc(100vh-4rem)] bg-transparent text-white pb-20 overflow-hidden">
      
      {/* ── Multi-color Floating Ambient Glow Blobs in Background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute top-10 left-1/2 w-80 h-80 bg-emerald-500/15 rounded-full filter blur-3xl opacity-50 animate-blob" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-12 space-y-8 animate-fade-in">
        
        {/* ── Ultra-Glass Hero Banner ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/85 via-indigo-950/75 to-purple-950/85 border border-white/15 rounded-3xl p-8 shadow-[0_20px_50px_rgba(8,112,184,0.25)] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
          
          {/* Internal Glow Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-500/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="flex items-center gap-6 relative z-10">
            {/* Glowing Avatar */}
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-brand-500 to-purple-600 ring-4 ring-cyan-400/40 shadow-2xl shadow-cyan-500/40 text-white font-black text-4xl shrink-0 animate-bounce-subtle">
              {user?.username.charAt(0).toUpperCase()}
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-400 ring-4 ring-gray-900 shadow-md animate-pulse" title="Online" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  {user?.username}'s Dashboard
                </h1>
                <span className="px-3 py-1 bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs font-black rounded-full uppercase tracking-wider shadow-sm">
                  ⚡ Active Coder
                </span>
              </div>
              <p className="text-gray-300 text-sm mt-1.5 font-medium flex items-center gap-2">
                <span>✉️ {user?.email}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-xs">Joined {user && new Date(user.created_at).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Overall Progress Glass Card */}
          <div className="w-full md:w-80 bg-gray-950/70 border border-gray-800/80 p-5 rounded-2xl flex flex-col gap-2.5 shadow-xl backdrop-blur-md relative z-10 hover:border-brand-500/50 transition-colors">
            <div className="flex justify-between text-xs font-black text-gray-300 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                Overall Progress
              </span>
              <span className="text-brand-300 font-black text-sm">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3.5 bg-gray-900 rounded-full overflow-hidden p-[2px] border border-gray-800 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-brand-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-brand-500/50"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span>{solvedCount} solved</span>
              <span>{totalProblems} total problems</span>
            </div>
          </div>
        </div>

        {/* ── 4-Card Metric Grid with Glass Depth & Hover Animations ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Days Logged In */}
          <div className="relative overflow-hidden bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Days Logged In</span>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">📅</span>
            </div>
            <div className="text-3xl font-black text-white group-hover:text-cyan-300 transition-colors">
              {user?.login_days} <span className="text-sm font-bold text-gray-400">{user?.login_days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">Platform activity record</p>
          </div>

          {/* Card 2: Days Coded */}
          <div className="relative overflow-hidden bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Days Coded</span>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">💻</span>
            </div>
            <div className="text-3xl font-black text-white group-hover:text-purple-300 transition-colors">
              {user?.coding_days} <span className="text-sm font-bold text-gray-400">{user?.coding_days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">Active problem solving</p>
          </div>

          {/* Card 3: Practice Count */}
          <div className="relative overflow-hidden bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:border-amber-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Practice Count</span>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🚀</span>
            </div>
            <div className="text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
              {user?.practice_count} <span className="text-sm font-bold text-gray-400">submissions</span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">Total code runs</p>
          </div>

          {/* Card 4: Submissions Accepted */}
          <div className="relative overflow-hidden bg-gray-900/75 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Accepted Codes</span>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🏆</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 group-hover:text-emerald-300 transition-colors">
              {acceptedCount} <span className="text-sm font-bold text-emerald-500/80">passed</span>
            </div>
            <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-wider mt-3">Successful solutions</p>
          </div>

        </div>

        {/* ── Recent Submissions Panel (Glass Table with Animated Background Glows) ── */}
        <div className="relative overflow-hidden bg-gray-900/80 border border-white/10 rounded-3xl p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300">
          
          {/* Animated Ambient Orbs Behind Table */}
          <div className="absolute -top-28 -right-28 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse animation-delay-2000" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white text-base shadow-lg shadow-brand-500/30">
                  🕒
                </span>
                Recent Submissions
              </h3>
              <span className="text-xs font-black text-cyan-300 uppercase tracking-widest bg-cyan-950/80 px-4 py-2 rounded-2xl border border-cyan-500/30 shadow-lg">
                {submissions.length} Records Total
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-gray-800 rounded-3xl bg-gray-950/40 space-y-3">
                <span className="text-4xl block">📥</span>
                <p className="text-base text-gray-300 font-bold">No submissions recorded yet.</p>
                <p className="text-xs text-gray-500">Solve problems in the workspace to build your activity history!</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-800/80 bg-gray-950/70 backdrop-blur-md shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-950/90 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Submission ID</th>
                      <th className="px-6 py-4">Language</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Runtime</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-sm text-gray-300">
                    {submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="group hover:bg-gradient-to-r hover:from-cyan-500/10 hover:via-purple-500/10 hover:to-transparent hover:translate-x-1 transition-all duration-300 cursor-pointer"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-white flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            sub.status === 'ACCEPTED'
                              ? 'bg-emerald-400 animate-ping shadow-lg shadow-emerald-400/50'
                              : 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                          }`} />
                          <Link to={`/submissions/${sub.id}`} className="group-hover:text-cyan-300 transition-colors">
                            #{sub.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 capitalize font-bold text-gray-300 group-hover:text-white transition-colors">
                          <span className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-xs font-mono shadow-inner">
                            {sub.language}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3.5 py-1 text-xs font-black rounded-xl border shadow-lg transition-transform group-hover:scale-105 inline-block ${
                              sub.status === 'ACCEPTED'
                                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
                                : sub.status === 'WRONG_ANSWER'
                                ? 'bg-red-950/70 text-red-300 border-red-500/50 shadow-red-500/20'
                                : 'bg-yellow-950/70 text-yellow-300 border-yellow-500/50 shadow-yellow-500/20'
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
                          <span className="text-gray-500 font-normal">
                            {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubmission(sub.id);
                            }}
                            className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/40 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
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
