import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, Link } from 'react-router-dom'
import { api, UserInfo, Submission } from '../api'

const AVATAR_EMOJIS = ['🧑‍💻','👨‍💻','👩‍💻','🦊','🐼','🐺','🦁','🐸','🤖','🎯','⚡','🔥','💎','🚀','🧠','👾']

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [totalProblems, setTotalProblems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit profile state
  const [editOpen, setEditOpen] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const [editBio, setEditBio] = useState(() => localStorage.getItem('codeforge_bio') || '')
  const [editAvatar, setEditAvatar] = useState(() => localStorage.getItem('codeforge_avatar') || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editSuccess, setEditSuccess] = useState('')
  const [editError, setEditError] = useState('')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSaveProfile = async () => {
    setEditError('')
    setEditSuccess('')
    if (newPassword && newPassword !== confirmPassword) {
      setEditError('New passwords do not match.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      setEditError('New password must be at least 6 characters.')
      return
    }
    setEditLoading(true)
    try {
      const payload: { username?: string; new_password?: string; current_password?: string } = {}
      if (editUsername && editUsername !== user?.username) payload.username = editUsername
      if (newPassword) { payload.new_password = newPassword; payload.current_password = currentPassword }
      if (Object.keys(payload).length > 0) {
        const updated = await api.updateMe(payload)
        setUser(updated)
      }
      // Save bio and avatar locally
      localStorage.setItem('codeforge_bio', editBio)
      localStorage.setItem('codeforge_avatar', editAvatar)
      setEditSuccess('Profile updated successfully!')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err: any) {
      setEditError(err?.response?.data?.detail || 'Failed to save changes.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string
      setEditAvatar(b64)
    }
    reader.readAsDataURL(file)
  }

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
      
      <div className="relative z-10 max-w-5xl mx-auto px-3 md:px-6 mt-6 md:mt-10 space-y-6 md:space-y-10 animate-fade-in">
        
        {/* ── Hero Glass Banner ── */}
        <div className="relative overflow-hidden glass-panel p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-6 group transform-gpu">
          
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative z-10 shrink-0 flex flex-col items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-black tracking-wider rounded-full border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white font-black text-4xl shadow-xl ring-4 ring-white/20 overflow-hidden">
                {(() => {
                  const av = localStorage.getItem('codeforge_avatar')
                  if (av && av.startsWith('data:')) return <img src={av} alt="avatar" className="w-full h-full object-cover" />
                  if (av) return <span className="text-3xl md:text-4xl">{av}</span>
                  return user?.username.charAt(0).toUpperCase()
                })()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white drop-shadow-md">
                  {user?.username}'s Dashboard
                </h1>
                <span className="px-2.5 py-1 md:px-3.5 md:py-1.5 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-400/50 text-cyan-800 dark:text-cyan-300 text-xs font-black rounded-full uppercase tracking-wider shadow-md">
                  ⚡ Active Coder
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mt-1.5 md:mt-2 font-medium flex flex-wrap items-center gap-1.5 md:gap-2">
                <span>✉️ {user?.email}</span>
                <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Joined {user && new Date(user.created_at).toLocaleDateString()}</span>
              </p>
              {localStorage.getItem('codeforge_bio') && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 italic">{localStorage.getItem('codeforge_bio')}</p>
              )}
              <button
                onClick={() => { setEditOpen(!editOpen); setEditUsername(user?.username || ''); setEditError(''); setEditSuccess('') }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 border border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all shadow-sm"
              >
                Edit Profile
              </button>
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

        {/* ── 4-Card Metric Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          
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

        {/* ── Recent Submissions Panel ── */}
        <div className="glass-panel p-4 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden transform-gpu">
          
          <div className="relative z-10 space-y-4 md:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 md:gap-3">
                <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-brand-600 to-purple-600 text-white text-sm md:text-base shadow-xl shadow-cyan-500/40">
                  🕒
                </span>
                <span className="bg-gradient-to-r from-gray-900 dark:from-white via-cyan-600 dark:via-cyan-100 to-gray-900 dark:to-white bg-clip-text text-transparent drop-shadow-md">
                  Recent Submissions
                </span>
              </h3>
              <span className="text-xs font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-widest bg-cyan-100 dark:bg-cyan-950/80 px-3 py-1.5 rounded-2xl border border-cyan-300 dark:border-cyan-400/50 shadow-md">
                ⚡ {submissions.length} Records
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-gray-200 dark:border-white/20 rounded-3xl bg-gray-50/20 dark:bg-gray-950/20 space-y-3 backdrop-blur-md">
                <span className="text-4xl block">📥</span>
                <p className="text-base text-gray-900 dark:text-gray-300 font-bold">No submissions recorded yet.</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Solve problems in the workspace to build your activity history!</p>
              </div>
            ) : (
              <>
                {/* ── Mobile Card List ── */}
                <div className="flex flex-col gap-2.5 md:hidden">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm">
                      {/* Row 1: ID + Status */}
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={`/submissions/${sub.id}`}
                          className="flex items-center gap-2 font-mono font-extrabold text-sm text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            sub.status === 'ACCEPTED'
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                              : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                          }`} />
                          #{sub.id}
                        </Link>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          sub.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : sub.status === 'WRONG_ANSWER'
                            ? 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/20'
                            : 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
                        }`}>
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {/* Row 2: Language + Runtime + Date + Delete */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100/90 dark:bg-gray-950/80 border border-gray-200/50 dark:border-white/10 text-gray-800 dark:text-gray-200 text-[10px] font-black font-mono">
                          {sub.language}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-gray-700 dark:text-gray-300">
                          {sub.execution_time !== null ? `${Math.round(sub.execution_time)}ms` : 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                          {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="px-2.5 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/20 rounded-full text-[10px] font-black transition-all active:scale-95 cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Desktop Table ── */}
                <div className="hidden md:block glass-table overflow-x-auto">
                  <table className="w-full text-left border-collapse [&_th]:px-5 [&_th]:py-3.5 [&_th]:text-[10px] [&_td]:px-5 [&_td]:py-3.5">
                    <thead>
                      <tr>
                        <th>Submission ID</th>
                        <th>Language</th>
                        <th>Status</th>
                        <th>Runtime</th>
                        <th>Date</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-sm text-gray-700 dark:text-gray-200">
                      {submissions.map((sub) => (
                        <tr
                          key={sub.id}
                          className="group transition-all duration-300 ease-out cursor-pointer"
                        >
                          <td className="font-mono font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              sub.status === 'ACCEPTED'
                                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                                : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                            }`} />
                            <Link to={`/submissions/${sub.id}`} className="text-gray-900 dark:text-white font-extrabold hover:text-brand-500 transition-colors flex items-center gap-1">
                              <span>#{sub.id}</span>
                            </Link>
                          </td>
                          <td className="capitalize font-bold text-gray-600 dark:text-gray-300">
                            <span className="px-3 py-1 rounded-full bg-gray-100/90 dark:bg-gray-950/80 border border-gray-200/50 dark:border-white/5 text-gray-800 dark:text-gray-200 text-[10px] font-black font-mono shadow-sm">
                              {sub.language}
                            </span>
                          </td>
                          <td>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all group-hover:scale-105 shadow-sm ${
                              sub.status === 'ACCEPTED'
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/10'
                                : sub.status === 'WRONG_ANSWER'
                                ? 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/10'
                                : 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/10'
                            }`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="font-mono font-extrabold text-gray-900 dark:text-white">
                            {sub.execution_time !== null ? `${Math.round(sub.execution_time)}ms` : 'N/A'}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300 text-xs font-bold">
                            {new Date(sub.created_at).toLocaleDateString()}{' '}
                            <span className="text-gray-500 dark:text-gray-500 font-semibold">
                              {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubmission(sub.id);
                              }}
                              className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/20 rounded-full text-[10px] font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
              </>
            )}
          </div>
        </div>

      </div>

      {/* ── Edit Profile Modal ── */}
      {editOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-all" onClick={() => setEditOpen(false)}>
          <div className="w-full max-w-lg p-5 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-white/10 ring-4 ring-black/5 dark:ring-white/5" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-black">✕</button>
            </div>

            <div className="space-y-5">
              {/* Avatar Section */}
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Avatar</label>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center text-white font-black text-2xl overflow-hidden shrink-0 ring-2 ring-gray-200 dark:ring-gray-700 shadow-inner">
                    {editAvatar.startsWith('data:')
                      ? <img src={editAvatar} alt="preview" className="w-full h-full object-cover" />
                      : editAvatar
                        ? <span className="text-3xl">{editAvatar}</span>
                        : user?.username.charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-xs font-black rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm">Upload Photo</button>
                    <button onClick={() => setEditAvatar('')} className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-left">Remove Photo</button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Bio / Tagline</label>
                <input
                  type="text" maxLength={80} value={editBio} onChange={e => setEditBio(e.target.value)}
                  placeholder="e.g. Competitive programmer | Python lover"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">{editBio.length}/80 — shown on your profile</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)}
                  placeholder={user?.username}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>



              {/* Feedback */}
              {editError && <p className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800">{editError}</p>}
              {editSuccess && <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">✓ {editSuccess}</p>}

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                disabled={editLoading}
                className="w-full py-3.5 mt-2 rounded-xl font-black text-sm tracking-wide text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {editLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
