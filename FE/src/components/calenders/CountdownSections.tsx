import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { weddingDate } from "../../tests/calendar/data";
import { calculateCountdown } from "../../utils/dateUtils";

type TimeStamp = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
const CountdownSections: React.FC = () => {
  const newDate = new Date(`${weddingDate}:00`);
  const weddingDateSeconds = Math.floor(newDate.getTime() / 1000);
  const currentDateSeconds = Math.floor(new Date().getTime() / 1000);
  const [countdown, setCountdown] = useState<TimeStamp>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const { days, hours, minutes, seconds } = calculateCountdown(
      weddingDateSeconds,
      currentDateSeconds
    );
    let id = setInterval(() => {
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(id);
  }, [weddingDateSeconds, currentDateSeconds]);

  const { days, hours, minutes } = countdown;

  return (
    <CountdonwContainer>
      <section>
        {Object.entries(countdown).map(([key, value], i) => {
          const hasBorder = i !== 0 ? "has_border" : "";
          return (
            <div key={i}>
              <div>{key}</div>
              <div className={hasBorder}>{value}</div>
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

export default CountdownSections;

const CountdonwContainer = styled.div`
  margin-top: 1rem;
  width: 50%;

  & > section:first-child {
    display: flex;
    margin-bottom: 1rem;
    & > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      & > .has_border {
        border-left: 1px solid #eeeeee;
      }
    }

    @media (max-width: 300px) {
      flex-wrap: wrap;
      & > div {
        & > .has_border {
          border: none;
        }
      }
    }
  }

  & > section {
    width: 100%;
  }
`;
