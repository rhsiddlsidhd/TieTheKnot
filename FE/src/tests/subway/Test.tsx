import React, { useEffect, useState } from "react";
import styled from "styled-components";
import searchInstance from "../../axios/interceptorsSubway/interceptorsSearch";
import subwayLineInstance from "../../axios/interceptorsSubway/interceptorsSubway";

interface SearchInfoBySubwayNameService {
  FR_CODE: string;
  LINE_NUM: string;
  STATION_CD: string;
  STATION_NM: string;
}

interface SearchSTNBySubwayLineInfo extends SearchInfoBySubwayNameService {
  STATION_NM_CHN: string;
  STATION_NM_ENG: string;
  STATION_NM_JPN: string;
}

const Test = () => {
  const [query, setQuery] = useState("");
  const [stationList, setStationList] = useState<string[]>([]);
  const [stationLineColors, setStationLineColors] = useState<
    Map<string, string>
  >(new Map());
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [selectedLineColor, setSelectedLineColor] = useState<string[]>([]);

  useEffect(() => {
    getAllSubwayStationApi();
  }, []);

  const getAllSubwayStationApi = async () => {
    try {
      const startIndex = 1;
      const endIndex = 1000;

      const res = await searchInstance.get(`${startIndex}/${endIndex}/`);
      if (res.status !== 200) {
        throw new Error("fail >>");
      }

      const data = res.data.SearchInfoBySubwayNameService.row;
      const dictionaryLineData = fotmatLineNumColorToMap(data);
      const uniqueStationData = formatStationToSet(data);

      setStationLineColors(dictionaryLineData);
      setStationList(uniqueStationData);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("server Error >>", e.message);
      }
    }
  };

  const getSubwayStationLineApi = async (props: string) => {
    try {
      const station = ` /${props}`;
      const startIndex = 1;
      const endIndex = 10;
      const res = await subwayLineInstance.get(
        `/${startIndex}/${endIndex}/${station}`
      );

      const data = res.data.SearchSTNBySubwayLineInfo.row;
      setSelectedLineColor(formatLineNumToArray(data));
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("server Error >>", e.message);
      }
    }
  };

  const formatLineNumToArray = (data: SearchSTNBySubwayLineInfo[]) => {
    const dataCopy = data.slice();
    return [...new Set(dataCopy.map((item) => item.LINE_NUM).sort())];
  };

  const fotmatLineNumColorToMap = (data: SearchSTNBySubwayLineInfo[]) => {
    if (!data) return new Map();
    const setColor = [
      "#263C96",
      "#3CB44A",
      "#F06E00",
      "#3BA5E0",
      "#9850E4",
      "#BF682D",
      "#697215",
      "#E51E6E",
      "#CFA42B",
      "#8B5784",
      "#2673F2",
      "#AED8C5",
      "#08AF7B",
      "#72B4E2",
      "#96710A",
      "#8BC53F",
      "#EBA900",
      "#4E67A5",
      "#A71E31",
      "#77C371",
      "#C6C100",
      "#FF9D27",
      "#F4AB3E",
      "#6F99D0",
    ];
    const newMap = new Map<string, string>();
    const sotredLineData = [
      ...new Set(data.map((item) => item.LINE_NUM).sort()),
    ];
    sotredLineData.forEach((lineNum, i) => {
      newMap.set(lineNum, i < setColor.length ? setColor[i] : "#000000");
    });
    return newMap;
  };

  const formatStationToSet = (data: SearchInfoBySubwayNameService[]) => {
    if (!data) return [];
    const dataCopy = [...data];
    const stationArr = Array.from(
      new Set(dataCopy.map((item) => item.STATION_NM))
    ).sort();
    return stationArr;
  };

  const onStationClick = (props: string) => {
    setSelectedStation(props);
  };

  const onSubwayLineClick = (props: string) => {
    if (props === "") return;
    getSubwayStationLineApi(props);
  };

  const onQueryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /**
     * API 잦은 호출 => lodash debounce 적용으로 해결할 수 있지만
     * API 전체 데이터를 미리 받아서 상태에 저장해놓은 이유
     * 공공데이터 API 호출이 같은 URL 주소를 가지고 일정하게 호출이 되지 않는 문제
     *
     * => 전체 데이터를 받아서 e.target.value 입력에 따라 전체 데이터를 받아놓은 상태값을 filter
     * => 전체적인 서버 호출을 줄일수 있으며, 불안정한 데이터 호출에 대한 안정성을 높일수 있다.
     */
    setQuery(e.target.value);
  };

  return (
    <Container>
      <div>
        <BasicInput onChange={onQueryInputChange} />
        <button onClick={() => onSubwayLineClick(selectedStation)}>확인</button>
      </div>
      <StationListWrapper>
        {query &&
          stationList
            .filter((station) => station.includes(query))
            .map((station, i) => {
              return (
                <StationList onClick={() => onStationClick(station)} key={i}>
                  {station}
                </StationList>
              );
            })}
      </StationListWrapper>
      {selectedStation && <div>선택된 역: {selectedStation}</div>}
      <LineContainer>
        {selectedLineColor.map((lineNum, i) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }} key={i}>
              <Dotted
                style={{ backgroundColor: stationLineColors.get(lineNum) }}
              ></Dotted>
              <div>{lineNum}</div>
            </div>
          );
        })}
      </LineContainer>
    </Container>
  );
};

export default Test;

const Dotted = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
`;

const Container = styled.div`
  padding: 3rem;
`;

const LineContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BasicInput = styled.input`
  margin-bottom: 3rem;
`;

const StationListWrapper = styled.ul`
  list-style: none;

  overflow-y: scroll;
  height: 10rem;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

const StationList = styled.li``;
