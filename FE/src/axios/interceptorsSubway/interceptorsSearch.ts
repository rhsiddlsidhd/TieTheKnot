import axios from "axios";
const TYPE = "json";
const SERVICE = "SearchInfoBySubwayNameService";

const searchInstance = axios.create({
  baseURL: `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SUBWAY_API_KEY}/${TYPE}/${SERVICE}/`,
});

// http://openAPI.seoul.go.kr:8088/(인증키)/xml/SearchInfoBySubwayNameService/1/5/종로3가/

// 요청 인터셉터 추가하기
searchInstance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행
    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가하기
searchInstance.interceptors.response.use(
  function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

export default searchInstance;
