import React, { useEffect, useState } from "react";
import { NaviWrapper } from "./NaviSections";
import { SectionWrapper } from "./SubwaySections";
import { GeoProps } from "../../apis/api/location/kakaoMap/types";

import {
  filterBusStation,
  filterPassingBuses,
  mapStaionId,
  mapStationName,
} from "../../apis/services/busStation";
import {
  filteredPassingBuses,
  StationRoute,
} from "../../apis/api/location/bus/types";
import {
  getNearBusStationsApi,
  getPassingBusesAtStation,
} from "../../apis/api/location/bus/getBusStationsApi";
import styled from "styled-components";
import { CustomError } from "../../apis/utils/instanceOfBus";

interface BusSectionsProps {
  geoState: GeoProps;
}

const BusSections = ({ geoState }: BusSectionsProps) => {
  const [busStation, setBusStation] = useState<{
    [key: string]: StationRoute;
  }>({});
  const [busStationIds, setBusStationsIds] = useState<number[]>([]);
  const [passingBusesByStation, setPassingBusesByStation] = useState<
    Record<number, filteredPassingBuses[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nearBusStationList = await getNearBusStationsApi(geoState);

        const filteredData = filterBusStation(
          nearBusStationList.busStationAroundList
        );

        const createDataMap = mapStationName(filteredData);

        setBusStation(createDataMap);
      } catch (e) {
        if (e instanceof CustomError) {
          console.error({
            code: e.code,
            message: e.message,
          });
        }
      }
    };
    fetchData();
  }, [geoState]);

  useEffect(() => {
    const ids = [];
    for (const key in busStation) {
      ids.push(busStation[key].stationId);
    }
    setBusStationsIds(ids);
  }, [busStation]);

  useEffect(() => {
    const fetchData = async (ids: number[]) => {
      try {
        const data: Record<number, filteredPassingBuses[]> = {};
        for (const stationId of ids) {
          const passingBusesList = await getPassingBusesAtStation(stationId);
          const filteredData = filterPassingBuses(
            passingBusesList.busRouteList
          );
          const createDataMap = mapStaionId(filteredData, stationId);

          data[stationId] = createDataMap[stationId];
        }
        setPassingBusesByStation(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData(busStationIds);
  }, [busStationIds]);

  const mapRouteTypeToColor = (type: number) => {
    let result;

    switch (type) {
      case 11:
      case 14:
      case 21:
      case 16:
        result = "#FB5852";
        break;

      case 13:
      case 15:
      case 23:
        result = "#B4DC60";
        break;
      case 12:
      case 22:
        result = "#386DE8";
        break;
      case 30:
        result = "#D0890E";
        break;

      default:
        result = "#65A6D2";
        break;
    }
    return result;
  };

  return (
    <SectionWrapper>
      <NaviWrapper>
        <h4>버스</h4>
        {Object.entries(busStation).map(([key, value], i) => {
          const buses = passingBusesByStation[value.stationId];
          return (
            <Container key={i}>
              <p>
                {key} 정류장 하차 (정류장 번호 :{" "}
                {value.stationNumber.join(", ")})
              </p>
              <BusNumberWrapper>
                {buses ? (
                  buses.map((bus, i) => {
                    const color = mapRouteTypeToColor(Number(bus.routeTypeCd));
                    return (
                      <BusList key={i}>
                        <BusImg
                          src={`${process.env.REACT_APP_IMAGE_BASE_URL}/bus.svg`}
                          alt="이미지"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        {bus.routeName}
                      </BusList>
                    );
                  })
                ) : (
                  <p>운행하는 버스가 없습니다.</p>
                )}
              </BusNumberWrapper>
            </Container>
          );
        })}
      </NaviWrapper>
    </SectionWrapper>
  );
};

export default BusSections;

const BusList = styled.p`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BusNumberWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Container = styled.div`
  & > div {
    display: flex;
    flex-wrap: wrap;
  }
`;

const BusImg = styled.img`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  margin-right: 0.125rem;
`;
