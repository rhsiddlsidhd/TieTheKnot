import axios from "axios";

export class AuthCuntomError extends Error {
  status: number;
  constructor(status: number, message: string, name: string) {
    super(message);
    this.status = status;
    this.name = name;
  }
}

const authInstance = axios.create({
  baseURL: `http://localhost:8080/`,
  withCredentials: true,
});

// 요청 인터셉터 추가하기
authInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.response) {
      const status = Number(error.response.status);
      const message = error.response.data.message;
      const newError = new AuthCuntomError(status, message, "server");
      return Promise.reject(newError);
    }
    console.log("intercepotor request", error);
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      const status = Number(error.response.status);

      const message = error.response.data.message;
      const newError = new AuthCuntomError(status, message, "server");

      return Promise.reject(newError);
    }
    console.log("intercepotor response", error);

    return Promise.reject(error);
  }
);

export default authInstance;
