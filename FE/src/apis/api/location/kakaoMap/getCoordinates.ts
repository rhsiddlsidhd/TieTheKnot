import kakaoMap from "../../../utils/instanceOfKakao";
import { GeoProps } from "./types";

export const getCoordinates = async (address: string) => {
  try {
    let addressQuery = address;
    const res = await kakaoMap.get(`/search/address?query=${addressQuery}`);

    if (res.status !== 200) {
      throw new Error("좌표 받아오기 응답 실패");
    }

    return res.data.documents[0];
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("에러", e.message);
    }
  }
};

export const getCurrentCoordinates = (): Promise<GeoProps> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      },
      (err) => {
        console.error("위치 정보를 가져오는 데 실패했습니다.", err);
        reject(err);
      }
    );
  });
};
