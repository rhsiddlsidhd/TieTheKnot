import bus, { CustomError } from "../../../utils/instanceOfBus";
import { GeoProps } from "../kakaoMap/types";

//경기도 주변 정류소 조회
export const getNearBusStationsApi = async (geoState: GeoProps) => {
  try {
    const res = await bus.get(
      `/getBusStationAroundList?serviceKey=${process.env.REACT_APP_BUS_API_KEY}&x=${geoState.lng}&y=${geoState.lat}`
    );

    if (res.data.response.msgHeader.resultCode._text !== "0") {
      res.data.response.msgBody = [];
    }

    return res.data.response.msgBody;
  } catch (e) {
    if (e instanceof CustomError) {
      throw e;
    }
  }
};

//경기도 정류소 경유 노선 조회
export const getPassingBusesAtStation = async (id: number) => {
  try {
    const res = await bus.get(
      `getBusStationViaRouteList?serviceKey=${process.env.REACT_APP_BUS_API_KEY}&stationId=${id}`
    );

    if (res.data.response.msgHeader.resultCode._text !== "0") {
      res.data.response.msgBody = [];
    }

    return res.data.response.msgBody;
  } catch (e) {
    if (e instanceof CustomError) {
      throw e;
    }
  }
};
