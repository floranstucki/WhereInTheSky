import React, { useState, useEffect } from "react";
import data from "../assets/codes.json";

const Airport = (props) => {
  const [radioValue, setRadioValue] = useState("departures");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-08");
  const [selectedAirport, setSelectedAirport] = useState(""); // État pour stocker le nom complet de l'aéroport sélectionné

  var firstSeen = new Date(props.premier * 1000);
  var lastSeen = new Date(props.dernier * 1000);

  // Convertir les dates en millisecondes
  var firstSeenTime = firstSeen.getTime();
  var lastSeenTime = lastSeen.getTime();

  // Calculer la différence en millisecondes
  var difference = Math.abs(lastSeenTime - firstSeenTime);

  // Convertir la différence en heures et minutes
  var differenceInHours = Math.floor(difference / (1000 * 60 * 60));
  var differenceInMinutes = Math.floor((difference / (1000 * 60)) % 60);

  function checkRadio() {
    if (radioValue === "departures") {
      return (
        <p>
          Here are all the flights that departed from <strong>{selectedAirport}</strong><br/> between{" "}
          {startDate.split("-").reverse().join(".")} and{" "}
          {endDate.split("-").reverse().join(".")} :
        </p>
      );
    } else {
      return (
        <p>
          Here are all the flights that arrived at <strong>{selectedAirport}</strong><br/> between{" "}
          {startDate.split("-").reverse().join(".")} and{" "}
          {endDate.split("-").reverse().join(".")} :
        </p>
      );
    }
  }

  // Génération des options avec le nom complet de l'aéroport comme valeur
  const options = data.map((airport) => (
    <option key={airport.ident} value={airport.name}>
      {airport.name}
    </option>
  ));

  // Mise à jour de selectedAirport dès le chargement de la page
  useEffect(() => {
    setSelectedAirport(options[0].props.value); // La première option du select est sélectionnée par défaut
  }, []);

  return (
    <>
      <h1>Airports</h1>

      <input
        type="radio"
        name="airports"
        value="departures"
        checked={radioValue === "departures"}
        onChange={() => setRadioValue("departures")}
      />{" "}
      <label htmlFor="departures">Departures</label>

      <input
        type="radio"
        name="airports"
        value="arrivals"
        checked={radioValue === "arrivals"}
        onChange={() => setRadioValue("arrivals")}
      />
      <label htmlFor="arrivals">Arrivals</label>

      <br />
      <br />
      <input
        type="date"
        id="start"
        name="trip-start"
        value={startDate}
        min="1970-01-01"
        max="2024-04-01"
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        id="end"
        name="trip-end"
        value={endDate}
        min="1970-01-01"
        max="2024-04-01"
        onChange={(e) => setEndDate(e.target.value)}
      />

      <select
        name="select"
        value={selectedAirport} // Liaison de la valeur sélectionnée à l'état
        onChange={(e) => setSelectedAirport(e.target.value)} // Mise à jour de la valeur sélectionnée
      >
        {options}
      </select>
      <label htmlFor="airport">Airport :</label>
      {checkRadio()}
    </>
  );
};

export default Airport;
