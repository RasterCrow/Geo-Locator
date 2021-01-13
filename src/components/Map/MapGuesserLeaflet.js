import React, { useState, useContext } from "react";
import { useMapEvents, MapContainer, TileLayer, Marker } from "react-leaflet";

import { GameContext } from "../../providers/GameProvider";

const Markers = () => {
  const { setLocationGuessed } = useContext(GameContext);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const map = useMapEvents({
    click(e) {
      console.log(e.latlng);
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
      //setLocationGuessed(position.lat, position.lng);
    },
  });

  return lat ? (
    <Marker key={lat} position={[lat, lng]} interactive={false} />
  ) : null;
};

export default function MapGuesserLeaflet(props) {
  // Marker selection setup

  return (
    <MapContainer
      style={{ width: "100%", height: "100%" }}
      center={[0, 0]}
      zoom={1}
    >
      <Markers />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></TileLayer>
    </MapContainer>
  );
}
