import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContextAPI } from "../context/AuthContext";
import { getGoogleOAuth } from "../apis/api/auth/google/getGoogleOAuth";
import { AuthCuntomError } from "../apis/utils/instanceOfAuth";

const useAuthFailRedirect = (): { isAuth: boolean } => {
  const navigate = useNavigate();
  const value = useContext(AuthContextAPI);
  const { isAuth = false, setIsAuth = () => {} } = value || {};

  useEffect(() => {
    const fetchUser = async (
      setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
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
    if (isAuth && setIsAuth) {
      fetchUser(setIsAuth);
    }
  }, [isAuth, setIsAuth]);

  useEffect(() => {
    const checkAuth = async () => {
      const path = "/";

      if (!isAuth && window.location.pathname !== path) {
        console.log("엥?");
        await navigate(path);
      }
    };
    checkAuth();
  }, [isAuth, navigate]);
  return { isAuth };
};

export default useAuthFailRedirect;
