import axios from "axios";
const TYPE = "json";
const SERVICE = "SearchSTNBySubwayLineInfo";

const subwayInstance = axios.create({
  baseURL: `http://openapi.seoul.go.kr:8088/${process.env.REACT_APP_SUBWAY_API_KEY}/${TYPE}/${SERVICE}/`,
});

// http://openapi.seoul.go.kr:8088/55717a4f5577697a37336445526a63/json/SearchSTNBySubwayLineInfo/1/100/ /청량리

// 요청 인터셉터 추가하기
subwayInstance.interceptors.request.use(
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
subwayInstance.interceptors.response.use(
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

export default subwayInstance;
