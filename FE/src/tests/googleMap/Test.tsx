import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";

const Test = () => {
  /**
   * 구글 지도 데이터에 원하는 장소의 Location 와 관련된 데이터가 없음
   * KAKAO Map을 이용하기로 함
   * Free
   * 월간 쿼터
   * 전체 API: 300,000,000건
   * 일일 쿼터
   * 지도 SDK(JavaScript): 300,000건
   * 주소를 좌표로 변환하기: 100,000건
   *
   * 요금적인 부분에서 무료의 사용과 개발 문서의 편리함으로 인함
   *
   * dev
   * 1.지도 위에 장소의 좌표
   * 유저에게 웨딩 주소를 받는다. => 입력: 다음 주소 API
   * 좌표를 바탕으로 marker 이동
   *
   * 2.장소ID를 URL쿼리로 카카오 지도 && 네이버 지도로 넘겨주기 Link
   * 3.카카오 pay 결제 QR코드로 은행명, 계좌번호, 결제페이지(Deep link)를 제공
   *
   */

  /**
   * 다음 주소 API
   */

  return (
    <Container>
      <Map
        center={{ lat: 33.450701, lng: 126.570667 }}
        style={{ width: "50%", height: "50%" }}
        level={3}
      />
    </Container>
  );
};

export default Test;

const Container = styled.div`
  width: 100%;
  height: 500px; // 명확한 높이 설정
  display: flex;
  justify-content: center;
  align-items: center;
`;
