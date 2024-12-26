import { GeoProps } from "../apis/api/location/kakaoMap/types";
import { weddingAddress } from "../tests/daum/data";

const address: string = weddingAddress;
const webFallbackUrl: string = `https://map.naver.com/v5/search/${address}`;

const openTmap = () => {
  const timeout = setTimeout(() => {
    window.location.href = webFallbackUrl;
  }, 3000);
  window.location.href = `tmap://search?name=${address}`;
  window.onblur = () => clearTimeout(timeout);
};

const openNaverMap = (currentGeoState: GeoProps, geoState: GeoProps): void => {
  const timeout = setTimeout(() => {
    window.location.href = webFallbackUrl;
  }, 3000);

  window.location.href = `nmap://route/car?dname=${address}&dlat=${geoState.lat}&dlng=${geoState.lng}&slng=${currentGeoState.lng}&slat=${currentGeoState.lat}`;
  window.onblur = () => clearTimeout(timeout);
};

const openKakaoMap = (currentGeoState: GeoProps, geoState: GeoProps): void => {
  const timeout = setTimeout(() => {
    window.location.href = webFallbackUrl;
  }, 3000);

  window.location.href = `kakaomap://route?sp=${currentGeoState.lat?.toString()},${currentGeoState.lng?.toString()}&ep=${
    geoState.lat
  },${geoState.lng}&by=CAR`;

  window.onblur = () => clearTimeout(timeout);
};

const openApp = {
  openTmap,
  openNaverMap,
  openKakaoMap,
};
export default openApp;
