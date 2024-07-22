import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdDesc from "./pages/AdDesc";

function App() {

  return (
      <Routes>
        <Route path="/login" exact element={<Login/>}/>
        <Route path="/" exact element={<AdDesc />} />
      </Routes>
  );
}

export default App;
