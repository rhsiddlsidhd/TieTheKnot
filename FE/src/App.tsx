import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Main";

import Register from "./pages/Register";
import Tset from "./tests/calendar/Test";

type Item = {
  quantity: number;
  gridArea: string;
};

export type TypeOfSelected = {
  [id: string]: Item | undefined;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/test" element={<Tset />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
