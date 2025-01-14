import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContextAPI } from "../context/AuthContext";
import { getGoogleOAuth } from "../apis/api/auth/google/getGoogleOAuth";
import { AuthCuntomError } from "../apis/utils/instanceOfAuth";

const useAuthFailRedirect = (): { isAuth: boolean } => {
  const navigate = useNavigate();
  const value = useContext(AuthContextAPI);

  const { isAuth, setIsAuth } = value || { isAuth: false };

  const fetchUser = async (
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!setIsAuth) return;
    try {
      const { message } = await getGoogleOAuth();

      if (message === "LOGIN_SUCCESS") {
        console.log(message);
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

  const checkAuth = useCallback(() => {
    const path: string = "/";

    if (!isAuth && window.location.pathname !== path) {
      navigate(path);
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (isAuth && setIsAuth) {
      fetchUser(setIsAuth);
    }
  }, [isAuth, setIsAuth]);

  useEffect(() => {
    checkAuth();
  }, [isAuth, checkAuth]);

  return { isAuth };
};

export default useAuthFailRedirect;
