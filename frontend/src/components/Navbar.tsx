import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserInfo } from '../api';

interface NavbarProps {
  currentUser: UserInfo | null;
  onLogout: () => void;
}

const getHeaderTheme = (pathname: string) => {
  if (pathname === '/') {
    return {
      shadow: 'shadow-purple-500/10 dark:shadow-purple-500/5',
      border: 'border-purple-200/50 dark:border-purple-500/20',
      activeText: 'text-purple-600 dark:text-purple-400',
      logoGradient: 'from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400',
      logoIconBg: 'from-brand-600 to-purple-500 shadow-brand-500/30 dark:shadow-purple-500/20',
      underline: 'bg-gradient-to-r from-brand-500 to-purple-500',
    };
  }
  if (pathname.startsWith('/problems')) {
    return {
      shadow: 'shadow-brand-500/15 dark:shadow-brand-500/10',
      border: 'border-brand-200/60 dark:border-brand-500/25',
      activeText: 'text-brand-600 dark:text-brand-400',
      logoGradient: 'from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400',
      logoIconBg: 'from-brand-600 to-indigo-500 shadow-brand-500/30 dark:shadow-indigo-500/20',
      underline: 'bg-gradient-to-r from-brand-500 to-indigo-500',
    };
  }
  if (pathname === '/leaderboard') {
    return {
      shadow: 'shadow-cyan-500/20 dark:shadow-cyan-400/15',
      border: 'border-cyan-200/60 dark:border-cyan-500/35 border-t-cyan-300 dark:border-t-cyan-400/50',
      activeText: 'text-cyan-600 dark:text-cyan-400',
      logoGradient: 'from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-400',
      logoIconBg: 'from-cyan-500 to-purple-500 shadow-cyan-500/30 dark:shadow-cyan-500/20',
      underline: 'bg-gradient-to-r from-cyan-400 to-purple-500',
    };
  }
  if (pathname === '/profile') {
    return {
      shadow: 'shadow-emerald-500/15 dark:shadow-emerald-500/10',
      border: 'border-emerald-200/60 dark:border-emerald-500/25',
      activeText: 'text-emerald-600 dark:text-emerald-400',
      logoGradient: 'from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400',
      logoIconBg: 'from-emerald-500 to-cyan-500 shadow-emerald-500/30 dark:shadow-emerald-500/20',
      underline: 'bg-gradient-to-r from-emerald-400 to-cyan-500',
    };
  }
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return {
      shadow: 'shadow-pink-500/15 dark:shadow-pink-500/10',
      border: 'border-pink-200/60 dark:border-pink-500/25',
      activeText: 'text-pink-600 dark:text-pink-400',
      logoGradient: 'from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400',
      logoIconBg: 'from-pink-600 to-purple-500 shadow-pink-500/30 dark:shadow-pink-500/20',
      underline: 'bg-gradient-to-r from-pink-500 to-purple-500',
    };
  }
  // Default fallback
  return {
    shadow: 'shadow-brand-500/10 dark:shadow-brand-500/5',
    border: 'border-white/50 dark:border-white/10',
    activeText: 'text-brand-600 dark:text-brand-400',
    logoGradient: 'from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400',
    logoIconBg: 'from-brand-600 to-purple-500 shadow-brand-500/40',
    underline: 'bg-brand-500',
  };
};

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const theme = getHeaderTheme(location.pathname);

  const isHomeActive = location.pathname === '/';
  const isProblemsActive = location.pathname.startsWith('/problems');
  const isLeaderboardActive = location.pathname === '/leaderboard';

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-6 z-50 px-4 md:px-6 animate-fade-in">
      <header className={`h-16 max-w-6xl mx-auto glass-panel !rounded-full flex items-center px-4 md:px-8 justify-between shadow-2xl ${theme.shadow} border ${theme.border} backdrop-saturate-200 transition-all duration-500`}>
        <Link to="/" className={`text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.logoGradient} tracking-tight flex items-center gap-2 md:gap-3 uppercase group transition-colors duration-500`}>
          <div className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr ${theme.logoIconBg} shadow-lg group-hover:scale-110 transition-all duration-300`}>
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="hidden sm:inline">CodeForge</span>
        </Link>
        <nav className="hidden md:flex space-x-8 items-center">
          <Link to="/" className={`relative hover:text-brand-600 dark:hover:text-cyan-400 font-bold text-lg transition-colors group ${isHomeActive ? theme.activeText : 'text-gray-700 dark:text-gray-200'}`}>
            Home
            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isHomeActive ? `w-full ${theme.underline}` : 'w-0 bg-brand-500 group-hover:w-full'}`}></span>
          </Link>
          <Link to="/problems" className={`relative hover:text-brand-600 dark:hover:text-cyan-400 font-bold text-lg transition-colors group ${isProblemsActive ? theme.activeText : 'text-gray-700 dark:text-gray-200'}`}>
            Problems
            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isProblemsActive ? `w-full ${theme.underline}` : 'w-0 bg-brand-500 group-hover:w-full'}`}></span>
          </Link>
          <Link to="/leaderboard" className={`relative hover:text-brand-600 dark:hover:text-cyan-400 font-bold text-lg transition-colors group ${isLeaderboardActive ? theme.activeText : 'text-gray-700 dark:text-gray-200'}`}>
            Leaderboard
            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isLeaderboardActive ? `w-full ${theme.underline}` : 'w-0 bg-brand-500 group-hover:w-full'}`}></span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 md:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <div className="hidden md:block">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                  <span>{currentUser.username}</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3.5 py-1.5 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300 transition text-sm cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 rounded-xl text-gray-700 dark:text-gray-200 font-bold hover:text-brand-600 dark:hover:text-brand-400 transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-500 text-white font-bold hover:scale-105 transform transition-all duration-300 shadow-lg shadow-brand-500/30">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden p-1.5 text-gray-700 dark:text-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 glass-panel rounded-2xl p-4 flex flex-col gap-4 shadow-2xl z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800">
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="font-bold text-lg text-gray-800 dark:text-gray-200">Home</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/problems" className="font-bold text-lg text-gray-800 dark:text-gray-200">Problems</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/leaderboard" className="font-bold text-lg text-gray-800 dark:text-gray-200">Leaderboard</Link>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-800 my-2"></div>
          {currentUser ? (
            <>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/profile" className="font-bold text-lg text-brand-600 dark:text-brand-400">Profile ({currentUser.username})</Link>
              <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-left font-bold text-lg text-red-500">Log Out</button>
            </>
          ) : (
            <>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="font-bold text-lg text-gray-800 dark:text-gray-200">Sign In</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/register" className="font-bold text-lg text-brand-600 dark:text-brand-400">Register</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
