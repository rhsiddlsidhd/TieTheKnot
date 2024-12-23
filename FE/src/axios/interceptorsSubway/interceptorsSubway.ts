import axios, { AxiosResponse } from "axios";
import { xml2json } from "xml-js";

const TYPE = "json";
const SERVICE = "SearchSTNBySubwayLineInfo";

/**
 * 공공데이터 XML  = > JSON 변환 하여 Error 핸들링 필요
 * npm install xml2json
 */

const subwayLineInstance = axios.create({
  baseURL: `http://openapi.seoul.go.kr:8088/${process.env.REACT_APP_SUBWAY_API_KEY}/${TYPE}/${SERVICE}/`,
});

// const subwayLineInstance = axios.create({
//   baseURL: `http://openapi.seoul.go.kr:8088/zzz/${TYPE}/${SERVICE}/`,
// });

// 요청 인터셉터 추가하기
subwayLineInstance.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행

    console.log("request", config);

    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행

    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가하기
subwayLineInstance.interceptors.response.use(
  function (response): AxiosResponse {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행

    if (!response.headers["content-type"].includes("json")) {
      const error = JSON.parse(
        xml2json(response.data, { compact: true, spaces: 4 })
      );
      response.statusText = error.RESULT.CODE._text;
      response.data = error.RESULT;

      return response;
    } else {
      return response;
    }
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    // console.log("Response Error:", Promise.reject(error));
    return Promise.reject(error);
  }
);

export default subwayLineInstance;
