/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgeResult, ZodiacSign } from './types';

export const uzbekMonths = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr"
];

export const uzbekWeekdays = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba"
];

export const getZodiacSign = (day: number, month: number): ZodiacSign => {
  // month is 0-indexed (0 = Yanvar, 11 = Dekabr)
  const m = month + 1;
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return { name: "Qo'y (Aries)", icon: "♈" };
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return { name: "Buqa (Taurus)", icon: "♉" };
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return { name: "Egizaklar (Gemini)", icon: "♊" };
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return { name: "Qisqichbaqa (Cancer)", icon: "♋" };
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return { name: "Arslon (Leo)", icon: "♌" };
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return { name: "Parizod (Virgo)", icon: "♍" };
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return { name: "Tarozi (Libra)", icon: "♎" };
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return { name: "Chayon (Scorpio)", icon: "♏" };
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return { name: "O'qotar (Sagittarius)", icon: "♐" };
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return { name: "Tog' echkisi (Capricorn)", icon: "♑" };
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return { name: "Qovg'a (Aquarius)", icon: "♒" };
  return { name: "Baliq (Pisces)", icon: "♓" };
};

export function calculateAge(birthDate: Date, currentDate: Date = new Date()): AgeResult | string {
  // Check if birthdate is in the future
  if (birthDate.getTime() > currentDate.getTime()) {
    return "Iltimos, o'tgan sanani kiriting";
  }

  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  // Calculate total differences
  const diffTime = currentDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

  // Next birthday calculation
  const currentZero = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  let nextBDZero = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (nextBDZero < currentZero) {
    nextBDZero.setFullYear(currentDate.getFullYear() + 1);
  }

  const diffTimeToNextBD = nextBDZero.getTime() - currentZero.getTime();
  const daysToNextBirthday = Math.round(diffTimeToNextBD / (1000 * 60 * 60 * 24));

  const isBirthdayToday = birthDate.getDate() === currentDate.getDate() && birthDate.getMonth() === currentDate.getMonth();

  const birthdayWeekday = uzbekWeekdays[birthDate.getDay()];
  const nextBirthdayWeekday = uzbekWeekdays[nextBDZero.getDay()];
  const zodiac = getZodiacSign(birthDate.getDate(), birthDate.getMonth());

  return {
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
  };
}
