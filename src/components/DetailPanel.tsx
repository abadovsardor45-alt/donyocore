import React from 'react';
import { motion } from 'motion/react';
import { X, Landmark, Users, Compass, Maximize, CircleDollarSign, Languages, Info, MoveUpRight, HelpCircle } from 'lucide-react';
import { Country } from '../data/countries';

interface DetailPanelProps {
  country: Country;
  onClose: () => void;
  onFlyTo: (coords: [number, number]) => void;
}

export default function DetailPanel({ country, onClose, onFlyTo }: DetailPanelProps) {
  // Format numbers to local string style
  const formatNum = (num: number) => {
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none space-y-4 relative transition-colors duration-300 w-full"
    >
      {/* Header section: ISO, Name, and Close Action */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold text-lg border border-slate-100 dark:border-slate-700">
            {country.code}
          </div>
          <div>
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-xl select-none">{country.emoji}</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {country.name}
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              {country.continent} qit'asi
            </span>
          </div>
        </div>

        {/* Close circle button */}
        <button
          id="detail-close-btn"
          onClick={onClose}
          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Specification Sheets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        {/* Poytaxt (Capital) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2.5">
          <Landmark className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Poytaxt</span>
            <strong className="text-slate-800 dark:text-slate-200">{country.capital}</strong>
          </div>
        </div>

        {/* Aholi (Population) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2.5">
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Aholi</span>
            <strong className="text-slate-800 dark:text-slate-200">{formatNum(country.population)}</strong>
          </div>
        </div>

        {/* Maydoni (Area size) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2.5">
          <Maximize className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Yuz Maydoni</span>
            <strong className="text-slate-800 dark:text-slate-200">
              {formatNum(country.area)} km²
            </strong>
          </div>
        </div>

        {/* Koordinatalar */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2.5">
          <Compass className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Koordinatalar</span>
            <strong className="text-slate-800 dark:text-slate-200">
              {country.coords[0].toFixed(2)}°, {country.coords[1].toFixed(2)}°
            </strong>
          </div>
        </div>

        {/* Valyuta */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2.5">
          <CircleDollarSign className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Valyuta</span>
            <strong className="text-slate-800 dark:text-slate-200">{country.currency}</strong>
          </div>
        </div>

        {/* Rasmiy til */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2.5">
          <Languages className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wide">Til</span>
            <strong className="text-slate-800 dark:text-slate-200">{country.language}</strong>
          </div>
        </div>
      </div>

      {/* Uzbek Visa policy check box */}
      <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-950/60 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 flex items-center">
          <HelpCircle className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
          O'zbekiston fuqarolari uchun viza:
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
          country.visaUz === 'Vizasiz' 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
            : country.visaUz === 'Viza talab qilinadi'
            ? 'bg-rose-505/10 text-rose-600 dark:text-rose-450 bg-rose-500/10'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`}>
          {country.visaUz}
        </span>
      </div>

      {/* Narrative Fact block */}
      <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-950/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider text-[10px]">
          <Info className="w-3.5 h-3.5" />
          <span>Foydali Qiziqarli Faktlar</span>
        </span>
        <p className="leading-relaxed italic">
          "{country.description}"
        </p>
      </div>

      {/* Fly / Fly-to center button action */}
      <button
        id={`fly-btn-${country.code.toLowerCase()}`}
        onClick={() => onFlyTo(country.coords)}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
      >
        <span>Xaritadan Ko'rish (Boring)</span>
        <MoveUpRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
