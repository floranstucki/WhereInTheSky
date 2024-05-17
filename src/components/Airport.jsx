import React, { useState, useEffect } from "react";
import data from "../assets/codes.json";
import 'bootstrap/dist/css/bootstrap.min.css';

const Airport = () => {
  const [radioValue, setRadioValue] = useState("departure");
  const [startDate, setStartDate] = useState("2024-05-12T12:00");
  const [endDate, setEndDate] = useState("2024-05-12T13:00");
  const [selectedAirport, setSelectedAirport] = useState("");
  const [numbersFlights, setNumbersFlights] = useState(0);
  const [flightsDetails, setFlightsDetails] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showFavoritesMessage, setShowFavoritesMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    setSelectedAirport(data[0]?.name); // Select the first option by default
    handleSort("estArrivalAirport");
  }, []);

  useEffect(() => {
    if (selectedAirport) {
      getAPI();
    }
  }, [radioValue, selectedAirport, startDate, endDate]);

  const getAPI = () => {
    const start = Math.floor(new Date(startDate).getTime() / 1000);
    const end = Math.floor(new Date(endDate).getTime() / 1000);
    const airport = data.find((airport) => airport.name === selectedAirport);
    if (airport) {
      const icao = airport.ident;
      const url = `https://opensky-network.org/api/flights/${radioValue}?airport=${icao}&begin=${start}&end=${end}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setNumbersFlights(data.length);
          setFlightsDetails(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  const checkRadio = () => {
    const formatDate = (dateStr) => {
      const [datePart, timePart] = dateStr.split("T");
      const [year, month, day] = datePart.split("-");
      const [hour, minute] = timePart.split(":");
      return `${day}.${month}.${year} ${hour}:${minute}`;
    };

    return (
      <p>
        Here are all the flights that {radioValue === "departure" ? "departed from" : "arrived at"} <strong>{selectedAirport}</strong><br />
        between {formatDate(startDate)} and {formatDate(endDate)}:
      </p>
    );
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getAirportNameByCode = (code) => {
    const airport = data.find((airport) => airport.ident === code);
    return airport ? airport.name + " (" + airport.ident + ")" : "Unknown";
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const compareStrings = (a, b) => {
    if (a === null || a === undefined || a === "Unknown") return 1;
    if (b === null || b === undefined || b === "Unknown") return -1;
    return a.toLowerCase().localeCompare(b.toLowerCase());
  };

  const addFavorites = (airport) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(airport)) {
      favorites.push(airport);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setShowFavoritesMessage(true);
      setShowErrorMessage(false);
      setTimeout(() => setShowFavoritesMessage(false), 3000); // Hide after 3 seconds
    } else {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000); // Hide after 3 seconds
    }
  };

  const compareDuration = (a, b) => {
    const durationA = a.lastSeen - a.firstSeen;
    const durationB = b.lastSeen - b.firstSeen;
    if (sortConfig.direction === "asc") {
      return durationA - durationB;
    } else {
      return durationB - durationA;
    }
  };

  const sortedFlights = [...flightsDetails].sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.key === "duration") {
        return compareDuration(a, b);
      }
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "firstSeen" || sortConfig.key === "lastSeen") {
        aValue = new Date(aValue * 1000);
        bValue = new Date(bValue * 1000);
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (sortConfig.key === "estDepartureAirport" || sortConfig.key === "estArrivalAirport" || sortConfig.key === "callsign") {
        return sortConfig.direction === "asc" ? compareStrings(aValue, bValue) : compareStrings(bValue, aValue);
      }
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const options = data.map((airport) => (
    <option key={airport.ident} value={airport.name}>
      {airport.name}
    </option>
  ));

  return (
    <>
      <h1>Airports</h1>

      {showFavoritesMessage && (
        <div className="alert alert-success" role="alert">
          Airport added to favorites!
        </div>
      )}

      {showErrorMessage && (
        <div className="alert alert-danger" role="alert">
          This airport is already in favorites!
        </div>
      )}

      <input
        type="radio"
        name="airports"
        value="departures"
        checked={radioValue === "departure"}
        onChange={() => { setRadioValue("departure"); handleSort("estArrivalAirport") }}
      />{" "}
      <label htmlFor="departures">Departures</label>

      <input
        type="radio"
        name="airports"
        value="arrivals"
        checked={radioValue === "arrival"}
        onChange={() => { setRadioValue("arrival"); handleSort("estDepartureAirport") }}
      />
      <label htmlFor="arrivals">Arrivals</label>

      <br />
      <br />
      <input
        type="datetime-local"
        id="start"
        name="trip-start"
        value={startDate}
        min="1970-01-01T00:00"
        max="2024-12-31T23:59"
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="datetime-local"
        id="end"
        name="trip-end"
        value={endDate}
        min="1970-01-01T00:00"
        max="2024-12-31T23:59"
        onChange={(e) => setEndDate(e.target.value)}
      />
      <br />
      <select
        name="select"
        value={selectedAirport}
        onChange={(e) => setSelectedAirport(e.target.value)}
      >
        {options}
      </select>
      <button onClick={() => addFavorites(selectedAirport)}>Add to favorites</button>

      <p>Number of flights: {numbersFlights}</p>
      {checkRadio()}

      {sortedFlights.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("estDepartureAirport")}>Departure Airport</th>
              <th onClick={() => handleSort("estArrivalAirport")}>Arrival Airport</th>
              <th onClick={() => handleSort("firstSeen")}>Departure Time</th>
              <th onClick={() => handleSort("lastSeen")}>Arrival Time</th>
              <th onClick={() => handleSort("callsign")}>Flight Number</th>
              <th onClick={() => handleSort("duration")}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map((flight, index) => (
              <tr key={index}>
                <td>{getAirportNameByCode(flight.estDepartureAirport)}</td>
                <td>{getAirportNameByCode(flight.estArrivalAirport)}</td>
                <td>{new Date(flight.firstSeen * 1000).toLocaleString()}</td>
                <td>{new Date(flight.lastSeen * 1000).toLocaleString()}</td>
                <td>{flight.callsign}</td>
                <td>{formatDuration(flight.lastSeen - flight.firstSeen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p><strong>No flights found</strong></p>
      )}
    </>
  );
};

export default Airport;
