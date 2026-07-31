import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Problem } from '../api'

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await api.getProblems()
        setProblems(data)
      } catch (err) {
        setError('Could not load problems from the server.')
      } finally {
        setLoading(false)
      }
    }
    loadProblems()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-8 text-center text-gray-500">
        Loading problems...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">

      <div className="relative z-10 max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-5xl font-black tracking-tighter mb-10 text-gray-900 dark:text-white uppercase">Problems</h1>
        <div className="glass-table animate-float">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {problems.map((prob) => (
                <tr key={prob.id} className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-400"> - </td>
                  <td className="px-6 py-4">
                    <Link to={`/problems/${prob.slug}`} className="text-brand-600 dark:text-brand-400 font-bold hover:text-brand-500 dark:hover:text-brand-300 text-lg transition-colors">
                      {prob.title}
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
    </div>
  )
}
