import "./App.css";

import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import RoastVault from "./pages/RoastVault";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/vault" element={<RoastVault />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;