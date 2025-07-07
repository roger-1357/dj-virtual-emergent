import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;