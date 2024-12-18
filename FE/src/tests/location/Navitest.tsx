import React from "react";

import { weddingAddress, x, y } from "./../daum/data";

const Navitest: React.FC = () => {
  const address: string = weddingAddress;
  const naverMapUrl: string = `naver.maps://?query=${address}`;
  const tmapUrl: string = `tmap://search?name=${address}`;

  const kakaoNaviUrl = `https://map.kakao.com/link/to/${address},${x},${y}`;
  const webFallbackUrl: string = `https://map.naver.com/v5/search/${address}`;

  const openNavigation = (): void => {
    const timeout = setTimeout(() => {
      window.location.href = webFallbackUrl;
    }, 5000);

    window.location.href = naverMapUrl;
    window.location.href = tmapUrl;

    window.location.href = kakaoNaviUrl;

    window.onblur = () => clearTimeout(timeout);
  };

  return (
    <div>
      <button onClick={openNavigation}>네비게이션 열기</button>
    </div>
  );
};

export default Navitest;
