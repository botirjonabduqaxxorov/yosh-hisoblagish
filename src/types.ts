/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ZodiacSign {
  name: string;
  icon: string;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  daysToNextBirthday: number;
  birthdayWeekday: string;
  nextBirthdayWeekday: string;
  zodiac: ZodiacSign;
  isBirthdayToday: boolean;
}
