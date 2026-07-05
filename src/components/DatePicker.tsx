/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { uzbekMonths } from '../utils';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  error: string | null;
}

export default function DatePicker({ selectedDate, onChange, error }: DatePickerProps) {
  const currentYear = new Date().getFullYear();
  
  // Local state for dropdowns
  const [day, setDay] = useState<number>(selectedDate.getDate());
  const [month, setMonth] = useState<number>(selectedDate.getMonth()); // 0-11
  const [year, setYear] = useState<number>(selectedDate.getFullYear());

  // Keep dropdowns in sync when selectedDate changes from parent (e.g., presets)
  useEffect(() => {
    setDay(selectedDate.getDate());
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
  }, [selectedDate]);

  // Determine maximum days in the currently selected month and year
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);

  // If the currently selected day is greater than days in the new month/year, clamp it
  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
      onChange(new Date(year, month, daysInMonth));
    }
  }, [year, month, daysInMonth, day, onChange]);

  // Notify parent of changes from dropdowns
  const handleDropdownChange = (newDay: number, newMonth: number, newYear: number) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
    onChange(new Date(newYear, newMonth, newDay));
  };

  // Synchronize from native date picker
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    }
  };

  // Quick preset: Random date between 1950 and 2020
  const setRandomDate = () => {
    const start = new Date(1950, 0, 1).getTime();
    const end = new Date(2020, 11, 31).getTime();
    const randomTime = start + Math.random() * (end - start);
    const randomDate = new Date(randomTime);
    onChange(randomDate);
  };

  // Convert current state to string format (YYYY-MM-DD) for native date input
  const toISODateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Render years array from currentYear down to 1900
  const yearsArray = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div id="date-picker-container" className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h2 id="picker-title" className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Tug'ilgan sanangizni kiriting
        </h2>
        <button
          id="random-btn"
          type="button"
          onClick={setRandomDate}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all duration-200 flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          Tasodifiy sana
        </button>
      </div>

      {/* Main Pickers Grid */}
      <div className="space-y-4">
        {/* Dropdowns for high precision control */}
        <div id="dropdowns-row" className="grid grid-cols-3 gap-3">
          {/* Day Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="day-select" className="text-xs font-semibold text-slate-500 pl-1">Kun</label>
            <div className="relative">
              <select
                id="day-select"
                value={day}
                onChange={(e) => handleDropdownChange(Number(e.target.value), month, year)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm cursor-pointer font-mono"
              >
                {daysArray.map((d) => (
                  <option key={d} value={d}>
                    {String(d).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Month Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="month-select" className="text-xs font-semibold text-slate-500 pl-1">Oy</label>
            <div className="relative">
              <select
                id="month-select"
                value={month}
                onChange={(e) => handleDropdownChange(day, Number(e.target.value), year)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm cursor-pointer"
              >
                {uzbekMonths.map((name, index) => (
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Year Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="year-select" className="text-xs font-semibold text-slate-500 pl-1">Yil</label>
            <div className="relative">
              <select
                id="year-select"
                value={year}
                onChange={(e) => handleDropdownChange(day, month, Number(e.target.value))}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm cursor-pointer font-mono"
              >
                {yearsArray.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Picker Sync Integration */}
        <div id="calendar-input-row" className="flex flex-col gap-1.5 pt-1">
          <label htmlFor="calendar-picker" className="text-xs font-semibold text-slate-500 pl-1">
            Yoki kalendardan tanlang
          </label>
          <div className="relative">
            <input
              id="calendar-picker"
              type="date"
              value={toISODateString(selectedDate)}
              onChange={handleNativeChange}
              max={toISODateString(new Date())}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm cursor-pointer flex justify-between items-center outline-none"
            />
          </div>
        </div>

        {/* Modern Error State (future date) */}
        {error && (
          <div id="error-box" className="mt-3 flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs font-medium leading-relaxed transition-all duration-300">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
