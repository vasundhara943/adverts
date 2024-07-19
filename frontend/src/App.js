import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdDesc from "./pages/AdDesc";
import useToken from "./components/useToken";

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/describe_ad" exact element={<AdDesc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
