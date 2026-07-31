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
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
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
      
      <Footer />
    </div>
  )
}

export default App
