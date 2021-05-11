import { React, useEffect, useContext } from "react";

import ReactDependentScript from "react-dependent-script";
import MapGuesserLeaflet from "./MapGuesserLeaflet";
import MapGuesser from "./MapGuesser";
import Map from "./Map";
import { GameContext } from "../../providers/GameProvider";

export default function MapWrapper(props) {
  const { googleApiKey } = useContext(GameContext);

  return (
    <ReactDependentScript
      scripts={[`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`]}
    >
      <Map
        center={{ lat: parseFloat(props.lat), lng: parseFloat(props.lon) }}
        zoom={3}
        style={{ width: "100%", height: "100%" }}
      />
      {/*Location Guess Map*/}
      <div
        style={{
          zIndex: "2",
          width: "400px",
          height: "300px",
          position: "absolute",
          bottom: "15px",
          right: "15px",
        }}
      >
        {/*
                    OSM version. I'm still using the Google Map because on OSM cities name are on native alphabet, so Japan, India and other countries are basically unreadable to foreigners.
                
                    
                <MapGuesserLeaflet />
                
                */}
        <MapGuesser />
      </div>
    </ReactDependentScript>
  );
}
