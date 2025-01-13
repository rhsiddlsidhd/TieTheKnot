import React from "react";
import styled from "styled-components";
import { getDayOfMonth } from "../../utils/dateUtils";
import { WeddingDay } from "../../pages/Main";

interface CalenderProps {
  weddingDay: WeddingDay;
  weekdaysOfKr: string[];
}

const CalenderSections = ({ weddingDay, weekdaysOfKr }: CalenderProps) => {
  const { year, month, date } = weddingDay;
  let dayArr = getDayOfMonth(year, month);
  return (
    <CalendarSection>
      <DayWrapper>
        {weekdaysOfKr.map((v, i) => {
          const redColor = v === "일요일" ? "red" : "black";
          return (
            <div style={{ color: redColor }} key={i}>
              {v[0]}
            </div>
          );
        })}
      </DayWrapper>
      <DateWrapper>
        {dayArr.map((v, i) => {
          const isSunday = new Date(year, month - 1, v).getDay();
          let sunDay = isSunday === 0 ? "sunDay" : "";
          let dDay = v === date ? "dDay" : "";
          return (
            <div
              key={i}
              style={{
                borderRadius: "20px",
              }}
              className={`${sunDay} ${dDay} `}
            >
              {v}
            </div>
          );
        })}
      </DateWrapper>
    </CalendarSection>
  );
};

export default CalenderSections;

const CalendarSection = styled.div`
  width: 66%;
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
`;

const DayWrapper = styled.div`
  display: flex;

  > div {
    width: calc(100% / 7);
  }
`;

const DateWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    width: calc(100% / 7);
  }
  .sunDay {
    color: red;
  }
  .dDay {
    color: white;
    background-color: pink;
  }
`;
