import axios from "axios";
import { xml2json } from "xml-js";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

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

const subway = axios.create({
  baseURL: `${process.env.REACT_APP_SUBWAY_BASE_URL}/${process.env.REACT_APP_SUBWAY_API_KEY}/json/SearchInfoBySubwayNameService/`,
});

subway.interceptors.request.use(
  function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const { method, url } = config;
    isDev(`[API] | REQUEST | ${method?.toUpperCase()} | ${url} `);
    return config;
  },
  function (error: AxiosError): Promise<AxiosError> {
    return Promise.reject(error);
  }
);

subway.interceptors.response.use(
  function (response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
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

export default subway;
