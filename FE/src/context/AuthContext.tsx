import React, { createContext, PropsWithChildren, useState } from "react";

export interface AuthContextValue {
  isAuth: boolean;
  setIsAuth?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContextAPI = createContext<AuthContextValue | undefined>(
  undefined
);

const AuthContext = ({ children }: PropsWithChildren) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <AuthContextAPI.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContextAPI.Provider>
  );
};

export default AuthContext;
