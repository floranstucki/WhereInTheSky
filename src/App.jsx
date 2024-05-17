import { useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Airport from "./components/Airport";
import Favorite from "./components/Favorites";
import Airplane from "./components/Airplane";
import AllState from "./components/AllState";
function App() {
  return (
    <>
      <Link to="/">
        <button>Home Page</button>
      </Link>
      <Link to="/airports">
        <button>Airports</button>
      </Link>
      <Link to="/favorites">
        <button>Favorites</button>
      </Link>

      <Routes>
        <Route path="/" element={<AllState />} />
        <Route
          path="/airports"
          element={<Airport />}
        />
        <Route path="/favorites" element={<Favorite />} />
      </Routes>
    </>
  );
}

export default App;
