import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, Globe, ListFilter, Compass, RefreshCw } from 'lucide-react';

import Header from './components/Header';
import CountryCard from './components/CountryCard';
import DetailPanel from './components/DetailPanel';
import MapComponent from './components/MapComponent';
import CompareSection from './components/CompareSection';
import AnalyticsSection from './components/AnalyticsSection';
import QuizSection from './components/QuizSection';

import { countriesData, Country } from './data/countries';

export default function App() {
  // Navigation & Theme Settings
  const [currentTab, setCurrentTab] = useState<'explore' | 'compare' | 'analytics' | 'quiz'>('explore');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved ? saved === 'dark' : true; // Dark by default as per the user's sleek dark map screenshot!
  });

  // Selection & Details Page States
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(() => {
    // Default to Uzbekistan immediately on startup so the UI loads looking complete and informative
    return countriesData.find(c => c.code === 'UZ') || countriesData[0] || null;
  });

  // Filter & Search Engine States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('alphabetical');
  
  // Mobile UI screens toggle (List of countries vs Interactive Map)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Sync Tailwind class based Dark/Light mode transformations
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme_mode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Reset Filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedContinent('All');
    setSortBy('alphabetical');
  };

  // Perform search & hierarchical sorting computations
  const filteredCountries = useMemo(() => {
    return countriesData
      .filter((country) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          country.name.toLowerCase().includes(query) ||
          country.capital.toLowerCase().includes(query) ||
          country.code.toLowerCase().includes(query);

        const matchesContinent =
          selectedContinent === 'All' || country.continent === selectedContinent;

        return matchesSearch && matchesContinent;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'population-desc':
            return b.population - a.population;
          case 'population-asc':
            return a.population - b.population;
          case 'area-desc':
            return b.area - a.area;
          case 'area-asc':
            return a.area - b.area;
          case 'alphabetical':
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [searchQuery, selectedContinent, sortBy]);

  // Handle flying-to coords smoothly
  const handleFlyToCoords = (coords: [number, number]) => {
    // We can also switch view to 'map' on mobile automatically when fly is triggered so user sees the change!
    setMobileView('map');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col globe-radial-mesh">
      {/* Top Header Module */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        countriesCount={countriesData.length}
      />

      {/* Main Responsive Body Portal content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {currentTab === 'explore' && (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch grow"
            >
              {/* MOBILE SELECTIVE TABS: List vs Map (visible only on mobile) */}
              <div className="lg:hidden flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-2 items-center">
                <button
                  onClick={() => setMobileView('list')}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    mobileView === 'list'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Ro'yxat ({filteredCountries.length})</span>
                </button>
                <button
                  onClick={() => setMobileView('map')}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    mobileView === 'map'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Xarita & Ma'lumotlar</span>
                </button>
              </div>

              {/* Sidebar filter list (Left-panel on Desktop, conditional mobile list) */}
              <div
                className={`lg:col-span-3 flex flex-col space-y-4 h-[600px] lg:h-[700px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl dark:shadow-none transition-all duration-300 ${
                  mobileView === 'list' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Search query input */}
                <div id="sidebar-search-box" className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Davlat, poytaxt nomi yoki kodi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Continental filtering row */}
                <div id="continent-tabs" className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Mintaqalar
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Osiyo', 'Yevropa', 'Afrika', 'Shimoliy Amerika', 'Janubiy Amerika', 'Okeaniya'].map((cont) => (
                      <button
                        key={cont}
                        onClick={() => setSelectedContinent(cont)}
                        className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          selectedContinent === cont
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cont === 'All' ? 'Barchasi' : cont}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sorting and clear filter tools */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Saralash:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-slate-700 dark:text-slate-200 font-bold outline-none cursor-pointer text-xs"
                    >
                      <option value="alphabetical">Alifbo bo'yicha</option>
                      <option value="population-desc">Aholi soni (Kamayish)</option>
                      <option value="population-asc">Aholi soni (O'sish)</option>
                      <option value="area-desc">Maydoni (Kamayish)</option>
                      <option value="area-asc">Maydoni (O'sish)</option>
                    </select>
                  </div>

                  {/* Reset query button */}
                  {(searchQuery || selectedContinent !== 'All' || sortBy !== 'alphabetical') && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Tozalash</span>
                    </button>
                  )}
                </div>

                {/* Unified scrollable list container */}
                <div className="grow overflow-y-auto space-y-2 pr-1 scrollbar-none">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <CountryCard
                        key={country.code}
                        country={country}
                        isSelected={selectedCountry?.code === country.code}
                        onSelect={() => {
                          setSelectedCountry(country);
                          // On mobile, focus the map to let the globe spin and center the selected country
                          setMobileView('map');
                        }}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
                      <p className="text-xl">🗺️</p>
                      <p className="text-xs text-slate-500">Hech qanday davlat mos kelmadi</p>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs font-bold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-900/40 cursor-pointer"
                      >
                        Qidiruvni qayta tiklash
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Map & details right hand system (conditional mobile logic) */}
              <div
                className={`${selectedCountry ? 'lg:col-span-6' : 'lg:col-span-9'} flex flex-col space-y-4 h-[600px] lg:h-[700px] relative transition-all duration-300 ${
                  mobileView === 'map' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Embedded dynamic leaf map */}
                <div className="grow h-full relative">
                  <MapComponent
                    countries={filteredCountries}
                    selectedCountry={selectedCountry}
                    onSelectCountry={(c) => setSelectedCountry(c)}
                    isDarkMode={isDarkMode}
                  />
                </div>

                {/* Mobile / Inline responsive details block */}
                <AnimatePresence>
                  {selectedCountry && (
                    <div className="block lg:hidden w-full overflow-y-auto scrollbar-none shrink-0 z-30">
                      <DetailPanel
                        country={selectedCountry}
                        onClose={() => setSelectedCountry(null)}
                        onFlyTo={handleFlyToCoords}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop dedicated 3rd column sidebar for country details */}
              <AnimatePresence>
                {selectedCountry && (
                  <motion.div
                    key="desktop-details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="hidden lg:flex lg:col-span-3 flex-col h-[600px] lg:h-[700px] overflow-y-auto scrollbar-none shrink-0"
                  >
                    <DetailPanel
                      country={selectedCountry}
                      onClose={() => setSelectedCountry(null)}
                      onFlyTo={handleFlyToCoords}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {currentTab === 'compare' && (
            <motion.div
              key="compare-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto w-full"
            >
              <CompareSection countries={countriesData} />
            </motion.div>
          )}

          {currentTab === 'analytics' && (
            <motion.div
              key="analytics-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AnalyticsSection countries={countriesData} />
            </motion.div>
          )}

          {currentTab === 'quiz' && (
            <motion.div
              key="quiz-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <QuizSection countries={countriesData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
