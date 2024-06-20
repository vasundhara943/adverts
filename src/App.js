import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdDesc from "./pages/AdDesc";
import AdType from "./components/AdType";
import Schedule from "./components/Schedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" exact element={<Login />} />
        <Route path="/describe_ad" exact element={<AdDesc />} />
        <Route path="/login" exact element={<Login />} />
        {/* <Route path="/adtype" exact element={<AdType/>} />
        <Route path="/schedule" exact element={<Schedule/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
