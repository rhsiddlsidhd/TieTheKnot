import styled from "styled-components";
import {
  BtnWrapper,
  SectionHeader,
  WeddingInvitationContainer,
} from "../pages/Main";
import {
  weddingAddress,
  weddingAddressDetail,
  weddingTell,
} from "../tests/daum/data";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import axiosinstance from "../axios/interceptors/interceptors";

interface GeoProps {
  lng: null | number;
  lat: null | number;
}
const Location = () => {
  /**
   * 구글 지도 데이터
   */

  const [geoState, setGeoState] = useState<GeoProps>({
    lng: null,
    lat: null,
  });

  const getCoordinatesFromAddress = async (address: string) => {
    try {
      let addressQuery = address;

      const res = await axiosinstance.get(
        `/search/address?query=${addressQuery}`
      );

      if (res.status !== 200) {
        throw new Error("좌표받아오기 응답 실패");
      }

      const data = res.data.documents[0];
      const x = data.x;
      const y = data.y;
      setGeoState((prev) => ({
        ...prev,
        lng: Number(x),
        lat: Number(y),
      }));
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("에러", e.stack);
      }
    }
  };

  useEffect(() => {
    getCoordinatesFromAddress(weddingAddress);
  }, []);

  return (
    <WeddingInvitationContainer>
      <SectionHeader>
        <p>Location</p>
        <h3>오시는 길</h3>
      </SectionHeader>
      <section>
        <div>{weddingAddressDetail}</div>
        <div>{weddingAddress}</div>
        <div>{weddingTell}</div>
      </section>
      <MapSection style={{ width: "90%" }}>
        <Map
          center={{
            lat: geoState.lat || 37.7156659940161,
            lng: geoState.lng || 127.198457552105,
          }}
          style={{ width: "100%", minHeight: "25vh", marginBottom: "3rem" }}
          level={3}
        >
          <MapMarker
            position={{
              lat: geoState.lat || 37.7156659940161,
              lng: geoState.lng || 127.198457552105,
            }}
          ></MapMarker>
        </Map>
        <BtnWrapper>{/* <button>약도 이미지 보기</button> */}</BtnWrapper>
        <NaviWrapper>
          <h3>네비게이션</h3>
          <p>원하시는 앱을 선택하시면 길 안내가 시작됩니다</p>
          <BtnWrapper
            style={{
              flexDirection: "row",
              flex: "1",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <button style={{ width: "33%" }}>1</button>
            <button style={{ width: "33%" }}>2</button>
            <button style={{ width: "33%" }}>3</button>
          </BtnWrapper>
        </NaviWrapper>
      </MapSection>
      <div>1234</div>
    </WeddingInvitationContainer>
  );
};

export default Location;

const MapSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
`;

const NaviWrapper = styled.div`
  width: 80%;
  & > h3,
  p {
    display: flex;
    margin-bottom: 1rem;
  }
`;
