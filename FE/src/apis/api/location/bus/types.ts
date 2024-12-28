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

export interface PassingBusesData {
  districtCd: { _text: string };
  regionName: { _text: string };
  routeId: { _text: string };
  routeName: { _text: string };
  routeTypeCd: { _text: string };
  routeTypeName: { _text: string };
  staOrder: { _text: string };
}

export type StationRoute = {
  stationId: number;
  stationName: string;
  stationNumber: string[];
};

export type filteredPassingBuses = {
  routeName: string;
  routeTypeCd: string;
  districtCd: string;
  regionName: string;
};

export type BusStationResponse = StationData[];
export type PassingBusesResponse = PassingBusesData[];
