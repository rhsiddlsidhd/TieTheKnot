import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { weddingDate } from "../tests/calendar/data";

type TimeStamp = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
const DdayCountDown: React.FC = () => {
  const [countdown, setCountdown] = useState<TimeStamp>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const newDate = new Date(`${weddingDate}:00`);
  const weddingDateSeconds = Math.floor(newDate.getTime() / 1000);

  const currentDateSeconds = Math.floor(new Date().getTime() / 1000);
  const { days, hours, minutes } = countdown;

  const solution = (weddingDateSeconds: number, currentDateSeconds: number) => {
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

  useEffect(() => {
    const { days, hours, minutes, seconds } = solution(
      weddingDateSeconds,
      currentDateSeconds
    );

    let id = setInterval(() => {
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(id);
  }, [weddingDateSeconds, currentDateSeconds]);

  return (
    <CountdonwContainer>
      <section>
        {Object.entries(countdown).map(([key, value], i) => {
          const border = i !== 0 ? "1px solid #eeeeee" : "";
          return (
            <div>
              <div>{key}</div>
              <div style={{ borderLeft: border }}>{value}</div>
            </div>
          );
        })}
      </section>
      <section>
        <div>
          {days !== 0
            ? `결혼식이 ${days}일 남았습니다`
            : hours !== 0
            ? `결혼식까지 ${hours}시간 남았습니다`
            : minutes !== 0
            ? `결혼식까지 ${minutes}분 남았습니다`
            : `결혼식이 끝났습니다`}
        </div>
      </section>
    </CountdonwContainer>
  );
};

export default DdayCountDown;

const CountdonwContainer = styled.div`
  margin-top: 1rem;
  width: 50%;
  > section:first-child {
    display: flex;
    margin-bottom: 1rem;
    & > div {
      width: 100%;
    }
  }
`;
