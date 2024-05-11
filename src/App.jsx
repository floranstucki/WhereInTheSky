import { useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Airport from "./components/Airport";
import Flight from "./components/Flight";
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
      <Link to="/flights">
        <button>Flights</button>
      </Link>
      <Link to="/airplanes">
        <button>Airplanes</button>
      </Link>

      <Routes>
        <Route path="/" element={<AllState />} />
        <Route
          path="/airports"
          element={<Airport premier="1517227831" dernier="1517230737" />}
        />
        <Route path="/flights" element={<Flight />} />
        <Route path="/airplanes" element={<Airplane />} />
      </Routes>
    </>
  );
}

export default App;
