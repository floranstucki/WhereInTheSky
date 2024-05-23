import React, { useState, useEffect } from "react";
import data from "../assets/codes.json";
import "bootstrap/dist/css/bootstrap.min.css";

const today = new Date();
const day = 12;
const month = today.getMonth() + 1;
const year = today.getFullYear();

const formattedDate = `${day < 10 ? "0" + day : day}.${
  month < 10 ? "0" + month : month
}.${year}`;

const startDay = new Date(year, month - 1, day, 0, 0);
const endDay = new Date(year, month - 1, day, 23, 59);

const startTimestamp = Math.floor(startDay.getTime() / 1000);
const endTimestamp = Math.floor(endDay.getTime() / 1000);

const getFlightsFromFavorites = (icao, start, end) => {
  const url = `https://opensky-network.org/api/flights/departure?airport=${icao}&begin=${start}&end=${end}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
};

const getFavorites = () => {
  const favorites = localStorage.getItem("favorites");
  if (favorites) {
    return JSON.parse(favorites);
  }
  return [];
};

const Favorite = () => {
  const [flights, setFlights] = useState([]);
  const [favorites, setFavorites] = useState(getFavorites());
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      const flightsData = await Promise.all(
        favorites.map((favorite) => {
          const airport = data.find((airport) => airport.name === favorite);
          if (airport) {
            return getFlightsFromFavorites(
              airport.ident,
              startTimestamp,
              endTimestamp
            );
          }
          return [];
        })
      );
      setFlights(flightsData);
    };

    fetchFlights();
  }, [favorites]);

  const removeFavorite = (favorite) => {
    const updatedFavorites = favorites.filter((fav) => fav !== favorite);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setShowDeleteMessage(true);
    setTimeout(() => setShowDeleteMessage(false), 3000); 
  };

  const getAirportNameByCode = (code) => {
    const airport = data.find((airport) => airport.ident === code);
    return airport ? airport.name + " (" + airport.ident + ")" : "Unknown";
  };

  return (
    <>
      <h1>Favorite Airports</h1>
      <h2>{formattedDate}</h2>

      {showDeleteMessage && (
        <div className="alert alert-success" role="alert">
          Favorite successfully deleted!
        </div>
      )}

{favorites.length === 0 ? (
        <p>No favorite airports found</p>
      ) : (
        favorites.map((favorite, index) => (
          <div key={index}>
            <h3>{favorite}</h3>
            <button onClick={() => removeFavorite(favorite)}>
              Delete from favorites
            </button>
            {flights[index] && flights[index].length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Flight</th>
                    <th>Departure Airport</th>
                    <th>Arrival Airport</th>
                    <th>Departure Time</th>
                  </tr>
                </thead>
                <tbody>
                  {flights[index]
                    .filter((flight) => {
                      const arrivalAirport = getAirportNameByCode(
                        flight.estArrivalAirport
                      );
                      return arrivalAirport !== "Unknown";
                    })
                    .sort((a, b) => {
                      const departureTimeA = new Date(a.firstSeen * 1000).getTime();
                      const departureTimeB = new Date(b.firstSeen * 1000).getTime();
                      return departureTimeA - departureTimeB;
                    })
                    .map((flight, flightIndex) => {
                      const arrivalAirport = getAirportNameByCode(
                        flight.estArrivalAirport
                      );
                      return (
                        <tr key={flightIndex}>
                          <td>{flight.callsign}</td>
                          <td>{getAirportNameByCode(flight.estDepartureAirport)}</td>
                          <td>{arrivalAirport}</td>
                          <td>{new Date(flight.firstSeen * 1000).toLocaleTimeString()}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <p>No flights found for today</p>
            )}
          </div>
        ))
      )}
    </>
  );
};

export default Favorite;