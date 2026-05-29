import React from 'react';
import { Globe, Moon, Sun, BarChart2, Lightbulb, GitCompare, Search } from 'lucide-react';

interface HeaderProps {
  currentTab: 'explore' | 'compare' | 'analytics' | 'quiz';
  setCurrentTab: (tab: 'explore' | 'compare' | 'analytics' | 'quiz') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  countriesCount: number;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
  countriesCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <div className="w-3.5 h-3.5 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                DUNYO<span className="text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-4 ml-0.5 font-bold">CORE</span>
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  SYSTEM: ONLINE • {countriesCount} TA DAVLAT
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation (Desktop) */}
          <nav className="hidden md:flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              id="nav-explore-btn"
              onClick={() => setCurrentTab('explore')}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                currentTab === 'explore'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Xarita & Izlash</span>
            </button>
            <button
              id="nav-compare-btn"
              onClick={() => setCurrentTab('compare')}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                currentTab === 'compare'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Solishtirish</span>
            </button>
            <button
              id="nav-analytics-btn"
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                currentTab === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Tahlillar</span>
            </button>
            <button
              id="nav-quiz-btn"
              onClick={() => setCurrentTab('quiz')}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                currentTab === 'quiz'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Viktorina</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Switcher */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 shadow-sm cursor-pointer"
              title={isDarkMode ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation (Mobile Dropdown Bar) */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCurrentTab('explore')}
            className={`flex flex-col items-center flex-1 py-1 text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              currentTab === 'explore'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Globe className="w-4 h-4 mb-0.5" />
            <span>Xarita</span>
          </button>
          <button
            onClick={() => setCurrentTab('compare')}
            className={`flex flex-col items-center flex-1 py-1 text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              currentTab === 'compare'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <GitCompare className="w-4 h-4 mb-0.5" />
            <span>Solishtirish</span>
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex flex-col items-center flex-1 py-1 text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              currentTab === 'analytics'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BarChart2 className="w-4 h-4 mb-0.5" />
            <span>Tahlillar</span>
          </button>
          <button
            onClick={() => setCurrentTab('quiz')}
            className={`flex flex-col items-center flex-1 py-1 text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              currentTab === 'quiz'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Lightbulb className="w-4 h-4 mb-0.5" />
            <span>Viktorina</span>
          </button>
        </div>
      </div>
    </header>
  );
}
