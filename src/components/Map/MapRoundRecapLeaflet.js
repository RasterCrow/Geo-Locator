import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

const iconCorrect = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/assets/marker_correct.svg",
  iconRetinaUrl: process.env.PUBLIC_URL + "/assets/marker_correct.svg",
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(25, 40),
  className: "marker-icon",
});

const iconUserGuess = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/assets/marker_user.svg",
  iconRetinaUrl: process.env.PUBLIC_URL + "/assets/marker_user.svg",
  iconAnchor: null,
  popupAnchor: null,
  tooltipAnchor: new L.Point(20, 0),
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(25, 40),
  className: "marker-icon2",
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const Markers = ({ data, allMarkers }) => {
  // console.log(allMarkers);
  // console.log(data);

  return (
    <>
      <Marker
        icon={iconCorrect}
        key="correct-marker"
        position={[data.lat, data.lon]}
      >
        <Tooltip>Correct answer</Tooltip>
      </Marker>
      {allMarkers.map((marker) => {
        return (
          <Marker
            icon={iconUserGuess}
            key={marker.username}
            position={[marker.lat, marker.lon]}
          >
            <Tooltip direction="right" offset={[-8, -2]} opacity={1} permanent>
              {marker.username}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default function MapRoundRecapLeaflet(props) {
  const [markers, setMarkers] = useState(null);
  const [center, setCenter] = useState([0, 0]);

  // useEffect(() => {
  //   console.log("roundtoview");
  //   setCenter([props.data.lat, props.data.lon]);
  //   //retrieve results from json
  //   let results = [];
  //   for (var x in props.data.results) {
  //     if (props.data.results[x].finished == false) {
  //     } else {
  //       let data = {
  //         lat: props.data.results[x].lat,
  //         lon: props.data.results[x].lon,
  //         username: props.data.results[x].username,
  //       };
  //       results.push(data);
  //     }
  //   }
  //   //set all current markers, so leter i can remove them
  //   setMarkers(results);
  // }, [props.roundToView]);

  //when props change it means there's a new result, so reset all markers and set them again
  useEffect(() => {
    //("effest results");
    let results = [];

    setCenter([parseFloat(props.data.lat), parseFloat(props.data.lon)]);
    for (var x in props.data.results) {
      if (props.data.results[x].finished == false) {
      } else {
        let data = {
          lat: props.data.results[x].lat,
          lon: props.data.results[x].lon,
          username: props.data.results[x].username,
        };
        results.push(data);
      }
    }
    setMarkers(results);
  }, [props.data.results]);

  return (
    <MapContainer
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
      center={center}
      zoom={3}
    >
      <ChangeView center={center} zoom={1} />

      <Markers data={props.data} allMarkers={markers} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></TileLayer>
    </MapContainer>
  );
}
