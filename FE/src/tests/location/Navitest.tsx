import React, { useEffect, useState } from "react";

import { weddingAddress, x, y } from "./../daum/data";

interface CurrentPosition {
  lat: number | null;
  lon: number | null;
}

const Navitest: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<CurrentPosition>({
    lat: null,
    lon: null,
  });

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lon: position.coords.longitude,
          lat: position.coords.latitude,
        });
      },
      (err) => {
        console.error("위치 정보를 가져오는 데 실패했습니다.", err);
      }
    );
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const openKakaoMap = (currentPosition: CurrentPosition) => {
    const timeout = setTimeout(() => {
      window.location.href = webFallbackUrl;
    }, 3000);

    window.location.href = `kakaomap://route?sp=${currentPosition.lat?.toString()},${currentPosition.lon?.toString()}&ep=${x},${y}&by=CAR`;

    window.onblur = () => clearTimeout(timeout);
  };

  const address: string = weddingAddress;
  const naverMapUrl: string = `nmap://route/car?dname=${address}&dlat=${x}&dlng=${y}&slng=${currentPosition.lon}&slat=${currentPosition.lat}`;
  const tmapUrl: string = `tmap://search?name=${address}`;

  const webFallbackUrl: string = `https://map.naver.com/v5/search/${address}`;

  const openNaverMap = (): void => {
    const timeout = setTimeout(() => {
      window.location.href = webFallbackUrl;
    }, 3000);

    window.location.href = naverMapUrl;
    window.onblur = () => clearTimeout(timeout);
  };

  const openTmap = () => {
    const timeout = setTimeout(() => {
      window.location.href = webFallbackUrl;
    }, 3000);
    window.location.href = tmapUrl;
    window.onblur = () => clearTimeout(timeout);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button style={{ marginBottom: "3rem" }} onClick={openNaverMap}>
        네이버지도
      </button>
      <button style={{ marginBottom: "3rem" }} onClick={openTmap}>
        티맵
      </button>
      <button
        style={{ marginBottom: "3rem" }}
        onClick={() => openKakaoMap(currentPosition)}
      >
        {" "}
        카카오네비
      </button>
    </div>
  );
};

export default Navitest;
