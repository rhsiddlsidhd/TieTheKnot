import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GeoProps } from "../../apis/api/location/kakaoMap/types";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import {
  getCoordinates,
  getCurrentCoordinates,
} from "../../apis/api/location/kakaoMap/getCoordinates";
import { weddingAddress } from "../../tests/daum/data";
import { BtnWrapper } from "../../pages/Main";
import NaviSections from "./NaviSections";

const MapSections = () => {
  const [loading] = useKakaoLoader({
    appkey: `${process.env.REACT_APP_KAKAO_MAP_API_KEY}`,
  });

  const [currentGeoState, setCurrentGeoState] = useState<GeoProps>({
    lng: null,
    lat: null,
  });
  const [geoState, setGeoState] = useState<GeoProps>({
    lng: null,
    lat: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentCoordinates();
        if (data) {
          setCurrentGeoState(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoordinates(weddingAddress);
        if (data) {
          setGeoState({
            lng: Number(data.x),
            lat: Number(data.y),
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <MapSection>
        {loading ? (
          <div>지도 로딩중</div>
        ) : (
          <Map
            center={{
              lat: geoState.lat || 37.7156659940161,
              lng: geoState.lng || 127.198457552105,
            }}
            style={{ width: "100%", minHeight: "30vh", marginBottom: "3rem" }}
            level={3}
          >
            <MapMarker
              position={{
                lat: geoState.lat || 37.7156659940161,
                lng: geoState.lng || 127.198457552105,
              }}
            ></MapMarker>
          </Map>
        )}
        <BtnWrapper>
          <button>약도 이미지 보기</button>
        </BtnWrapper>
      </MapSection>
      <NaviSections currentGeoState={currentGeoState} geoState={geoState} />
    </>
  );
};

export default MapSections;

const MapSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border-bottom: 1px solid #eeeeee; */
  padding-bottom: 1rem;
`;
