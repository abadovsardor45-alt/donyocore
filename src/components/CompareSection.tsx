import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GitCompare, Users, Map, Globe, Award, Landmark, MessageSquare, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { Country } from '../data/countries';

interface CompareSectionProps {
  countries: Country[];
}

export default function CompareSection({ countries }: CompareSectionProps) {
  const [countryACode, setCountryACode] = useState<string>('UZ'); // Default: Uzbekistan
  const [countryBCode, setCountryBCode] = useState<string>('TR'); // Default: Turkey

  const countryA = countries.find(c => c.code === countryACode) || countries[0];
  const countryB = countries.find(c => c.code === countryBCode) || countries[1];

  const formatPop = (num: number) => {
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  const formatArea = (num: number) => {
    return new Intl.NumberFormat('uz-UZ').format(num) + " km²";
  };

  // Compare metrics
  const popRatio = countryA.population / (countryA.population + countryB.population || 1);
  const areaRatio = countryA.area / (countryA.area + countryB.area || 1);

  return (
    <div className="space-y-6">
      {/* Selection Panel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Country A Selection */}
        <div id="compare-selector-a" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm">
          <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            1-Mamlakat
          </label>
          <div className="flex items-center space-x-3.5">
            <span className="text-3xl select-none">{countryA.emoji}</span>
            <select
              value={countryACode}
              onChange={(e) => setCountryACode(e.target.value)}
              className="w-full text-base font-bold bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {countries.map((c) => (
                <option key={`comp-a-${c.code}`} value={c.code} disabled={c.code === countryBCode}>
                  {c.emoji} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic decorative comparison arrow */}
        <div className="hidden md:absolute md:left-1/2 md:-translate-x-1/2 md:flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white border-4 border-slate-50 dark:border-slate-950 shadow-md">
          <ArrowLeftRight className="w-4 h-4" />
        </div>

        {/* Country B Selection */}
        <div id="compare-selector-b" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm">
          <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            2-Mamlakat
          </label>
          <div className="flex items-center space-x-3.5">
            <span className="text-3xl select-none">{countryB.emoji}</span>
            <select
              value={countryBCode}
              onChange={(e) => setCountryBCode(e.target.value)}
              className="w-full text-base font-bold bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {countries.map((c) => (
                <option key={`comp-b-${c.code}`} value={c.code} disabled={c.code === countryACode}>
                  {c.emoji} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main comparative parameters */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 space-y-6">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-805 pb-3 flex items-center space-x-2">
          <GitCompare className="w-4 h-4 text-indigo-500" />
          <span>Statistik Tahliliy Solishtiruv</span>
        </h3>

        {/* Dynamic Scale Bars */}
        <div className="space-y-5">
          {/* Population Comparative Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              <span className="text-slate-900 dark:text-white font-bold">{formatPop(countryA.population)}</span>
              <span className="flex items-center space-x-1.5 font-mono text-[10px]">
                <Users className="w-3.5 h-3.5" />
                <span>Aholi soni</span>
              </span>
              <span className="text-slate-900 dark:text-white font-bold">{formatPop(countryB.population)}</span>
            </div>
            <div className="w-full h-3 flex bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${popRatio * 100}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="h-full bg-indigo-600 rounded-l-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(1 - popRatio) * 100}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="h-full bg-purple-500 rounded-r-full"
              />
            </div>
          </div>

          {/* Area Comparative Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              <span className="text-slate-900 dark:text-white font-bold">{formatArea(countryA.area)}</span>
              <span className="flex items-center space-x-1.5 font-mono text-[10px]">
                <Map className="w-3.5 h-3.5" />
                <span>Yuz maydoni</span>
              </span>
              <span className="text-slate-900 dark:text-white font-bold">{formatArea(countryB.area)}</span>
            </div>
            <div className="w-full h-3 flex bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${areaRatio * 100}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="h-full bg-indigo-600 rounded-l-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(1 - areaRatio) * 100}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="h-full bg-purple-500 rounded-r-full"
              />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 pt-2 text-sm">
          {/* Header Row */}
          <div className="grid grid-cols-3 py-3 font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <div>{countryA.name}</div>
            <div className="text-center">Parametr</div>
            <div className="text-right">{countryB.name}</div>
          </div>

          {/* Capital Row */}
          <div className="grid grid-cols-3 py-3.5 items-center">
            <div className="font-bold text-slate-800 dark:text-slate-200">{countryA.capital}</div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center space-x-1">
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span>Poytaxt</span>
            </div>
            <div className="text-right font-bold text-slate-800 dark:text-slate-200">{countryB.capital}</div>
          </div>

          {/* Continent Row */}
          <div className="grid grid-cols-3 py-3.5 items-center">
            <div className="text-slate-700 dark:text-slate-300">{countryA.continent}</div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center space-x-1">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>Qit'a</span>
            </div>
            <div className="text-right text-slate-700 dark:text-slate-300">{countryB.continent}</div>
          </div>

          {/* Currency Row */}
          <div className="grid grid-cols-3 py-3.5 items-center">
            <div className="text-slate-700 dark:text-slate-300 truncate">{countryA.currency}</div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center space-x-1">
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span>Valyuta</span>
            </div>
            <div className="text-right text-slate-700 dark:text-slate-300 truncate">{countryB.currency}</div>
          </div>

          {/* Language Row */}
          <div className="grid grid-cols-3 py-3.5 items-center">
            <div className="text-slate-700 dark:text-slate-300 truncate">{countryA.language}</div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Rasmiy Til</span>
            </div>
            <div className="text-right text-slate-700 dark:text-slate-300 truncate">{countryB.language}</div>
          </div>

          {/* Visa Row */}
          <div className="grid grid-cols-3 py-3.5 items-center">
            <div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                countryA.visaUz === 'Vizasiz' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {countryA.visaUz}
              </span>
            </div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center space-x-1">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>O'zbeklar uchun Viza</span>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                countryB.visaUz === 'Vizasiz' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {countryB.visaUz}
              </span>
            </div>
          </div>
        </div>

        {/* Fun comparative fact display */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-dotted border-slate-200 dark:border-slate-800 space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">{countryA.emoji} {countryA.name} haqida fakt:</strong>
            <p className="italic">"{countryA.description}"</p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">{countryB.emoji} {countryB.name} haqida fakt:</strong>
            <p className="italic">"{countryB.description}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
