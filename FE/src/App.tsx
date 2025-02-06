import { Route, Routes } from "react-router";
import Main from "./pages/Main";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Order from "./pages/Order";
import ObserverTest from "./tests/gusetbook/ObserverTest";
import AuthContext from "./context/AuthContext";
import UserOrderDataContext from "./context/UserOrderDataContext";
import Test from "./tests/subway/Test";

type Item = {
  quantity: number;
  gridArea: string;
};

export type TypeOfSelected = {
  [id: string]: Item | undefined;
};

function App() {
  return (
    <Routes>
      <Route element={<AuthContext />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/order" element={<Order />} />
      </Route>
      <Route path="/test" element={<Test />} />
      {/* 유저 order 데이터를 전부 가져와서 전역상태로 관리 */}
      <Route element={<UserOrderDataContext />}>
        <Route path="/deploy" element={<Main />} />
      </Route>
    </Routes>
  );
}

export default App;
