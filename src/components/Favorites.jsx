import React, { useState, useEffect } from 'react';
import data from "../assets/codes.json";
import 'bootstrap/dist/css/bootstrap.min.css';

const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;

const startDay = new Date(year, month - 1, day, 0, 0);
const endDay = new Date(year, month - 1, day, 23, 59);

const startTimestamp = Math.floor(startDay.getTime() / 1000);
const endTimestamp = Math.floor(endDay.getTime() / 1000);

const getFlightsFromFavorites = (icao, start, end) => {
    const url = `https://opensky-network.org/api/flights/departure?airport=${icao}&begin=${start}&end=${end}`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));
}

const getFavorites = () => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
        return JSON.parse(favorites);
    }
    return [];
}

const Favorite = () => {
    const [flights, setFlights] = useState([]);
    const [favorites, setFavorites] = useState(getFavorites());
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);

    useEffect(() => {
        const fetchFlights = async () => {
            const flightsData = await Promise.all(
                favorites.map(favorite => {
                    const airport = data.find(airport => airport.name === favorite);
                    if (airport) {
                        return getFlightsFromFavorites(airport.ident, startTimestamp, endTimestamp);
                    }
                    return [];
                })
            );
            setFlights(flightsData);
        };

        fetchFlights();
    }, [favorites]);

    const removeFavorite = (favorite) => {
        const updatedFavorites = favorites.filter(fav => fav !== favorite);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setShowDeleteMessage(true);
        setTimeout(() => setShowDeleteMessage(false), 3000); // Hide after 3 seconds
    }

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

            <ul>
                {favorites.map((favorite, index) => (
                    <li key={index}>
                        <h3>{favorite}</h3>
                        <button onClick={() => removeFavorite(favorite)}>
                            Delete from favorites
                        </button>
                        <ul>
                            {flights[index] && flights[index].length > 0 ? (
                                flights[index].map((flight, flightIndex) => (
                                    <li key={flightIndex}>
                                        Flight {flight.callsign} from {getAirportNameByCode(flight.estDepartureAirport)} to {getAirportNameByCode(flight.estArrivalAirport)}
                                    </li>
                                ))
                            ) : (
                                <li>No flights found for today</li>
                            )}
                        </ul>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Favorite;
