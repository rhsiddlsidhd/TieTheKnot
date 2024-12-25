import axios from "axios";
import { xml2json } from "xml-js";

const businstance = axios.create({
  baseURL: `http://apis.data.go.kr/6410000/busstationservice/`,
});

// 요청 인터셉터 추가하기
businstance.interceptors.request.use(
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
businstance.interceptors.response.use(
  function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행

    if (response.headers["content-type"].includes("xml")) {
      const data = JSON.parse(
        xml2json(response.data, { compact: true, spaces: 4 })
      );

      if (data.response) {
        response.data = {
          status: "success",
          data: data.response.msgBody.busStationAroundList
            ? data.response.msgBody.busStationAroundList
            : data.response.msgBody.busRouteList,
        };
      } else {
        response.data = {
          status: data.OpenAPI_ServiceResponse.cmmMsgHeader.errMsg._text,
          error: {
            status:
              data.OpenAPI_ServiceResponse.cmmMsgHeader.returnReasonCode._text,
            message:
              data.OpenAPI_ServiceResponse.cmmMsgHeader.returnAuthMsg._text,
          },
        };
      }
    }

    return response;
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

export default businstance;
