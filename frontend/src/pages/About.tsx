import { Link } from 'react-router-dom'

export default function About() {
  const features = [
    { icon: '🧩', title: 'Curated Problem Set', desc: 'Hand-picked algorithmic challenges from Easy to Hard, covering Arrays, DP, Graphs, Trees, and more.', bg: 'bg-brand-50 dark:bg-brand-900/30', text: 'text-brand-600 dark:text-brand-400' },
    { icon: '⚡', title: 'Live Code Judge', desc: 'Submit in Python, C++, Java, or JS. Sandboxed Docker containers evaluate your solution instantly.', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' },
    { icon: '🏆', title: 'Global Leaderboard', desc: 'Compete worldwide. Earn points for every accepted solution and climb the global rankings.', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
    { icon: '📊', title: 'Detailed Analytics', desc: 'Track your coding streak, submission history, runtime performance, and overall progress.', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { icon: '🔐', title: 'Secure Auth', desc: 'Sign in with Google or create a local account. JWT-based auth keeps your data safe.', bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive design — browse problems, check your profile, and view the leaderboard from your phone.', bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
  ]

  const stack = [
    { name: 'React', role: 'Frontend UI', icon: '⚛️' },
    { name: 'TypeScript', role: 'Type Safety', icon: '📘' },
    { name: 'Tailwind CSS', role: 'Styling', icon: '🎨' },
    { name: 'FastAPI', role: 'Backend API', icon: '🚀' },
    { name: 'PostgreSQL', role: 'Database', icon: '🐘' },
    { name: 'Docker', role: 'Code Sandbox', icon: '🐳' },
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20">
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-10 md:pt-16 space-y-10 md:space-y-14">
        <div className="glass-panel p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.4) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/anvil.png" alt="CodeForge" className="h-12 md:h-20 w-auto drop-shadow-xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600 dark:from-brand-400 dark:to-purple-400">CodeForge</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              A premium competitive programming platform built to help developers sharpen their algorithmic skills, practice real interview questions, and compete globally.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/problems" className="w-full sm:w-auto px-6 py-3 rounded-xl glass-button-primary font-bold text-base hover:scale-105 transition-all duration-300">Start Solving →</Link>
              <Link to="/leaderboard" className="w-full sm:w-auto px-6 py-3 rounded-xl glass-button font-bold text-base text-gray-800 dark:text-white hover:scale-105 transition-all duration-300">View Leaderboard</Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/50 text-brand-700 dark:text-brand-300 font-bold text-sm">
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span></span>
            CodeForge v2.0 — Actively Developed
          </span>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 dark:text-white mb-2">What's Inside</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">Everything you need to level up your coding game.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-5 md:p-6 flex flex-col gap-3">
                <div className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center text-2xl shadow-sm`}>{f.icon}</div>
                <h3 className={`font-black text-base md:text-lg ${f.text}`}>{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 dark:text-white mb-2">Built With</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">A modern, production-grade tech stack.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {stack.map((s) => (
              <div key={s.name} className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-white/60 dark:border-white/10 hover:scale-[1.02] transition-transform duration-200">
                <span className="text-2xl">{s.icon}</span>
                <div><div className="font-black text-gray-900 dark:text-white text-sm">{s.name}</div><div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{s.role}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-30" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3"><span>🎯</span> Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-4">
              CodeForge was built out of a simple belief: <strong className="text-gray-900 dark:text-white">practice makes perfect</strong>. Whether you are preparing for technical interviews, sharpening your competitive programming skills, or just enjoy solving algorithmic puzzles — CodeForge gives you the tools to grow as a developer.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">Every feature is designed with simplicity and performance in mind. No distractions, no bloat — just you, your code, and the judge.</p>
          </div>
        </div>

        <div className="text-center pb-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Built with love for developers, by developers.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="text-brand-600 dark:text-brand-400 font-bold text-sm hover:underline">Back to Home</Link>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <Link to="/profile" className="text-brand-600 dark:text-brand-400 font-bold text-sm hover:underline">Your Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
