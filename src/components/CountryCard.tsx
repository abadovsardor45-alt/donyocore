import React from 'react';
import { motion } from 'motion/react';
import { Plane, Compass, Building2 } from 'lucide-react';
import { Country } from '../data/countries';

interface CountryCardProps {
  key?: string;
  country: Country;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CountryCard({ country, isSelected, onSelect }: CountryCardProps) {
  // Format population nicely for Uzbek (e.g., 36,000,000 to "36 mln" or "36 000 000")
  const formattedPopulation = country.population >= 1000000 
    ? `${(country.population / 1000000).toFixed(1)} mln`
    : `${(country.population / 1000).toFixed(0)} ming`;

  return (
    <motion.div
      id={`country-card-${country.code.toLowerCase()}`}
      onClick={onSelect}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-purple-950/20 border-indigo-500 dark:border-purple-500 shadow-md shadow-indigo-100 dark:shadow-none'
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700/80 hover:shadow-sm'
      }`}
    >
      {/* Left section: ISO initials and texts */}
      <div className="flex items-center space-x-3.5 min-w-0">
        {/* ISO Initial Circle */}
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl text-sm font-mono font-bold tracking-wider shrink-0 transition-all duration-300 ${
            isSelected
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          {country.code}
        </div>

        {/* Text descriptions */}
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm shrink-0">{country.emoji}</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {country.name}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{country.capital}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
            <span className="flex items-center space-x-1">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>{country.continent}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Plane / Actions icon */}
      <div className="flex items-center space-x-1 shrink-0 ml-2">
        <motion.div
          animate={isSelected ? { x: [0, -3, 3, 0], y: [0, -2, 2, 0] } : {}}
          transition={{ repeat: isSelected ? Infinity : 0, duration: 4, ease: 'easeInOut' }}
          className={`p-2 rounded-xl transition-all duration-300 ${
            isSelected
              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'
          }`}
        >
          <Plane className={`w-4.5 h-4.5 transition-transform duration-300 ${
            isSelected ? 'rotate-45 scale-110' : 'group-hover:translate-x-0.5'
          }`} />
        </motion.div>
      </div>

      {/* Flag accent light */}
      {isSelected && (
        <span className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-600 dark:bg-purple-500 rounded-l-2xl" />
      )}
    </motion.div>
  );
}
