import { useEffect, useState } from "react";

import styled from "styled-components";

import getAllSubwayStationApi from "../../apis/api/location/subway/getAllSubwayStations";
import getSelectedSubwayStation from "../../apis/api/location/subway/getSelectedSubwayStation";
import {
  filterStationLines,
  setLineColors,
} from "../../apis/services/subwayStation";
import { NaviWrapper } from "./NaviSections";

const SubwaySections = () => {
  const [allLineColors, setAllLineColors] = useState<Map<String, string>>(
    new Map()
  );
  const [stationLines, setStationLines] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [exitInfoText, setExitInfoText] = useState<{ [key: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  //렌더를 줄이기 위해 병렬적으로 처리 하여 모두 처리가 됐을때 렌더을 하기 위함
  //promise.all을 사용하여 병렬적으로 처리

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allStation, selectedStation] = await Promise.all([
          getAllSubwayStationApi(),
          getSelectedSubwayStation("다산"),
        ]);
        setAllLineColors(setLineColors(allStation));
        setStationLines(filterStationLines(selectedStation));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const text = {
      exitInfo: "역 하차",
      moreInfo: "추가 정보를 기입하세요.",
    };
    setExitInfoText(text);
  }, []);
  return (
    <SectionWrapper>
      <NaviWrapper>
        <h4>지하철</h4>
        {loading ? (
          <SubwayTextWrapper>
            {Object.keys(stationLines).map((station, i) => {
              return (
                <div key={i}>
                  <ExitInfoText>
                    {station}
                    {exitInfoText.exitInfo}
                  </ExitInfoText>
                  <LineWrapper>
                    {stationLines[station].map((line, i) => {
                      return (
                        <p key={i}>
                          <Dotted
                            style={{
                              backgroundColor: allLineColors.get(line),
                            }}
                          />
                          {line}
                        </p>
                      );
                    })}
                  </LineWrapper>
                </div>
              );
            })}
            <p>{exitInfoText.moreInfo}</p>
          </SubwayTextWrapper>
        ) : (
          <div>로딩중</div>
        )}
      </NaviWrapper>
    </SectionWrapper>
  );
};

export default SubwaySections;

export const SectionWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
`;

const SubwayTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > div:first-child {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
`;

const ExitInfoText = styled.p``;

const LineWrapper = styled.div`
  display: flex;
  & > p {
    display: flex;
    align-items: center;
    margin-right: 0.3rem;
  }
`;
export const Dotted = styled.span`
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
`;
