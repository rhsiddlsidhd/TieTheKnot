import { Outlet } from "react-router";
import useAuthSuccessRedirect from "../hooks/useAuthSuccessRedirect";

const Login = () => {
  /**
   * 1. Google 소셜 로그인 (누구나)
   * 2. 주문하기 / 내 주문 보기 (로그인유저만)
   */

  useAuthSuccessRedirect();
  const handleGoogleAuth = () => {
    if (process.env.REACT_APP_GOOGLE_AUTH_LOCATION_URL) {
      window.location.href = process.env.REACT_APP_GOOGLE_AUTH_LOCATION_URL;
    }
  };

  return (
    <div>
      <button onClick={handleGoogleAuth} style={{ padding: "1rem" }}>
        google
      </button>
      <Outlet />
    </div>
  );
};

export default Login;
