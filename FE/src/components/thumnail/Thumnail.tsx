import { useEffect, useState } from "react";

import { calculateweekdays, convertToAMPM } from "../../utils/dateUtils";
import { DayOfLang, ThumnnailProps } from "../../types";
import Img from "../../atoms/Img";
import SectionHeader from "../../atoms/SectionHeader";
import { Container, ThumnailContent } from "../../styles/components";

const Thumnail = ({ weddingDay, weddingTime, weddingData }: ThumnnailProps) => {
  const [dayOfLang, setDayOfLang] = useState<DayOfLang>({ kr: "", eng: "" });
  const [time, setTime] = useState<string>("");
  const { year, month, date, day } = weddingDay;
  const { hours, minutes } = weddingTime;

  useEffect(() => {
    const eng = calculateweekdays(day, "eng");
    const kr = calculateweekdays(day, "kr");
    let time = convertToAMPM(hours, minutes);
    setDayOfLang((prev) => ({ ...prev, eng, kr }));
    setTime(time);
  }, [day, hours, minutes]);

  return (
    <Container>
      <SectionHeader
        title={dayOfLang.eng}
        subTitle={`${year} / ${month} / ${date}`}
      />
      <Img
        src={`http://localhost:8080/upload/${weddingData.thumnail[0]}`}
        alt="썸네일 이미지"
        width="100%"
      />
      <ThumnailContent>
        <div>
          <span>{weddingData.name.groom}</span> 💚{" "}
          <span>{weddingData.name.bride}</span>
        </div>
        <div>
          <span>
            {year}년 {month}월 {date}일 {`${dayOfLang.kr} ${time}`}
          </span>
          <span>{weddingData.weddingAddressDetail}</span>
        </div>
      </ThumnailContent>
    </Container>
  );
};

export default Thumnail;
