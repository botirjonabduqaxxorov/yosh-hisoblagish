/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CalendarRange, CalendarDays, Clock, Gift, Compass, Sparkles } from 'lucide-react';
import { AgeResult } from '../types';

interface ResultDashboardProps {
  metrics: AgeResult;
}

export default function ResultDashboard({ metrics }: ResultDashboardProps) {
  const {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    daysToNextBirthday,
    birthdayWeekday,
    nextBirthdayWeekday,
    zodiac,
    isBirthdayToday
  } = metrics;

  // Uzbek formatted numbers with spaces
  const formatUz = (num: number) => {
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  // SVG calculations for Next Birthday circular progress ring
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Percentage of year passed (0 to 100)
  const percentCompleted = ((365 - daysToNextBirthday) / 365) * 100;
  // Inverse for stroke offset (how much is empty)
  const strokeDashoffset = circumference - (percentCompleted / 100) * circumference;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      id="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 1. Main To'liq Yosh Card */}
      <motion.div
        id="hero-age-card"
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl"
      >
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/30 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Sizning to'liq yoshingiz</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Hayotingiz hisobi
            </h3>
          </div>
          {isBirthdayToday && (
            <div className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 animate-bounce shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-900 shrink-0" />
              Bugun tug'ilgan kuningiz! 🎉
            </div>
          )}
        </div>

        {/* Major Counters Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4">
          {/* Years Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-white/10 hover:bg-white/15 transition-all">
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono tracking-tight">
              {years}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-indigo-100 mt-1">Yil</span>
          </div>

          {/* Months Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-white/10 hover:bg-white/15 transition-all">
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono tracking-tight">
              {months}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-indigo-100 mt-1">Oy</span>
          </div>

          {/* Days Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-white/10 hover:bg-white/15 transition-all">
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono tracking-tight">
              {days}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-indigo-100 mt-1">Kun</span>
          </div>
        </div>

        {/* Friendly visual progress description */}
        <p className="relative z-10 mt-5 text-indigo-100 text-xs sm:text-sm leading-relaxed text-center sm:text-left">
          Siz hozirda <strong className="text-white font-bold">{years} yil, {months} oy va {days} kundan</strong> iborat ajoyib umr yo'lini bosib o'tdingiz.
        </p>
      </motion.div>

      {/* 2. Secondary Bento Grid Metrics */}
      <div id="bento-grid" className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Side stats: Kunlar, Haftalar, Soatlar in 3 stacked cards */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
          
          {/* Jami Kunlar */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <CalendarRange className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-400 block">Jami yashagan kunlar</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-800 tracking-tight block">
                {formatUz(totalDays)} <span className="text-sm font-semibold text-slate-500 font-sans">kun</span>
              </span>
            </div>
          </motion.div>

          {/* Jami Haftalar */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-400 block">Jami yashagan haftalar</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-800 tracking-tight block">
                {formatUz(totalWeeks)} <span className="text-sm font-semibold text-slate-500 font-sans">hafta</span>
              </span>
            </div>
          </motion.div>

          {/* Jami Soatlar */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-400 block">Jami yashagan soatlar</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-800 tracking-tight block">
                {formatUz(totalHours)} <span className="text-sm font-semibold text-slate-500 font-sans">soat</span>
              </span>
            </div>
          </motion.div>

        </div>

        {/* Right Side Stat: Birthday Countdown wheel in a 5-span column */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-xl pointer-events-none -mr-8 -mt-8" />
          
          <Gift className="w-5 h-5 text-rose-500 mb-2" />
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
            Keyingi tug'ilgan kun
          </h4>

          {/* Circular SVG Ring */}
          <div className="relative flex items-center justify-center mb-4">
            <svg width="130" height="130" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />
              {/* Foreground animated progress circle */}
              <motion.circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="#F43F5E"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            {/* Content inside the circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-mono text-slate-800 leading-none">
                {daysToNextBirthday}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 mt-1">
                kun qoldi
              </span>
            </div>
          </div>

          {/* Mini helper status */}
          <p className="text-xs text-slate-600 font-semibold px-2">
            {isBirthdayToday ? (
              <span className="text-rose-600 font-extrabold">🎉 Bugun sizning tug'ilgan kuningiz! 🎉</span>
            ) : (
              <span>
                Navbatdagi nishonlash <strong className="text-rose-500 font-bold">{nextBirthdayWeekday}</strong> kuniga to'g'ri keladi.
              </span>
            )}
          </p>
        </motion.div>
      </div>

      {/* 3. Additional Insights Card */}
      <motion.div
        id="insights-card"
        variants={itemVariants}
        className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
      >
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-indigo-400" />
          Tug'ilgan kuningiz haqida qiziqarli faktlar
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="flex items-start gap-2 bg-white/60 p-3 rounded-xl border border-slate-100">
            <span className="text-xl">📅</span>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Tug'ilgan haftaning kuni</span>
              <span className="font-bold text-slate-800">Siz {birthdayWeekday} kuni tug'ilgansiz.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/60 p-3 rounded-xl border border-slate-100">
            <span className="text-xl">{zodiac.icon}</span>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Sizning burjingiz</span>
              <span className="font-bold text-slate-800">{zodiac.name}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
