import React from "react";

import ReactDependentScript from "react-dependent-script";

import MapRoundRecap from "./MapRoundRecap";
import MapRoundRecapLeaflet from "./MapRoundRecapLeaflet";

const apiKey = process.env.REACT_APP_API_KEY;

export default function MapRoundRecapWrapper(props) {
  return (
    <>
      <div
        style={{
          width: "auto",
          height: "300px",
        }}
      >
        <MapRoundRecapLeaflet
          roundToView={props.roundToView}
          data={props.data}
        />
      </div>
      {/*
        <ReactDependentScript
            scripts={[
                `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
            ]}
        >
            
            <div
                style={{
                    width: "auto",
                    height: "300px",
                }}
            >

                
                <MapRoundRecap roundToView={props.roundToView} data={props.data} />
               
            </div>
        </ReactDependentScript>
        */}
    </>
  );
}
