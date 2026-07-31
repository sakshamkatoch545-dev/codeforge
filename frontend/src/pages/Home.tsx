import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('codeforge_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:px-8 flex flex-col items-center text-center">
        
        {/* Hero Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-16 max-w-4xl w-full mx-auto shadow-2xl mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50/50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 font-medium text-sm mb-8 border border-brand-200 dark:border-brand-800/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            CodeForge v2.0 is live
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-tight">
            Master the craft of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400 text-glow">
              Competitive Programming
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            The premium platform to sharpen your coding skills, conquer algorithmic challenges, and climb the global leaderboard.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-4">
            <Link to="/problems" className="w-full sm:w-auto px-8 py-4 rounded-xl glass-button-primary font-bold text-lg hover:scale-105 transform transition-all duration-300">
              Start Coding Now
            </Link>
            {!isLoggedIn && (
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl backdrop-blur-md bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white font-bold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-pink-500/20 border border-white/30">
                Create an Account
              </Link>
            )}
            <Link to="/leaderboard" className="w-full sm:w-auto px-8 py-4 rounded-xl glass-button font-bold text-lg text-gray-800 dark:text-white hover:scale-105 transform transition-all duration-300">
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="glass-card p-8 flex flex-col items-center text-center animate-float">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center mb-6 text-brand-600 dark:text-brand-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Curated Problems</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              From Arrays to Advanced DP, master a carefully structured path of algorithms and data structures.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center animate-float-delayed">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast Judge</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Execute your code securely and instantly in isolated sandboxes supporting Python, C++, and more.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center animate-float">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Global Leaderboard</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Compete against top talent worldwide and track your progress as you level up your rating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
