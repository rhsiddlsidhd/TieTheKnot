import React, { PropsWithChildren, useState } from "react";
import { Outlet } from "react-router";
import { OrderFormData } from "../pages/Order";

export interface WeddingDataValue {
  weddingData: OrderFormData | null;
  setWeddingData: (data: OrderFormData) => void;
}

export const WeddingDataAPI = React.createContext<WeddingDataValue>({
  weddingData: null,
  setWeddingData: () => {},
});

const UserOrderDataContext = ({ children }: PropsWithChildren) => {
  const [weddingData, setWeddingData] = useState<OrderFormData | null>(null);

  return (
    <WeddingDataAPI.Provider value={{ weddingData, setWeddingData }}>
      {children}
      <Outlet />
    </WeddingDataAPI.Provider>
  );
};

export default UserOrderDataContext;
