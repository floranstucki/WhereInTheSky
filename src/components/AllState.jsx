import React, { useState } from "react";
import data from "../assets/codes.json";

const AllState = (props) => {
  function AllStates() {
    /*fetch("https://opensky-network.org/api/states/all")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.states);
        for (let i = 0; i < 1; i++) {
          console.log(data.states[i]);
          //const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${longitude},${latitude},9/300x300?access_token=pk.eyJ1Ijoic25vaHl5IiwiYSI6ImNsaHp6b2F1eTFqN3MzZW50Nm03MHg1NzcifQ.nvh83n-eg-ph6ak7QjCWxg`;
          const p = document.createElement("p");
          p.textContent = data.states[i][5] + " " + data.states[i][6];
          document.body.appendChild(p);
        }
      });*/
      console.log(data);
    
  }
  return (
    <>
      <h1>Welcome to Where in the sky</h1>

      {AllStates()}
    </>
  );
};
export default AllState;
