import React, { useState, useEffect, useContext } from "react";
import { Panel, Button } from "rsuite";
import { db } from "../../services/firebase";
import Scoreboard from "./Scoreboard";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../providers/Auth";

export default function ResultScreen(props) {
  const history = useHistory();
  const [roundsResults, setRoundsResults] = useState([]);
  const [finalResults, setFinalResults] = useState([]);
  const [hostUid, setHostUid] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    //retrieve data
    db.ref(`games/${props.lobbyId}`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        //
        //sicne all the host can make plaeyrs return to lobby, this is a little trick to redirect everyone when host presses button
        if (data.redirect) {
          history.push(`/lobby/${props.lobbyId}`);
        }
        setHostUid(data.host);
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

        if (data.host == currentUser.uid) {
          if (
            result.find((elem) => elem[1] == undefined || isNaN(elem[1])) ==
            undefined
          ) {
            //set lobby gameStarted to false

            db.ref(`lobbies/${props.lobbyId}`).update({
              gameStarted: false,
            });
          }
        }
        setRoundsResults(arrayDataRounds);
        setFinalResults(result);
      }
    });
  }, []);

  const handleReturnToLobby = () => {
    db.ref(`games/${props.lobbyId}`).update({
      redirect: true,
    });
  };

  const handleReturnToHome = () => {
    window.location.reload();
    history.push(`/`);
  };

  return roundsResults.length > 0 && finalResults.length > 0 ? (
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
            <Scoreboard
              results={finalResults}
              roundResults={roundsResults}
              lobbyId={props.lobbyId}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "10px",
              gap: "20px",
            }}
          >
            {finalResults.find(
              (elem) => elem[1] == undefined || isNaN(elem[1])
            ) == undefined ? (
              currentUser.uid == hostUid ? (
                <Button
                  style={{ height: "35px", alignSelf: "center" }}
                  appearance="primary"
                  onClick={handleReturnToLobby}
                >
                  Return to Lobby
                </Button>
              ) : (
                <Button
                  style={{ height: "35px", alignSelf: "center" }}
                  appearance="primary"
                  disabled
                >
                  Return to Lobby
                </Button>
              )
            ) : (
              <Button
                style={{ height: "35px", alignSelf: "center" }}
                appearance="primary"
                disabled
              >
                Return to Lobby
              </Button>
            )}

            {/*
              <Button
                style={{ height: "35px", alignSelf: "center" }}
                appearance="primary"
                onClick={handleReturnToLobby}
              >
                Return to Lobby
              </Button>
           */}
          </div>
        </div>
      </Panel>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
