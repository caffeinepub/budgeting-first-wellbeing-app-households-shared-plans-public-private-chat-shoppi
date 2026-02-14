import type { DateOfBirth } from '../backend';

export function calculateAge(dob: DateOfBirth): number {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  
  let age = currentYear - Number(dob.year);
  
  if (currentMonth < Number(dob.month) || (currentMonth === Number(dob.month) && currentDay < Number(dob.day))) {
    age--;
  }
  
  return age;
}

export function isAdult(dob: DateOfBirth): boolean {
  return calculateAge(dob) >= 18;
}

export function validateDateOfBirth(year: string, month: string, day: string): string | null {
  const y = parseInt(year);
  const m = parseInt(month);
  const d = parseInt(day);

  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    return 'Please enter a valid date';
  }

  if (m < 1 || m > 12) {
    return 'Month must be between 1 and 12';
  }

  if (d < 1 || d > 31) {
    return 'Day must be between 1 and 31';
  }

  const currentYear = new Date().getFullYear();
  if (y < 1900 || y > currentYear) {
    return `Year must be between 1900 and ${currentYear}`;
  }

  return null;
}
