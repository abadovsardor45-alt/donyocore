import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Trophy, RotateCcw, CheckCircle2, XCircle, ArrowRight, Award, Zap } from 'lucide-react';
import { Country } from '../data/countries';

interface QuizSectionProps {
  countries: Country[];
}

export default function QuizSection({ countries }: QuizSectionProps) {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  // LocalStorage state for persistent high streaks
  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('geo_quiz_best_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Pick a random country and generate multiple choice options
  const generateNewQuestion = () => {
    if (countries.length < 4) return;
    
    // Pick question country
    const questionCountry = countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(questionCountry);
    setSelectedOption(null);
    setIsCorrect(null);

    // Generate wrong choices
    const otherCapitals = countries
      .filter(c => c.code !== questionCountry.code)
      .map(c => c.capital);
    
    // Shuffle and slice wrong choices
    const shuffledWrong = otherCapitals.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine and shuffle options
    const finalOptions = [questionCountry.capital, ...shuffledWrong].sort(() => 0.5 - Math.random());
    setOptions(finalOptions);
  };

  useEffect(() => {
    generateNewQuestion();
  }, [countries]);

  const handleAnswer = (option: string) => {
    if (selectedOption || !currentCountry) return; // Prevent multiple clicks on same question

    setSelectedOption(option);
    const correct = option === currentCountry.capital;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setScore(prev => prev + 10);
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('geo_quiz_best_streak', newStreak.toString());
      }
    } else {
      setStreak(0);
    }
  };

  const handleReset = () => {
    setScore(0);
    setStreak(0);
    generateNewQuestion();
  };

  // Determine achievement level based on Best Streak
  const achievementLevel = useMemo(() => {
    if (bestStreak >= 15) return { title: 'Geografiya Magistri', color: 'text-amber-500 bg-amber-500/10' };
    if (bestStreak >= 8) return { title: 'Dunyo Sayohatisi', color: 'text-purple-600 bg-purple-500/10' };
    if (bestStreak >= 4) return { title: 'Geografiya Ishqibozi', color: 'text-indigo-600 bg-indigo-500/10' };
    return { title: 'Boshlovchi', color: 'text-slate-500 bg-slate-500/10' };
  }, [bestStreak]);

  if (!currentCountry) return null;

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm space-y-6">
      {/* Quiz Dashboard statistics */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Poytaxtini Toping</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dunyo geografiyasi bilimdonlari sinovi</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-150 cursor-pointer"
          title="O'yinni boshidan boshlash"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Gamified counters bar */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Score */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/40 flex flex-col items-center justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Ballar</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white">{score}</span>
        </div>

        {/* Current streak */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/40 flex flex-col items-center justify-center relative overflow-hidden group">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Ketma-ket (Streak)</span>
          <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 z-10">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" />
            <span>{streak}</span>
          </span>
          {streak > 0 && (
            <div className="absolute inset-0 bg-indigo-500/5 animate-pulse opacity-25" />
          )}
        </div>

        {/* Best Streak & Medal */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/40 flex flex-col items-center justify-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Eng yaxshi natija</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-white flex items-center space-x-1 select-none">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{bestStreak}</span>
          </span>
        </div>
      </div>

      {/* Achievement title label */}
      <div className="flex items-center justify-center py-1.5 px-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/10 text-[10px] sm:text-xs">
        <Award className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
        <span className="text-slate-400 mr-1.5">Unvoningiz:</span>
        <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${achievementLevel.color}`}>
          {achievementLevel.title}
        </span>
      </div>

      {/* Actual trivia Question Body card */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-900/40 border border-slate-150 dark:border-slate-800 flex flex-col items-center text-center space-y-4">
        <motion.div
          key={currentCountry.code}
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-5xl select-none"
        >
          {currentCountry.emoji}
        </motion.div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
            {currentCountry.continent} mamlakati
          </span>
          <h4 className="text-lg font-extrabold text-slate-930 dark:text-white">
            {currentCountry.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quyidagilardan qaysi biri ushbu davlatning poytaxti hisoblanadi?
          </p>
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isClicked = selectedOption === option;
          const isCorrectCapital = option === currentCountry.capital;
          
          let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-white bg-white dark:bg-slate-900';
          
          if (selectedOption) {
            // After selection, we show colors
            if (isCorrectCapital) {
              btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500';
            } else if (isClicked) {
              btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 dark:border-rose-500';
            } else {
              btnStyle = 'border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-900/50 opacity-60';
            }
          }

          return (
            <motion.button
              key={option}
              disabled={selectedOption !== null}
              whileTap={selectedOption ? {} : { scale: 0.97 }}
              onClick={() => handleAnswer(option)}
              className={`p-3.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer text-center flex items-center justify-center space-x-2 ${btnStyle}`}
            >
              <span>{option}</span>
              {selectedOption && isCorrectCapital && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {selectedOption && isClicked && !isCorrectCapital && (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback banner & "Next" action button */}
      <AnimatePresence mode="wait">
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800/60"
          >
            <div className="text-xs">
              {isCorrect ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center mb-0.5">
                  <CheckCircle2 className="w-4.5 h-4.5 mr-1.5" /> Barakalla! To'g'ri javob topildi.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center mb-0.5">
                  <XCircle className="w-4.5 h-4.5 mr-1.5" /> Afsuski, xato javob.
                </span>
              )}
              <p className="text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
                {currentCountry.emoji} {currentCountry.name} poytaxti — <strong className="text-slate-800 dark:text-slate-200">{currentCountry.capital}</strong>.
              </p>
            </div>

            <button
              id="quiz-next-btn"
              onClick={generateNewQuestion}
              className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 shrink-0"
            >
              <span>Keyingisi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
