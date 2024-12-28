import { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import styled from "styled-components";
import kakaoMap from "../../apis/utils/instanceOfKakao";

interface GeoProps {
  lng: null | number;
  lat: null | number;
}

const Test = () => {
  const [address, setAddress] = useState("");
  const [geoState, setGeoState] = useState<GeoProps>({
    lng: null,
    lat: null,
  });

  const open = useDaumPostcodePopup(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setAddress(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const getCoordinatesFromAddress = async (address: string) => {
    try {
      if (address === "") {
        throw new Error("address value : null");
      }
      let addressQuery = address;

      const res = await kakaoMap.get(`/search/address?query=${addressQuery}`);

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

  return (
    <Container>
      <Wrapper>
        <button type="button" onClick={handleClick}>
          Open
        </button>
        <Map
          center={{
            lat: geoState.lat || 37.7156659940161,
            lng: geoState.lng || 127.198457552105,
          }}
          style={{ width: "70%", height: "50%" }}
          level={4}
        >
          <MapMarker
            position={{
              lat: geoState.lat || 37.7156659940161,
              lng: geoState.lng || 127.198457552105,
            }}
          >
            <div style={{ color: "#000" }}>Common</div>
          </MapMarker>
        </Map>
        <button onClick={() => getCoordinatesFromAddress(address)}>
          클릭릭
        </button>
      </Wrapper>
      <div>주소: {address}</div>

      <div>
        초기좌표 : {geoState.lat}, {geoState.lng}{" "}
      </div>
    </Container>
  );
};

export default Test;

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  & > button {
    height: fit-content;
  }
`;
