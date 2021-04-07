import React, { useState, useContext, useEffect } from "react";
import { Panel, Button, Notification, InputNumber } from "rsuite";
import { db } from "../services/firebase";
import User from "../components/Lobby/User";
import { AuthContext } from "../providers/Auth";
import CreateUserModal from "../components/Lobby/CreateUserModal";
import { useHistory } from "react-router-dom";
import { createGame } from "../providers/GameProvider";

export default function GameLobby(props) {
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [rounds, setRounds] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const lobbyID = props.match.params.uid;
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    //retrieve connected users
    if (currentUser == null) {
      //if null, create a user

      setIsAuth(false);
    } else {
      //TODO check for password

      //when connected
      setIsAuth(true);
      //keep track of connected users and different data
      var lobbyRef = db.ref(`lobbies/${lobbyID}`);
      lobbyRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          //setto host e onDisconnect
          if (data.host == currentUser.uid) {
            setIsHost(true);
            //console.log("user is host");
            //if host disconnects, remove lobby completely
            var presenceRefHost = db.ref(`lobbies/${lobbyID}`);
            presenceRefHost.onDisconnect().set({
              null: null,
            });
          } else {
            //if user disconnects, disconnect user
            var presenceRef = db.ref(`lobbies/${lobbyID}/players`);
            presenceRef.onDisconnect().update({
              [currentUser.uid]: null,
            });
          }

          //setto lista utentiJoinati
          let allplayers = [];
          snapshot.child("players").forEach((element) => {
            allplayers.push(element.val());
          });
          if (joinedUsers != allplayers) {
            setJoinedUsers(allplayers);
          }
          //keep track of game start
          if (data.gameStarted) {
            history.push(`/game/${lobbyID}`);
          }
          //setto rounds e timeLimit
          setRounds(data.rounds);
          setTimeLimit(data.timeLimit);
        } else {
          Notification["error"]({
            title: "Error",
            description: "Host closed the match. You'll now be redirected...",
          });
          setTimeout(() => {
            history.push(`/`);
          }, 1500);
        }
      });
      //checks when it disconnects
    }
  }, [currentUser]);

  const handleStartGame = () => {
    if (isHost) {
      //create game
      createGame(joinedUsers, currentUser.uid, lobbyID, rounds, timeLimit);
    }
  };
  const handleRoundsChange = (e) => {
    db.ref(`lobbies/${lobbyID}`).update({ rounds: e });
  };
  const handleTimeLimitChange = (e) => {
    db.ref(`lobbies/${lobbyID}`).update({ timeLimit: e * 60 });
  };

  return !isAuth ? (
    <CreateUserModal lobbyId={lobbyID} />
  ) : (
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
          minHeight: "300px",
          width: "500px",
          backgroundColor: "#2B2E33",
        }}
        header="Lobby Setup"
        shaded
      >
        <div
          style={{
            minHeight: "200px",
            marginBottom: "25px",
            backgroundColor: "rgb(30, 32, 36)",
            borderRadius: "15px",
            padding: "10px",
          }}
        >
          {joinedUsers.length > 0 ? (
            joinedUsers.map((singleUser) => {
              return <User key={singleUser.uid} user={singleUser} />;
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "20px",
          }}
        >
          {isHost ? (
            <>
              <div>
                Rounds :{" "}
                <InputNumber
                  style={{
                    width: "80px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  value={rounds}
                  onChange={(e) => handleRoundsChange(e)}
                  min={2}
                  max={20}
                  step={1}
                />
                Time limit per round:{" "}
                <InputNumber
                  style={{
                    width: "80px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  value={timeLimit}
                  onChange={(e) => handleTimeLimitChange(e)}
                  value={timeLimit / 60}
                  min={1}
                  max={10}
                  step={1}
                />
                minutes
              </div>
              <Button
                style={{ height: "40px", alignSelf: "center" }}
                appearance="primary"
                onClick={handleStartGame}
              >
                Start Game
              </Button>
            </>
          ) : (
            <>
              <div>
                Rounds : {rounds}
                <br />
                Time limit per round: {timeLimit / 60} minutes
              </div>
              <Button
                style={{ height: "40px" }}
                disabled
                appearance="primary"
                onClick={handleStartGame}
              >
                Start Game
              </Button>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}
