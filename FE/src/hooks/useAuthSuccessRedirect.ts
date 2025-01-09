import React, { useContext, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { AuthContextAPI } from "../context/AuthContext";
import { getGoogleOAuth } from "../apis/api/auth/google/getGoogleOAuth";
import { AuthCuntomError } from "../apis/utils/instanceOfAuth";

const useAuthSuccessRedirect = () => {
  const navigate = useNavigate();
  /**
   * 마운트시 동기 함수가 비동기 함수보다 먼저 실행되기 때문에
   * 경로이동을 먼저 하고 난 이후에 인증이 이뤄지는 현상
   *  */

  const value = useContext(AuthContextAPI);
  const { isAuth = false, setIsAuth = () => {} } = value || {};

  useEffect(() => {
    const fetchUser = async (
      setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      try {
        const { message } = await getGoogleOAuth();
        if (message === "LOGIN_SUCCESS") {
          setIsAuth(true);
        }
      } catch (error) {
        setIsAuth(false);

        if (error instanceof AuthCuntomError) {
          console.error(`AuthCustomError status: ${error.status}`);
          console.error(`AuthCustomError message: ${error.message}`);
          console.error(`AuthCustomError name: ${error.name}`);
        } else if (error instanceof Error) {
          console.error(`Error message:${error.message}`);
        } else {
          console.error(`Unknown ${error}`);
        }
      }
    };
    if (!isAuth && setIsAuth) {
      fetchUser(setIsAuth);
    }
  }, [isAuth, setIsAuth]);

  useEffect(() => {
    const path = "/register";
    if (isAuth && window.location.pathname !== path) {
      navigate(path);
    }
  }, [isAuth, navigate]);
};

export default useAuthSuccessRedirect;
