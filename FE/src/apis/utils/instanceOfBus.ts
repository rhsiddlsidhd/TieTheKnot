import axios from "axios";
import { xml2json } from "xml-js";

interface OpenAPI_ServiceResponse {
  cmmMsgHeader: CmmMsgHeader;
}

interface ResponseData {
  response: { comMsgHeader: {}; msgHeader: MsgHeader; msgBody?: {} };
  _declaration: {};
}
interface MsgHeader {
  queryTime: Text;
  resultCode: Text;
  resultMessage: Text;
}

interface CmmMsgHeader {
  errMsg: Text;
  returnAuthMsg: Text;
  returnReasonCode: Text;
}

interface Text {
  _text: string;
}

export class CustomError extends Error {
  code: string;
  message: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

// 경기도_정류소 조회

const bus = axios.create({
  baseURL: `http://apis.data.go.kr/6410000/busstationservice/`,
});

// 요청 인터셉터 추가하기
bus.interceptors.request.use(
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
bus.interceptors.response.use(
  function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    // console.log("res", response);
    if (response.headers["content-type"].includes("xml")) {
      const data = JSON.parse(
        xml2json(response.data, { compact: true, spaces: 4 })
      );

      response.data = data;
      const isError = handleError(data);

      if (!isError) {
        return response;
      } else {
        return Promise.reject(isError);
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

export default bus;

const handleError = (data: ResponseData | OpenAPI_ServiceResponse) => {
  try {
    let isState = true;
    if ("OpenAPI_ServiceResponse" in data) {
      const openAPI_ServiceResponse =
        data.OpenAPI_ServiceResponse as OpenAPI_ServiceResponse;
      const { returnReasonCode, returnAuthMsg } =
        openAPI_ServiceResponse.cmmMsgHeader;
      throw new CustomError(returnReasonCode._text, returnAuthMsg._text);
    } else {
      if ("response" in data) {
        const responseData = data as ResponseData;
        const { resultCode, resultMessage } = responseData.response.msgHeader;
        let type = resultCode._text;
        switch (type) {
          case "0":
          case "4":
            isState = false;
            break;
          default:
            isState = true;
            throw new CustomError(resultCode._text, resultMessage._text);
        }
      }
    }
    return isState;
  } catch (e: unknown) {
    if (e instanceof CustomError) {
      throw e;
    }
    return true;
  }
};
