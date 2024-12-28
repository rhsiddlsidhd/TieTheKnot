import { SearchInfoBySubwayNameService } from "../api/location/subway/types";

/**
 * 지하철 역 이름에서 중복을 제거하고 고유한 역 이름 목록을 반환하는 함수
 */
export const filterUniqueStationName = (
  data: SearchInfoBySubwayNameService[]
) => {
  if (!data) return [];
  const dataCopy = [...data];
  const stationArr = Array.from(
    new Set(dataCopy.map((item) => item.STATION_NM))
  ).sort();
  return stationArr;
};

/**
 * 지하철 노선 번호에 고유한 색상을 할당하여 반환하는 함수
 */

export const setLineColors = (data: SearchInfoBySubwayNameService[]) => {
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
  const sotredLineData = [...new Set(data.map((item) => item.LINE_NUM).sort())];
  sotredLineData.forEach((lineNum, i) => {
    newMap.set(lineNum, i < setColor.length ? setColor[i] : "#000000");
  });
  return newMap;
};

/**
 * 지하철 고유한 노선 번호를 반환하는 함수
 */

export const filterStationLines = (data: SearchInfoBySubwayNameService[]) => {
  const result: { [key: string]: string[] } = {};
  const dataCopy = [...data];
  dataCopy.forEach((item) => {
    !result[item.STATION_NM]
      ? (result[item.STATION_NM] = [item.LINE_NUM])
      : (result[item.STATION_NM] = [...result[item.STATION_NM], item.LINE_NUM]);
    result[item.STATION_NM] = result[item.STATION_NM].sort();
  });

  return result;
};

/**
 * {서울역 : [0호선,1호선,2호선]}
 */
