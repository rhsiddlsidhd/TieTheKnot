import React, { createContext, PropsWithChildren, useState } from "react";
import { Outlet } from "react-router";

export interface AuthContextValue {
  isAuth: boolean;
  setIsAuth?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContextAPI = createContext<AuthContextValue | null>(null);

const AuthContext = ({ children }: PropsWithChildren) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <AuthContextAPI.Provider value={{ isAuth, setIsAuth }}>
      {children}
      <Outlet />
    </AuthContextAPI.Provider>
  );
};

export default AuthContext;
