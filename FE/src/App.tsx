import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Main";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Tset from "./tests/gallery/Test";
import { createContext, useState } from "react";
import AuthContext from "./context/AuthContext";

type Item = {
  quantity: number;
  gridArea: string;
};

export type TypeOfSelected = {
  [id: string]: Item | undefined;
};

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const login = () => setIsAuth(true);
  const logout = () => setIsAuth(false);

  return (
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/test" element={<Tset />} />
          <Route path="/deploy" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </AuthContext>
  );
}

export default App;
