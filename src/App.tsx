/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hourglass, Sparkles, AlertCircle } from 'lucide-react';
import DatePicker from './components/DatePicker';
import ResultDashboard from './components/ResultDashboard';
import { calculateAge } from './utils';
import { AgeResult } from './types';

export default function App() {
  // Initialize with a default date so the user can see the gorgeous dashboard immediately (May 15, 2000)
  const defaultDate = new Date(2000, 4, 15);
  
  // State for the temporary date selected in the picker
  const [tempDate, setTempDate] = useState<Date>(defaultDate);
  // State for the actual calculated date
  const [calculatedDate, setCalculatedDate] = useState<Date>(defaultDate);
  // State for validation errors
  const [error, setError] = useState<string | null>(null);
  // Active state to animate recalculations
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-validate future dates whenever tempDate changes
  useEffect(() => {
    const today = new Date();
    if (tempDate.getTime() > today.getTime()) {
      setError("Iltimos, o'tgan sanani kiriting! Kelajakdagi sanani hisoblab bo'lmaydi.");
    } else {
      setError(null);
    }
  }, [tempDate]);

  // Handle calculation action
  const handleCalculate = () => {
    const today = new Date();
    if (tempDate.getTime() > today.getTime()) {
      setError("Iltimos, o'tgan sanani kiriting! Kelajakdagi sanani hisoblab bo'lmaydi.");
      return;
    }
    
    setError(null);
    setIsCalculating(true);
    
    // Simulate a tiny visual calculation state for a premium feel
    setTimeout(() => {
      setCalculatedDate(tempDate);
      setIsCalculating(false);
    }, 400000 / 1000); // very fast, 400ms is perfect for active transition
  };

  // Perform calculations based on the confirmed date
  const metrics = calculateAge(calculatedDate);
  const isValidMetrics = typeof metrics !== 'string';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* Dynamic top glowing banner */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        
        {/* Header Section */}
        <header id="app-header" className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="inline-flex items-center justify-center p-3.5 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 shadow-sm"
          >
            <Hourglass className="w-8 h-8 animate-pulse" />
          </motion.div>
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight"
          >
            Yosh Hisoblagich
          </motion.h1>
          <motion.p
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed"
          >
            Tug'ilgan kuningiz orqali to'liq yoshingiz, yashagan kunlaringiz, haftalaringiz, soatlaringiz va keyingi bayramingizgacha qolgan vaqtni hisoblang.
          </motion.p>
        </header>

        {/* Main Interface Grid */}
        <div id="main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form & Actions */}
          <div className="lg:col-span-5 space-y-5">
            <DatePicker
              selectedDate={tempDate}
              onChange={setTempDate}
              error={error}
            />

            {/* Glowing Action Button */}
            <motion.button
              id="calculate-action-btn"
              onClick={handleCalculate}
              disabled={!!error || isCalculating}
              whileHover={{ scale: error ? 1 : 1.02 }}
              whileTap={{ scale: error ? 1 : 0.98 }}
              className={`w-full py-4 px-6 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer duration-300 ${
                error
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:shadow-indigo-200 hover:shadow-xl active:from-indigo-600 active:to-indigo-700'
              }`}
            >
              {isCalculating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Hisoblanmoqda...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Hisoblash</span>
                </>
              )}
            </motion.button>

            {/* Hint Notice */}
            <p className="text-[11px] text-slate-400 text-center px-4 leading-normal">
              Sana kiritilgandan so'ng, natijalarni yangilash uchun <strong>Hisoblash</strong> tugmasini bosing.
            </p>
          </div>

          {/* Right Column: Dynamic Results Dashboard */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/50 border border-dashed border-slate-200 h-96 rounded-3xl flex flex-col items-center justify-center text-center p-8 shadow-sm"
                >
                  <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-3" />
                  <p className="text-sm font-semibold text-slate-500">Natijalar tayyorlanmoqda...</p>
                </motion.div>
              ) : isValidMetrics ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResultDashboard metrics={metrics as AgeResult} />
                </motion.div>
              ) : (
                <motion.div
                  key="error-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex flex-col items-center justify-center text-center text-rose-800"
                >
                  <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
                  <h3 className="font-bold">Xatolik yuz berdi</h3>
                  <p className="text-sm mt-1">{metrics as string}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Footer info */}
        <footer id="app-footer-info" className="mt-16 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Yosh Hisoblagich. Barcha huquqlar himoyalangan.</p>
          <p className="mt-1">Zamonaviy va qulay dizayn bilan dunyoga kelgan kuningiz va o'tgan davringiz hisobi.</p>
        </footer>

      </div>
    </div>
  );
}
