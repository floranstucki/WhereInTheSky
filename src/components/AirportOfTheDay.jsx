import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import datas from '../assets/codes.json';
import 'mapbox-gl/dist/mapbox-gl.css';

const getRandomAirport = (airports) => {
  const randomIndex = Math.floor(Math.random() * airports.length);
  return airports[randomIndex];
};

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AirportOfTheDay = () => {
  const [airport, setAirport] = useState(null);

  useEffect(() => {
    const handleAirportSelection = (airports) => {
      const storedAirport = localStorage.getItem('selectedAirport');
      const storedDate = localStorage.getItem('date');
      const currentDate = getCurrentDate();

      if (storedAirport && storedDate === currentDate) {
        setAirport(JSON.parse(storedAirport));
        return;
      }

      const newAirport = getRandomAirport(airports);
      setAirport(newAirport);
      localStorage.setItem('selectedAirport', JSON.stringify(newAirport));
      localStorage.setItem('date', currentDate);
    };

    handleAirportSelection(datas);
  }, []);
  useEffect(() => {
    const MAPBOX_TOKEN = 'YOUR_TOKEN';
    if (airport) {
      mapboxgl.accessToken = MAPBOX_TOKEN; 
      const coordinates = airport.coordinates.split(',').map(parseFloat);
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coordinates[1], coordinates[0]],
        zoom: 7
      });
      map.addControl(new mapboxgl.NavigationControl());
      const marker = new mapboxgl.Marker()
        .setLngLat([coordinates[1], coordinates[0]])
        .addTo(map);
  
      return () => {
        marker.remove();
        map.remove();
      };
    }
  }, [airport]);
  
  

  if (!airport) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Airport of the Day :</h1>
      <h2>{airport.name} ({airport.ident})</h2>
      <p>Airport coordinates : {airport.coordinates}</p>
      <div id="map" style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default AirportOfTheDay;
