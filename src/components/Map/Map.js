import React, { useEffect } from "react";

export default function Map(props) {
  useEffect(() => {
    let options = {
      zoom: props.zoom,
      location: props.center,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    };
    var streetViewService = new window.google.maps.StreetViewService();
    var STREETVIEW_MAX_DISTANCE = 100;

    streetViewService.getPanoramaByLocation(
      options.location,
      STREETVIEW_MAX_DISTANCE,
      function (streetViewPanoramaData, status) {
        if (status === window.google.maps.StreetViewStatus.OK) {
          // We have a streetview pano for this location, so let's roll
          var panoramaOptions = {
            position: options.location,
            addressControl: false,
            linksControl: false,
            showRoadLabels: false,
            fullscreenControl: false,
            zoomControl: true,
            zoomControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_BOTTOM,
            },
            panControl: true,
            panControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_BOTTOM,
            },
            pov: {
              heading: 270,
              zoom: 1,
              pitch: -10,
            },
            visible: true,
          };

          var panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById("map"),
            panoramaOptions
          );
        } else {
          // no street view available in this range, or some error occurred
          alert(
            "Streetview is not available for this location :( Mind telling us that you saw this?"
          );
        }
      }
    );
  }, []);

  return <div style={{ width: "100%", height: "100%" }} id="map" />;
}
