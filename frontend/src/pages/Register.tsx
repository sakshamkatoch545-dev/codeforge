import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

// ─── Celebration Confetti Particle Component (same as post-submission page) ───────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#facc15', '#fb923c']
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      r: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 6,
      opacity: 1,
    }))

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 2)
        ctx.restore()
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotV
        if (p.y > canvas.height) p.opacity -= 0.02
      }
      if (particles.some(p => p.opacity > 0)) animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successAnimation, setSuccessAnimation] = useState(false)
  const navigate = useNavigate()

  // Social Auth Modal State
  const [socialModal, setSocialModal] = useState<{ open: boolean; provider: 'Google' | 'GitHub' }>({
    open: false,
    provider: 'Google',
  })
  const [socialEmail, setSocialEmail] = useState('')
  const [socialUsername, setSocialUsername] = useState('')
  
  // Initialize Google Sign-In Button on mount
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const g = window as any
      const container = document.getElementById('main-google-btn-container')
      
      if (g.google && container) {
        clearInterval(interval)
        
        g.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            const idToken = response.credential
            setLoading(true)
            setError('')
            try {
              const base64Url = idToken.split('.')[1]
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
              const jsonPayload = decodeURIComponent(
                atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
              )
              const decoded = JSON.parse(jsonPayload)
              
              const token = await api.oauthLogin(
                'google',
                decoded.email,
                decoded.name || decoded.given_name || undefined
              )
              triggerSuccessAndNavigate(token)
            } catch (err: any) {
              setError(err.response?.data?.detail || 'Google authentication failed.')
              setLoading(false)
            }
          }
        })

        // Render the official button directly on the form
        g.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'medium', // size 'medium' or 'small' disables personalization
          shape: 'rectangular',
          width: 199,     // width < 200px also disables personalization
          text: 'signin_with',
          logo_alignment: 'center'
        })
      } else if (attempts > 20) {
        clearInterval(interval) // Give up after 2 seconds
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])



  const triggerSuccessAndNavigate = (token: string) => {
    localStorage.setItem('codeforge_token', token)
    setSuccessAnimation(true)
    setSocialModal({ open: false, provider: 'Google' })
    setTimeout(() => {
      navigate('/problems')
    }, 1200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await api.login(username, password)
      triggerSuccessAndNavigate(token)
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const openSocialAuth = (provider: 'GitHub') => {
    setSocialModal({ open: true, provider })
    setSocialEmail('')
    setSocialUsername('')
    setError('')
  }

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!socialEmail) return
    setLoading(true)
    setError('')
    try {
      const token = await api.oauthLogin(
        socialModal.provider.toLowerCase(),
        socialEmail,
        socialUsername || undefined
      )
      triggerSuccessAndNavigate(token)
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Social authentication failed.')
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-transparent text-white px-4 py-12">
      
      {/* ── Festive Confetti Celebration Canvas (same as post-submission) ── */}
      {successAnimation && <ConfettiCanvas />}

      {/* ── Post-Submission Style Loading Overlay ── */}
      {loading && !successAnimation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-brand-500/30 max-w-sm w-full rounded-3xl p-8 shadow-2xl shadow-brand-500/20 text-center space-y-5 animate-modal-in">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 ring-4 ring-brand-500/40 mx-auto shadow-xl">
              <span className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">Authenticating…</h3>
              <p className="text-gray-400 text-xs mt-2 font-semibold leading-relaxed">
                Verifying your CodeForge credentials & preparing your workspace environment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Post-Submission Style Success Overlay ── */}
      {successAnimation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-emerald-950/90 via-gray-900 to-indigo-950/90 border border-emerald-500/40 max-w-sm w-full rounded-3xl p-8 shadow-2xl shadow-emerald-500/30 text-center space-y-5 animate-modal-in">
            <div className="w-20 h-20 rounded-full ring-4 ring-emerald-500/50 bg-emerald-950 flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-4xl font-black text-emerald-400">✓</span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                ACCEPTED
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-3">Welcome to CodeForge!</h3>
              <p className="text-emerald-300 text-xs mt-1.5 font-bold">
                Authentication successful. Entering workspace…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Auth Card ── */}
      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-800 flex flex-col gap-5">

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">
            Create your CodeForge Account
          </h2>
          <p className="mt-1.5 text-xs text-gray-400 font-medium">
            Join CodeForge today to track your progress & compete.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/40 p-3.5 rounded-xl text-xs font-bold text-red-300">
            {error}
          </div>
        )}

        {/* Google Button */}
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Official Google Sign-In Button Container */}
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div id="main-google-btn-container" className="flex items-center justify-center w-full min-h-[40px] mb-2 z-20"></div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSocialModal({ open: true, provider: 'Google' })
                setSocialEmail('')
                setSocialUsername('')
                setError('Google Client ID not configured. Using mock mode.')
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-950 hover:bg-gray-800 border border-gray-700/80 rounded-xl text-xs font-extrabold text-gray-200 transition-all active:scale-95 cursor-pointer w-full max-w-[200px] mb-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google (Mock)
            </button>
          )}
        </div>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-400 font-bold">
              Sign In
            </Link>
          </p>
        </div>

      </div>{/* end card */}

      {/* ── Google / GitHub OAuth Modal ── */}
      {socialModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-modal-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{socialModal.provider === 'Google' ? '🔍' : '🐙'}</span>
                Continue with {socialModal.provider}
              </h3>
              <button
                type="button"
                onClick={() => setSocialModal({ open: false, provider: 'Google' })}
                className="text-gray-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Enter your {socialModal.provider} email to sign in or create an account instantly.
            </p>

            <form onSubmit={handleSocialSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  {socialModal.provider} Email
                </label>
                <input
                  id="social-email"
                  type="email"
                  required
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-700 bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  placeholder={socialModal.provider === 'Google' ? 'your.name@gmail.com' : 'your@email.com'}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Display Username <span className="text-gray-500 normal-case font-medium">(optional)</span>
                </label>
                <input
                  id="social-username"
                  type="text"
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                  className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-700 bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  placeholder="Leave blank to use email prefix"
                />
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-500/40 p-3 rounded-xl text-xs font-bold text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSocialModal({ open: false, provider: 'Google' })}
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-brand-500/30 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Signing in...' : `Sign in with ${socialModal.provider}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
