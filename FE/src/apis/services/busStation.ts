import {
  BusStationResponse,
  filteredPassingBuses,
  PassingBusesData,
  PassingBusesResponse,
  StationRoute,
} from "../api/location/bus/types";

export const filterBusStation = (
  data: BusStationResponse[]
): StationRoute[] => {
  const result = data
    .slice(0, 4)
    .map((item: any) => {
      const mobileText = item.mobileNo._text.trim();
      const stationId = Number(item.stationId._text.trim());
      const stationName = item.stationName._text.trim();
      return {
        stationNumber: mobileText,
        stationId,
        stationName,
      };
    })
    .sort((a: StationRoute, b: StationRoute) => {
      return Number(a.stationNumber[0]) - Number(b.stationNumber[0]);
    });
  return result;
};

export const mapStationName = (data: StationRoute[]) => {
  const result = data.reduce(
    (acc: any, { stationId, stationNumber, stationName }: any) => {
      if (!acc[stationName]) {
        acc[stationName] = {
          stationNumber: [stationNumber],
          stationId,
        };
      } else {
        acc[stationName] = {
          stationNumber: [...acc[stationName].stationNumber, stationNumber],
          stationId: Math.max(acc[stationName].stationId, stationId),
        };
      }
      return acc;
    },
    {}
  );
  return result;
};

export const filterPassingBuses = (
  data: PassingBusesResponse | PassingBusesData | []
): {
  routeName: string;
  routeTypeCd: string;
  districtCd: string;
  regionName: string;
}[] => {
  // 데이터의 경우 3가지를 다 받아야함 복수라면 [].length 가 있고
  // 단일 데이터이면 PassingBusesData 와 같고고
  // 데이터가 없다면 [] 배열을 반환해서 data를 찍으면 undefined

  if (Array.isArray(data)) {
    return data.map((item) => ({
      routeName: item.routeName._text.trim(),
      routeTypeCd: item.routeTypeCd._text.trim(),
      districtCd: item.districtCd._text.trim(), //관할지역 1 서울 2 경기 3 인천
      regionName: item.regionName._text.trim(),
    }));
  }

  if (data && typeof data === "object") {
    return [
      {
        routeName: data.routeName._text.trim(),
        routeTypeCd: data.routeTypeCd._text.trim(),
        districtCd: data.districtCd._text.trim(),
        regionName: data.regionName._text.trim(),
      },
    ];
  }

  // 빈 배열인 경우
  return [];
};

export const mapStaionId = (
  data: filteredPassingBuses[],
  stationId: number
) => {
  const result = data.reduce((acc: any, item: any) => {
    if (acc[stationId]) {
      acc[stationId].push(item);
    } else {
      acc[stationId] = [item];
    }

    return acc;
  }, {});

  return result;
};
