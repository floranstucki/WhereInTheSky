import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Airport from "./components/Airport";
import Favorite from "./components/Favorites";
import AirportOfTheDay from "./components/AirportOfTheDay";
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
        <Route path="/" element={<AirportOfTheDay />} />
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
