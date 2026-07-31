import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, UserInfo, Submission } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
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
        const [me, subs] = await Promise.all([api.getMe(), api.getMySubmissions()])
        setUser(me)
        setSubmissions(subs)
      } catch (err) {
        setError('Failed to load user profile or submissions.')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('codeforge_token')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8 text-center text-gray-500">
        Loading profile data...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Username: {user?.username}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Email: {user?.email}</p>
        <p className="text-xs text-gray-400 mt-4">
          Member since: {user && new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Submissions</h3>
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-4 py-3">Submission ID</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Runtime</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4 font-medium">#{sub.id}</td>
                    <td className="px-4 py-4 capitalize">{sub.language}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          sub.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : sub.status === 'WRONG_ANSWER'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {sub.execution_time !== null ? `${sub.execution_time}ms` : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(sub.created_at).toLocaleDateString()}{' '}
                      {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
