import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, LeaderboardUser } from '../api'

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem('codeforge_token')
    if (!token) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    async function loadLeaderboard() {
      try {
        const data = await api.getLeaderboard()
        setUsers(data)
      } catch (err) {
        setError('Failed to load global rankings.')
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-transparent text-gray-900 dark:text-white">
        <div className="flex flex-col items-center gap-4 bg-white/15 dark:bg-gray-950/20 border border-white/20 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl animate-pulse">
          <span className="animate-spin h-10 w-10 border-4 border-brand-500 dark:border-cyan-400 border-t-transparent rounded-full" />
          <p className="text-brand-600 dark:text-cyan-300 font-black tracking-wider uppercase text-sm">Loading Global Rankings…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-transparent text-gray-900 dark:text-white">
        <div className="bg-white/15 dark:bg-gray-950/20 border border-white/20 dark:border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl backdrop-blur-xl animate-modal-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-300/30 dark:border-brand-400/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔒
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Please sign in or register an account to view global rankings, scores, and compete with other coders.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black rounded-xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
            <Link
              to="/login?tab=register"
              className="flex-1 py-3 px-4 bg-gray-100/50 hover:bg-gray-200/50 dark:bg-gray-900/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-white/20 dark:border-white/10 font-black rounded-xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-transparent text-gray-900 dark:text-white">
        <div className="bg-red-500/10 dark:bg-red-950/20 border border-red-500/30 dark:border-red-500/20 p-8 rounded-3xl text-red-700 dark:text-red-300 font-bold shadow-2xl text-center space-y-3 max-w-md backdrop-blur-xl">
          <span className="text-4xl block">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const topThree = users.slice(0, 3);
  const silverUser = topThree[1];
  const goldUser = topThree[0];
  const bronzeUser = topThree[2];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-gray-900 dark:text-white pb-20 overflow-hidden">
      
      <div className="relative z-10 max-w-5xl mx-auto p-6 mt-12 space-y-8 animate-fade-in">
        <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-3 drop-shadow-sm">
              🏆 Global Leaderboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1.5 font-medium">
              Top programmers ranked by solved problems, score points, and accepted solutions.
            </p>
          </div>
        </div>

        {/* ── Top Podium Section ── */}
        {users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-3xl mx-auto pt-4 pb-4">
            {/* 2nd Place (Silver) */}
            {silverUser ? (
              <div 
                onClick={() => setSelectedUser(silverUser)}
                className="order-2 md:order-1 glass-card bg-white/10 dark:bg-gray-950/20 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group p-6 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-white flex items-center justify-center font-black text-xl shadow-md ring-4 ring-slate-300/40">
                    {silverUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -top-3 -right-3 text-3xl animate-bounce-subtle">🥈</span>
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {silverUser.username}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Silver Rank</span>
                <div className="mt-4 flex gap-4 w-full justify-center text-sm border-t border-white/10 pt-4">
                  <div>
                    <span className="block font-black text-brand-600 dark:text-cyan-400">{silverUser.solved_count}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Solved</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center" />
                  <div>
                    <span className="block font-black text-emerald-600 dark:text-emerald-400">{silverUser.points}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Points</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="order-2 md:order-1 h-1 hidden md:block" />
            )}

            {/* 1st Place (Gold) */}
            {goldUser && (
              <div 
                onClick={() => setSelectedUser(goldUser)}
                className="order-1 md:order-2 glass-card bg-amber-500/10 dark:bg-yellow-500/10 border-yellow-400/40 dark:border-yellow-400/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(234,179,8,0.15)] dark:shadow-[0_25px_60px_rgba(234,179,8,0.2)] md:-translate-y-4 hover:scale-[1.05] transition-all duration-300 cursor-pointer group p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 text-white flex items-center justify-center font-black text-2xl shadow-xl ring-4 ring-yellow-400/50 shadow-yellow-500/30">
                    {goldUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -top-4 -right-4 text-4xl animate-bounce-subtle">👑</span>
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-xl group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  {goldUser.username}
                </h3>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-black uppercase tracking-widest mt-1">Champion</span>
                <div className="mt-4 flex gap-6 w-full justify-center text-sm border-t border-yellow-500/20 pt-4">
                  <div>
                    <span className="block font-black text-yellow-600 dark:text-yellow-400 text-lg">{goldUser.solved_count}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Solved</span>
                  </div>
                  <div className="w-px bg-yellow-500/20 h-8 self-center" />
                  <div>
                    <span className="block font-black text-emerald-600 dark:text-emerald-400 text-lg">{goldUser.points}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Points</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {bronzeUser ? (
              <div 
                onClick={() => setSelectedUser(bronzeUser)}
                className="order-3 glass-card bg-white/10 dark:bg-gray-950/20 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group p-6 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-xl shadow-md ring-4 ring-amber-500/40">
                    {bronzeUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -top-3 -right-3 text-3xl animate-bounce-subtle">🥉</span>
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {bronzeUser.username}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Bronze Rank</span>
                <div className="mt-4 flex gap-4 w-full justify-center text-sm border-t border-white/10 pt-4">
                  <div>
                    <span className="block font-black text-brand-600 dark:text-cyan-400">{bronzeUser.solved_count}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Solved</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center" />
                  <div>
                    <span className="block font-black text-emerald-600 dark:text-emerald-400">{bronzeUser.points}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Points</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="order-3 h-1 hidden md:block" />
            )}
          </div>
        )}

        {/* Ultra-Translucent Aesthetic Table Container */}
        <div className="glass-panel p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden transform-gpu">
          
          <div className="relative z-10 space-y-6">
            <div className="glass-table overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest border-b border-white/20 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4 text-center">Problems Solved</th>
                    <th className="px-6 py-4 text-center">Score Points</th>
                    <th className="px-6 py-4 text-right">Accepted Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm text-gray-700 dark:text-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="group transition-all duration-300 ease-out cursor-pointer"
                      title="Click to view detailed coding statistics"
                    >
                      <td className="px-6 py-4 font-bold">
                        {user.rank === 1 ? (
                          <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/10 font-black text-xs shadow-sm">
                            🥇 #1
                          </span>
                        ) : user.rank === 2 ? (
                          <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-slate-500/10 dark:bg-gray-300/20 text-slate-600 dark:text-gray-200 border border-slate-300/20 font-black text-xs shadow-sm">
                            🥈 #2
                          </span>
                        ) : user.rank === 3 ? (
                          <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-amber-600/10 dark:bg-amber-600/20 text-amber-600 dark:text-amber-300 border border-amber-500/10 font-black text-xs shadow-sm">
                            🥉 #3
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 font-extrabold pl-2">#{user.rank}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md ring-2 ring-cyan-400/40">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="group-hover:text-brand-500 dark:group-hover:text-cyan-300 transition-colors font-extrabold text-base text-gray-950 dark:text-white">{user.username}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-brand-600 dark:text-cyan-300 text-base">
                        {user.solved_count}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 font-extrabold text-xs transition-transform inline-block group-hover:scale-105 shadow-sm">
                          {user.points} pts
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-950 dark:text-white font-extrabold font-mono">
                        {user.total_submissions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Profile Modal */}
        {selectedUser && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedUser(null)}
          >
            <div 
              className="bg-white/70 dark:bg-gray-950/70 border border-white/30 dark:border-white/15 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden backdrop-blur-xl animate-modal-in text-gray-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' }} />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-xl ring-4 ring-cyan-400/40">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{selectedUser.username}</h3>
                    <span className="text-xs text-cyan-600 dark:text-cyan-300 font-bold uppercase tracking-wider">Rank #{selectedUser.rank} Coder</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl font-bold bg-white/20 dark:bg-gray-900/40 hover:bg-white/30 dark:hover:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-white/10"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6 relative z-10">
                <div className="bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm shadow-inner">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">Problems Solved</span>
                  <span className="text-2xl font-black text-brand-600 dark:text-cyan-400">{selectedUser.solved_count}</span>
                </div>
                <div className="bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm shadow-inner">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">Score Points</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{selectedUser.points} pts</span>
                </div>
                <div className="bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm shadow-inner">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">Days Logged In</span>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{selectedUser.login_days} Days</span>
                </div>
                <div className="bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm shadow-inner">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">Days Coded</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{selectedUser.coding_days} Days</span>
                </div>
              </div>

              <div className="text-center pt-2 relative z-10">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-98"
                >
                  Close Stats
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
