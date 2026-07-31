import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Home from './pages/Home'
import { api, UserInfo } from './api'



function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem('codeforge_token')
      if (storedToken) {
        try {
          const user = await api.getMe()
          setCurrentUser(user)
        } catch {
          localStorage.removeItem('codeforge_token')
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }
    checkAuth()
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('codeforge_token')
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-20 glass-panel !rounded-none !border-x-0 !border-t-0 flex items-center px-8 justify-between sticky top-0 z-50">
        <Link to="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400 tracking-tight flex items-center gap-2 uppercase">
          CodeForge
        </Link>
        <nav className="space-x-8 flex items-center">
          <Link to="/problems" className="text-gray-700 dark:text-gray-200 hover:text-brand-600 font-bold text-lg transition-colors">Problems</Link>
          <Link to="/leaderboard" className="text-gray-700 dark:text-gray-200 hover:text-brand-600 font-bold text-lg transition-colors">Leaderboard</Link>
          
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-brand-100 transition">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                  {currentUser.username.charAt(0).toUpperCase()}
                </span>
                <span>{currentUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3.5 py-1.5 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300 transition text-sm"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-500 text-white font-bold hover:scale-105 transform transition-all duration-300 shadow-lg shadow-brand-500/30">
              Login
            </Link>
          )}
        </nav>
      </header>
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      
      <footer className="h-12 bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CodeForge. All rights reserved.
      </footer>
    </div>
  )
}

export default App
