import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import DJApp from "./components/DJApp";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dj" element={<DJApp />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;