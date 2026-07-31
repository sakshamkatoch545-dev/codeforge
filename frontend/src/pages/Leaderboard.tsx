import { useState, useEffect } from 'react'
import { api, LeaderboardUser } from '../api'

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
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
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid animate-grid-scroll z-0"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#fffdd0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#fffdd0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 dark:opacity-20 dark:mix-blend-screen"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 dark:opacity-20 dark:mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:opacity-20 dark:mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 mt-8">
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
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4 font-bold">
                  {user.rank === 1 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-extrabold text-base shadow-sm">
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
    </div>
  </div>
  )
}
