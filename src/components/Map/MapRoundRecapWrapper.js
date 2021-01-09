import React from "react";

import ReactDependentScript from "react-dependent-script";

import MapRoundRecap from './MapRoundRecap';

const apiKey = process.env.REACT_APP_API_KEY

export default function MapRoundRecapWrapper(props) {
    return (
        <ReactDependentScript
            scripts={[
                `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
            ]}
        >
            {/*results map*/}
            <div
                style={{
                    width: "auto",
                    height: "300px",
                }}
            >
                <MapRoundRecap roundToView={props.roundToView} data={props.data} />
            </div>
        </ReactDependentScript>

    );
}