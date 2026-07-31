import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Home from './pages/Home'
import { api, UserInfo } from './api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import BackgroundAnimation from './components/BackgroundAnimation'

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

  const isProblemDetailPage = location.pathname.startsWith('/problems/') && location.pathname !== '/problems'

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <BackgroundAnimation />
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      
      {!isProblemDetailPage && <Footer />}
    </div>
  )
}

export default App
