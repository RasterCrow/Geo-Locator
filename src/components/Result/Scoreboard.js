import React, { useEffect, useState } from "react";

import User from "./User";
import { Button } from "rsuite";
import MapRoundRecapWrapper from "../Map/MapRoundRecapWrapper";

export default function Scoreboard(props) {
  const [buttons, setButtons] = useState(null);
  const [roundToView, setRoundToView] = useState(0);

  useEffect(() => {
    let tempButtons = [];
    for (let index = 0; index < props.roundResults.length; index++) {
      tempButtons.push(
        <Button
          key={index}
          appearance="subtle"
          value={index}
          onClick={(e) => handleChangeRoundView(e)}
        >
          Round {index + 1}
        </Button>
      );
    }
    setButtons(tempButtons);
  }, [props.roundResults]);

  const handleChangeRoundView = (evt) => {
    //console.log(evt.target.value);
    setRoundToView(evt.target.value);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div>
        <div
          style={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "rgb(30, 32, 36)",
            minHeight: "150px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {props.results.map((user, index) => {
            return <User lobbyId={props.lobbyId} user={user} key={index} />;
          })}
        </div>
      </div>
      <div>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>{buttons}</div>
        <div style={{ marginTop: "10px", marginBottom: "15px" }}>
          <MapRoundRecapWrapper
            roundToView={roundToView}
            data={props.roundResults[roundToView]}
          />
        </div>
      </div>
    </div>
  );
}
