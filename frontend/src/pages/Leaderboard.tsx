import { useState, useEffect } from 'react'
import { api, LeaderboardUser } from '../api'

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await api.getLeaderboard()
        setUsers(data)
      } catch (err) {
        setError('Failed to load global rankings.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-8 text-center text-gray-500">
        Loading leaderboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">

      <div className="relative z-10 max-w-5xl mx-auto p-6 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white flex items-center gap-3">
              🏆 Global Leaderboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Top programmers ranked by solved problems and score points.
            </p>
          </div>
        </div>

        <div className="glass-table animate-float">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-center">Problems Solved</th>
              <th className="px-6 py-4 text-center">Score Points</th>
              <th className="px-6 py-4 text-right">Accepted Submissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-all duration-200 cursor-pointer active:scale-[0.995]"
                title="Click to view detailed coding statistics"
              >
                <td className="px-6 py-4 font-bold">
                  {user.rank === 1 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-extrabold text-base shadow-sm animate-bounce-subtle">
                      🥇 1
                    </span>
                  ) : user.rank === 2 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-extrabold text-base shadow-sm">
                      🥈 2
                    </span>
                  ) : user.rank === 3 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-extrabold text-base shadow-sm">
                      🥉 3
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 pl-2">#{user.rank}</span>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </td>
                <td className="px-6 py-4 text-center font-semibold text-brand-600 dark:text-brand-400">
                  {user.solved_count}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-bold rounded-full text-xs">
                    {user.points} pts
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400 font-medium">
                  {user.total_submissions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Glassmorphism Detailed Profile Modal */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-white/95 dark:bg-gray-800/95 border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden backdrop-blur-xl animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing background highlights */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Close button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-black text-3xl shadow-lg mb-4 animate-bounce-subtle">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {selectedUser.username}
              </h3>
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1 flex items-center gap-1.5">
                {selectedUser.rank === 1 ? '🥇' : selectedUser.rank === 2 ? '🥈' : selectedUser.rank === 3 ? '🥉' : '🏆'} Rank #{selectedUser.rank}
              </span>
            </div>

            {/* Grid of stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                <span className="text-2xl mb-1" role="img" aria-label="calendar">📅</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Days Logged In</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-1">
                  {selectedUser.login_days} {selectedUser.login_days === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                <span className="text-2xl mb-1" role="img" aria-label="code">💻</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Days Coded</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-1">
                  {selectedUser.coding_days} {selectedUser.coding_days === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                <span className="text-2xl mb-1" role="img" aria-label="rocket">🚀</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Practice Submissions</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-1">
                  {selectedUser.practice_count}
                </span>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                <span className="text-2xl mb-1" role="img" aria-label="check">✅</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Accepted Submissions</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-1">
                  {selectedUser.total_submissions}
                </span>
              </div>
            </div>

            {/* Overall Score summary */}
            <div className="bg-gradient-to-r from-brand-500/10 to-indigo-500/10 p-5 rounded-2xl border border-brand-500/20 text-center">
              <div className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">
                Overall Performance
              </div>
              <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
                {selectedUser.solved_count} solved • {selectedUser.points} pts
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
  )
}
