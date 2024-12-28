import React, { useEffect, useState } from "react";
import { x, y } from "../daum/data";
import bus from "../../apis/utils/instanceOfBus";

const Test = () => {
  /**
   * 좌표에서 가장 가까운 상위 정류장 4개
   * 정류소아이디 stationId , 정류소명 stationName,  정류소번호 mobileNo
   * 정류소 경유 노선 목록 조회 API
   * 노선유형명, 노선번호
   *
   */

  interface StationData {
    centerYn: { _text: string };
    distance: { _text: string };
    districtCd: { _text: string };
    mobileNo: { _text: string };
    regionName: { _text: string };
    stationId: { _text: string };
    stationName: { _text: string };
    x: { _text: string };
    y: { _text: string };
  }

  type BusStationResponse = StationData[];

  type StationRoute = {
    stationId: number;
    stationName: string;
    stationNumber: string[];
  };

  const [busStationId, setBusStationId] = useState(new Map());
  const [busStationRoute, setBusStationRoute] = useState<number[]>();
  const [routeData, setRouteData] = useState<
    Record<number, { routeName: string; routeTypeName: string }[]>
  >({});

  const fetchBusStation = async (coordinate: { x: number; y: number }) => {
    try {
      const res = await bus.get(
        `/getBusStationAroundList?serviceKey=${process.env.REACT_APP_BUS_API_KEY}&x=${coordinate.y}&y=${coordinate.x}`
      );
      if (res.data.status !== "success") {
        throw new Error(res.data.error.message);
      }

      return res.data;
    } catch (e) {
      console.error(e);
    }
  };

  const getFilteredStationData = (data: BusStationResponse) => {
    return data
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
  };

  const onBusStationListClick = async (coordinate: {
    x: number;
    y: number;
  }) => {
    const busStationData = await fetchBusStation(coordinate);
    const filteredBusStationData = getFilteredStationData(busStationData.data);
    const processedBusStationData = processStationData(filteredBusStationData);
    const stationIds = [];
    for (const key in processedBusStationData) {
      stationIds.push(processedBusStationData[key].stationId);
    }

    setBusStationRoute(stationIds);
    setBusStationId(processedBusStationData);
  };

  const processStationData = (data: StationRoute[]) => {
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
            stationId: Math.min(acc[stationName].stationId, stationId),
          };
        }
        return acc;
      },
      {}
    );

    return result;
  };

  useEffect(() => {
    const processRouteData = async (stationId: number) => {
      const data = await fetchBusStationRoute(stationId);
      const filterdData = data.data.map((items: any) => {
        return {
          routeName: items.routeName._text.trim(),
          routeTypeName: items.routeTypeName._text.trim(),
        };
      });

      const result = filterdData.reduce((acc: any, item: any) => {
        if (acc[stationId]) {
          acc[stationId].push(item);
        } else {
          acc[stationId] = [item];
        }

        return acc;
      }, {});

      return result;
    };

    const fetchData = async () => {
      if (busStationRoute) {
        ////[222000851, 222000903]
        const allData: Record<
          number,
          { routeName: string; routeTypeName: string }[]
        > = {};

        for (const stationId of busStationRoute) {
          const filteredData = await processRouteData(stationId);
          allData[stationId] = filteredData[stationId];
        }
        setRouteData(allData);
      }
    };
    fetchData();
  }, [busStationRoute]);

  const fetchBusStationRoute = async (id: number) => {
    try {
      const res = await bus.get(
        `getBusStationViaRouteList?serviceKey=${process.env.REACT_APP_BUS_API_KEY}&stationId=${id}`
      );

      return res.data;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>x : {y}</div>
      <div>y : {x}</div>
      <button
        onClick={() => {
          onBusStationListClick({ x, y });
        }}
      >
        좌표클릭
      </button>
      {Object.entries(busStationId).map(([key, value], i) => {
        const stationRoutes = routeData[value.stationId];

        return (
          <ul style={{ marginBottom: "1rem" }} key={i}>
            <li>
              {key} 정류장 하차 (정류장 번호 : {value.stationNumber.join(", ")})
            </li>
            {stationRoutes ? (
              stationRoutes.map((route, i) => (
                <li key={i}>{route.routeName} </li>
              ))
            ) : (
              <li>데이터 없음</li>
            )}
          </ul>
        );
      })}

      <button onClick={() => fetchBusStationRoute(222000851)}>경로 클릭</button>
    </div>
  );
};

export default Test;
