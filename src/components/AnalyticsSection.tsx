import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Trophy, PieChart, Users, Maximize2 } from 'lucide-react';
import { Country } from '../data/countries';

interface AnalyticsSectionProps {
  countries: Country[];
}

export default function AnalyticsSection({ countries }: AnalyticsSectionProps) {
  const [metric, setMetric] = useState<'population' | 'area'>('population');

  // Find ranked countries for selected metric
  const topCountries = useMemo(() => {
    return [...countries]
      .sort((a, b) => b[metric] - a[metric]);
  }, [countries, metric]);

  // Aggregate continent-wise metrics
  const continentStats = useMemo(() => {
    const stats: Record<string, { count: number; pop: number; area: number }> = {};
    countries.forEach(c => {
      if (!stats[c.continent]) {
        stats[c.continent] = { count: 0, pop: 0, area: 0 };
      }
      stats[c.continent].count += 1;
      stats[c.continent].pop += c.population;
      stats[c.continent].area += c.area;
    });
    return Object.entries(stats).map(([name, val]) => ({
      name,
      ...val
    }));
  }, [countries]);

  const maxValue = useMemo(() => {
    return Math.max(...topCountries.map(c => c[metric]), 1);
  }, [topCountries, metric]);

  const formatValue = (val: number) => {
    if (metric === 'population') {
      if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)} mlrd`;
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)} mln`;
      return `${(val / 1000).toFixed(0)} ming`;
    } else {
      if (val >= 1000000) return `${(val / 1000000).toFixed(2)} mln km²`;
      return `${new Intl.NumberFormat('uz-UZ').format(val)} km²`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart Section */}
      <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Eng Yirik Davlatlar Reytingi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tizimdagi eng oldi natijalar solishtiruvi</p>
            </div>
          </div>

          {/* Toggle metric */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setMetric('population')}
              className={`px-3.5 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                metric === 'population'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Aholi Soni
            </button>
            <button
              onClick={() => setMetric('area')}
              className={`px-3.5 py-1.5 rounded-md cursor-pointer transition-all duration-200 ${
                metric === 'area'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Yuz Maydoni
            </button>
          </div>
        </div>

        {/* Custom Interactive SVG Graph - Scrollable displaying all 194 countries */}
        <div id="analytics-ranking-list" className="relative pt-2 h-[460px] overflow-y-auto pr-1 scrollbar-none space-y-3">
          {topCountries.map((country, idx) => {
            const percentage = (country[metric] / maxValue) * 100;
            return (
              <div key={country.code} className="flex items-center space-x-3 mb-1 group last:mb-0">
                {/* Ranking Index */}
                <div className="flex items-center justify-center w-6 text-[11px] font-mono font-extrabold text-slate-400 dark:text-slate-500">
                  {idx + 1}
                </div>
                {/* Flag Emoji */}
                <span className="text-sm shrink-0 select-none">{country.emoji}</span>
                {/* Name */}
                <div className="w-24 shrink-0 text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                  {country.name}
                </div>
                {/* Custom bar */}
                <div className="grow relative h-6 bg-slate-50 dark:bg-slate-800/40 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7, delay: Math.min(12, idx) * 0.03, ease: 'easeOut' }}
                    className={`absolute top-0 bottom-0 left-0 rounded-r-lg bg-gradient-to-r ${
                      metric === 'population'
                        ? 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-purple-600'
                        : 'from-violet-500 to-purple-600 dark:from-purple-600 dark:to-pink-600'
                    }`}
                  />
                  {/* Values label layered over bar on hover or small labels */}
                  <span className="absolute left-2.5 top-0 bottom-0 flex items-center text-[10px] font-bold text-white drop-shadow-sm pointer-events-none">
                    {formatValue(country[metric])}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continents breakdown bento */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Qit'alar Kesimida</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Kontinentlar bo'yicha tahliliy yig'indi</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {continentStats.map((item, idx) => {
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/40"
              >
                <div className="flex justify-between items-center mb-1 bg-transparent">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{item.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-150 dark:border-slate-700/50">
                    {item.count} ta davlat
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/30 text-[10px] text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="truncate">Aholi: <strong className="text-slate-700 dark:text-slate-300">{formatValue(item.pop)}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                    <span className="truncate">Maydon: <strong className="text-slate-700 dark:text-slate-300">{formatValue(item.area)}</strong></span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
