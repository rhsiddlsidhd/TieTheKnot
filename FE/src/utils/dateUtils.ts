import { WeekDays } from "../pages/Main";
import { Lang } from "../types";

export const calculateweekdays = (day: WeekDays, lang: Lang) => {
  const weekdaysOfKr = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const weekdaysOfEng = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return lang === "kr" ? weekdaysOfKr[day] : weekdaysOfEng[day];
};

export const getDayOfMonth = (year: number, month: number) => {
  const dayInMonth = [];
  const start = new Date(year, month - 1, 1).getDay();

  for (let i = 0; i < start; i++) {
    dayInMonth.push(undefined);
  }

  const length = new Date(year, month, 0).getDate();
  for (let i = 1; i <= length; i++) {
    dayInMonth.push(i);
  }

  return dayInMonth;
};

export const calculateCountdown = (
  weddingDateSeconds: number,
  currentDateSeconds: number
) => {
  const remainingTime = weddingDateSeconds - currentDateSeconds;
  let days = Math.floor(remainingTime / (60 * 60 * 24));
  days = Math.max(0, days);
  let hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
  hours = Math.max(0, hours);
  let minutes = Math.floor((remainingTime % (60 * 60)) / 60);
  minutes = Math.max(0, minutes);
  let seconds = Math.floor(remainingTime % 60);
  seconds = Math.max(0, seconds);

  return { days, hours, minutes, seconds };
};

export const convertToAMPM = (hours: number, minutes: number): string => {
  let period = hours > 12 ? "오후" : "오전";
  let hours12 = hours % 12 === 0 ? 12 : hours % 12;
  let minutesZero = minutes < 10 ? `0${minutes}` : minutes;

  return `${period} ${hours12}시 ${minutesZero}분`;
};
