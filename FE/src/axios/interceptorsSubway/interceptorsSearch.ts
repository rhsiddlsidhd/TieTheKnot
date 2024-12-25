import axios from "axios";
import { xml2json } from "xml-js";
import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
const TYPE = "json";
const SERVICE = "SearchInfoBySubwayNameService";

const searchInstance = axios.create({
  baseURL: `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SUBWAY_API_KEY}/${TYPE}/${SERVICE}/`,
});

interface ErrorJSON {
  RESULT: {
    CODE: {
      _text: string;
    };

    MESSAGE: {
      _cdata: string;
    };
  };
}

// 요청 인터셉터 추가하기
searchInstance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // 요청이 전달되기 전에 작업 수행
    const { method, url } = config;
    isDev(`[API] | REQUEST | ${method?.toUpperCase()} | ${url} `);
    return config;
  },
  function (error: AxiosError): Promise<AxiosError> {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가하기
searchInstance.interceptors.response.use(
  function (response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    if (!response.headers["content-type"].includes("json")) {
      const errorJSON = JSON.parse(
        xml2json(response.data, { compact: true, spaces: 4 })
      );
      const { status, code, message } = onErrorResponse(errorJSON);

      if (status !== 200) {
        return Promise.reject(new Error(`Code: ${code} \nMessage: ${message}`));
      }
    }
    return response;
  },
  function (error: AxiosError): Promise<AxiosError> {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);

const isDev = (message: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
};

const onErrorResponse = (errorJSON: ErrorJSON) => {
  const { CODE, MESSAGE } = errorJSON.RESULT;
  return {
    status: Number(CODE._text.slice(CODE._text.indexOf("-") + 1)),
    code: CODE._text,
    message: MESSAGE._cdata,
  };
};

export default searchInstance;
