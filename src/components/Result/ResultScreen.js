import React, { useState, useEffect } from "react";
import { Panel, Button } from "rsuite";
import { db } from "../../services/firebase";
import Scoreboard from "./Scoreboard";
import { useHistory } from "react-router-dom";
import { InputPicker } from 'rsuite';

export default function ResultScreen(props) {
  const history = useHistory();
  const [roundsResults, setRoundsResults] = useState([]);
  const [finalResults, setFinalResults] = useState([]);
  useEffect(() => {
    //retrieve data
    db.ref(`games/${props.lobbyId}`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        //retrieve other data
        let arrayDataRounds = [];
        let arrayFinalResults = {};
        snapshot.child("rounds").forEach((round) => {
          let data = round.val();
          arrayDataRounds.push(data);
          round.child("results").forEach((user) => {
            if (arrayFinalResults[user.key] == null) {
              arrayFinalResults[user.key] = user.val().points;
            } else {
              arrayFinalResults[user.key] =
                arrayFinalResults[user.key] + user.val().points;
            }
          });
        });
        let result = [];
        for (var i in arrayFinalResults) result.push([i, arrayFinalResults[i]]);
        setRoundsResults(arrayDataRounds);
        setFinalResults(result);
      }
    });
  }, []);

  const handleReturnToLobby = () => {
    window.location.reload();
    history.push(`/`);
  };

  return roundsResults.length > 0 || finalResults.length > 0 ? (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Panel
        style={{
          width: "500px",
          backgroundColor: "#2B2E33",
        }}
        header="Results"
        shaded
      >
        <div
          style={{
            display: "flex",
            minHeight: "200px",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",

              paddingLeft: "10px",
            }}
          >
            <Scoreboard results={finalResults} roundResults={roundsResults} lobbyId={props.lobbyId} />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "10px",
            }}
          >
            <Button
              style={{ height: "50px", alignSelf: "center" }}
              appearance="primary"
              onClick={handleReturnToLobby}
            >
              Return Home
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  ) : (
      <p>Loading...</p>
    );
}
