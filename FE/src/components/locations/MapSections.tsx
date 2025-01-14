import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { GeoProps } from "../../apis/api/location/kakaoMap/types";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import {
  getCoordinates,
  getCurrentCoordinates,
} from "../../apis/api/location/kakaoMap/getCoordinates";
import { BtnWrapper } from "../../pages/Main";
import { WeddingDataAPI } from "../../context/UserOrderDataContext";
interface MapSectionsProps {
  currentGeoState: GeoProps;
  geoState: GeoProps;
  setCurrentGeoState: React.Dispatch<React.SetStateAction<GeoProps>>;
  setGeoState: React.Dispatch<React.SetStateAction<GeoProps>>;
}

const MapSections = ({
  geoState,
  setCurrentGeoState,
  setGeoState,
}: MapSectionsProps) => {
  const value = useContext(WeddingDataAPI);

  const { weddingData } = value;
  const [loading] = useKakaoLoader({
    appkey: `${process.env.REACT_APP_KAKAO_MAP_API_KEY}`,
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
  }, [setCurrentGeoState]);

  useEffect(() => {
    const fetchData = async (address: string) => {
      try {
        if (address) {
          const data = await getCoordinates(address);
          if (data) {
            setGeoState({
              lng: Number(data.x),
              lat: Number(data.y),
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData(weddingData ? weddingData.weddingAddress : "");
  }, [setGeoState, weddingData]);

  if (!weddingData) {
    return <div>로딩중</div>;
  }

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
    </>
  );
};

export default MapSections;

const MapSection = styled.div`
  margin-top: 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-bottom: 1rem;
`;
