import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { weddingDate } from "./data";

type TimeStamp = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const Test = () => {
  const [countdown, setCountdown] = useState<TimeStamp>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const newDate = new Date(`${weddingDate}:00`);
  const weddingDateSeconds = Math.floor(newDate.getTime() / 1000);

  const currentDateSeconds = Math.floor(new Date().getTime() / 1000);

  const solution = (weddingDateSeconds: number, currentDateSeconds: number) => {
    const remainingTime = weddingDateSeconds - currentDateSeconds;

    const days = Math.floor(remainingTime / (60 * 60 * 24));
    const hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
    const seconds = Math.floor(remainingTime % 60);

    return { days, hours, minutes, seconds };
  };

  // useEffect(() => {
  //   const { days, hours, minutes, seconds } = solution(
  //     weddingDateSeconds,
  //     currentDateSeconds
  //   );
  //   let id = setInterval(() => {
  //     setCountdown({ days, hours, minutes, seconds });
  //   }, 1000);
  //   return () => clearInterval(id);
  // }, [weddingDateSeconds, currentDateSeconds]);

  const weddingDay = {
    year: newDate.getFullYear(),
    month: newDate.getMonth() + 1,
    date: newDate.getDate(),
    day: newDate.getDay(),
  };

  const weddingTime = {
    hours: newDate.getHours(),
    minutes: newDate.getMinutes(),
  };

  const { year, month, date, day } = weddingDay;
  const { hours, minutes } = weddingTime;

  const weekdays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const convertToAMPM = (hours: number, minutes: number): string => {
    let period = hours > 12 ? "오후" : "오전";
    let hours12 = hours % 12 === 0 ? 12 : hours % 12;
    let minutesZero = minutes < 10 ? `0${minutes}` : minutes;

    return `${period} ${hours12}시 ${minutesZero}분`;
  };

  const getDayOfMonth = (year: number, month: number) => {
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

  let dayArr = getDayOfMonth(year, 12);

  let time = convertToAMPM(hours, minutes);

  return (
    <Container>
      <p>{`${year}.${month}.${date}`}</p>
      <p>{`${weekdays[day]} ${time}`}</p>
      <CalendarSection>
        <DayWrapper>
          {weekdays.map((v, i) => {
            return <div key={i}>{v}</div>;
          })}
        </DayWrapper>
        <DateWrapper>
          {dayArr.map((v, i) => {
            const isSunday = new Date(year, month - 1, v).getDay();
            const redColor = isSunday === 0 ? "red" : "black";
            const bgcColor = v === day ? "red" : "";
            return (
              <div
                key={i}
                style={{ color: redColor, backgroundColor: bgcColor }}
              >
                {v}
              </div>
            );
          })}
        </DateWrapper>
      </CalendarSection>
      <div>남은시간</div>
      <div>
        days {countdown.days} : hours {countdown.hours} : min
        {countdown.minutes} : sec {countdown.seconds}
      </div>
    </Container>
  );
};

export default Test;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarSection = styled.div`
  width: 22rem;
  height: 12rem;
  border: 1px solid black;
`;

const DayWrapper = styled.div`
  display: flex;
  > div {
    min-width: 3rem;
  }
`;

const DateWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    min-width: 3rem;
  }
`;
