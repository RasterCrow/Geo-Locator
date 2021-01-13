import React from "react";

import ReactDependentScript from "react-dependent-script";
import MapGuesserLeaflet from "./MapGuesserLeaflet";
import MapGuesser from "./MapGuesser";
import Map from "./Map";

const apiKey = process.env.REACT_APP_API_KEY

export default function MapWrapper(props) {
    return (
        <ReactDependentScript
            scripts={[
                `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
            ]}
        >

            <Map center={{ lat: parseFloat(props.lat), lng: parseFloat(props.lon) }} zoom={3} style={{ width: "100%", height: "100%" }} />
            {/*Location Guess Map*/}
            <div
                style={{
                    zIndex: "2",
                    width: "400px",
                    height: "300px",
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                }}
            >
                {/*<MapGuesserLeaflet />*/}
                <MapGuesser />
            </div>
        </ReactDependentScript>

    );
}