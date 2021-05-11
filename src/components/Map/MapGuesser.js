import React, { useEffect, useContext } from "react";
import "./MapGuesser.css";
import { GameContext } from "../../providers/GameProvider";

export default function MapGuesser(props) {
  // Marker selection setup
  const { setLocationGuessed } = useContext(GameContext);

  var guessMarker;
  // Mini map marker setup
  const setGuessMarker = (guess, guessMarkerOptions) => {
    if (guessMarker) {
      guessMarker.setPosition(guess);
    } else {
      guessMarker = new window.google.maps.Marker(guessMarkerOptions);
      guessMarker.setPosition(guess);
      //setLocationGuessed()
    }
  };

  useEffect(() => {
    var mapOptions = {
      center: new window.google.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    };

    var mMap = new window.google.maps.Map(
      document.getElementById("miniMap"),
      mapOptions
    );
    var guessMarkerOptions = new window.google.maps.Marker({
      map: mMap,
      visible: true,
      title: "Your guess",
      draggable: false,
      //icon: '/img/googleMapsMarkers/red_MarkerB.png'
    });
    // Mini map click
    window.google.maps.event.addListener(mMap, "click", function (event) {
      let position = event.latLng.toJSON();
      setLocationGuessed(position.lat, position.lng);
      window.guessLatLng = event.latLng;
      setGuessMarker(window.guessLatLng, guessMarkerOptions);
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
      }}
      id="miniMap"
    />
  );
}
