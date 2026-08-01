import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Social Auth Modal State
  const [socialModal, setSocialModal] = useState<{ open: boolean; provider: 'Google' | 'GitHub' }>({
    open: false,
    provider: 'Google',
  })
  const [socialEmail, setSocialEmail] = useState('')
  const [socialUsername, setSocialUsername] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        const token = await api.login(username, password)
        localStorage.setItem('codeforge_token', token)
        navigate('/problems')
      } else {
        await api.register(email, username, password)
        const token = await api.login(username, password)
        localStorage.setItem('codeforge_token', token)
        navigate('/problems')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const openSocialAuth = (provider: 'Google' | 'GitHub') => {
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
      localStorage.setItem('codeforge_token', token)
      setSocialModal({ open: false, provider: 'Google' })
      navigate('/problems')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Social authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 text-white px-4 py-12">

      {/* ── Main Auth Card ── */}
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 flex flex-col gap-5">

        {/* Sign In / Register Tab Switcher */}
        <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError('') }}
            className={`flex-1 py-2.5 text-sm font-extrabold rounded-lg transition-all ${
              isLogin ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError('') }}
            className={`flex-1 py-2.5 text-sm font-extrabold rounded-lg transition-all ${
              !isLogin ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">
            {isLogin ? 'Sign in to CodeForge' : 'Create your CodeForge Account'}
          </h2>
          <p className="mt-1.5 text-xs text-gray-400 font-medium">
            {isLogin
              ? 'Enter your credentials to access your coding workspace.'
              : 'Join CodeForge today to track your progress & compete.'}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/40 p-3.5 rounded-xl text-xs font-bold text-red-300">
            {error}
          </div>
        )}

        {/* Google & GitHub Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => openSocialAuth('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-950 hover:bg-gray-800 border border-gray-700/80 rounded-xl text-xs font-extrabold text-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => openSocialAuth('GitHub')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-950 hover:bg-gray-800 border border-gray-700/80 rounded-xl text-xs font-extrabold text-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-800" />
          <span className="flex-shrink mx-3 text-[10px] uppercase font-black tracking-widest text-gray-500">
            Or continue with email
          </span>
          <div className="flex-grow border-t border-gray-800" />
        </div>

        {/* Email / Username / Password Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* Email — Register only */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-700 bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm font-medium"
                placeholder="Enter your email"
              />
            </div>
          )}

          {/* Username / Username or Email */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              {isLogin ? 'Username or Email' : 'Username'}
            </label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-700 bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm font-medium"
              placeholder={isLogin ? 'Enter username or email' : 'Pick a username'}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-700 bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm font-medium"
              placeholder="Enter your password"
            />
          </div>

          {/* Quick-fill hint — Sign In only */}
          {isLogin && (
            <div className="bg-brand-950/40 border border-brand-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-wider mb-0.5">Your Account</p>
                <p className="text-xs text-gray-300 font-semibold">
                  <span className="text-white font-black">saksham</span> / <span className="text-brand-300 font-black">saksham123</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setUsername('saksham'); setPassword('saksham123') }}
                className="shrink-0 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black rounded-lg transition cursor-pointer"
              >
                Auto-fill ↗
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 text-sm font-black rounded-xl text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

      </div>{/* end card */}

      {/* ── Google / GitHub OAuth Modal ── */}
      {socialModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 max-w-md w-full rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
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
                  className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
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
