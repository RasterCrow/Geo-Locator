import React, { useState, useContext, useEffect } from "react";
import { Panel, Button, Notification, InputNumber } from "rsuite";
import { db } from "../services/firebase";
import User from "../components/Lobby/User";
import { AuthContext } from "../providers/Auth";
import CreateUserModal from "../components/Lobby/CreateUserModal";
import { useHistory } from "react-router-dom";
import { createGame } from "../providers/GameProvider";
import gamemodes from "../utilities/gamemods.json";
import GameMapSelectorModal from "../components/Lobby/GameMapSelectorModal";

function GameMapPreview({ gameMapId }) {
  return gameMapId == null ? (
    <p>Loading...</p>
  ) : (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <img
        style={{
          borderRadius: "8px",
        }}
        src={gamemodes[gameMapId].image}
        width="230"
        height="140"
        alt="Game mode map location"
      />
      <p
        style={{
          fontSize: "1.1em",
          fontFamily: "Montserrat",
        }}
      >
        {gamemodes[gameMapId].title}
      </p>
    </div>
  );
}

export default function GameLobby(props) {
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [hostId, setHostId] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [rounds, setRounds] = useState(null);
  const [gameMapId, setGameMapId] = useState(null);
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

          setHostId(data.host);
          if (data.host == currentUser.uid) {
            setIsHost(true);
            //console.log("user is host");
            //if host disconnects, find another host if there are players.
            if (Object.keys(data.players).length > 1) {
              db.ref(`lobbies/${lobbyID}`).onDisconnect().cancel();
              db.ref(`games/${lobbyID}`).onDisconnect().cancel();

              let newHost = Object.keys(data.players).find(
                (element) => element != data.host
              );
              db.ref(`lobbies/${lobbyID}`).onDisconnect().update({
                host: newHost,
              });

              db.ref(`lobbies/${lobbyID}/players`)
                .onDisconnect()
                .update({
                  [currentUser.uid]: null,
                });

              db.ref(`games/${lobbyID}`)
                .once("value")
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    db.ref(`games/${lobbyID}`).onDisconnect().update({
                      host: newHost,
                    });
                  }
                });
            } else {
              db.ref(`lobbies/${lobbyID}`).onDisconnect().cancel();
              db.ref(`games/${lobbyID}`).onDisconnect().cancel();

              db.ref(`lobbies/${lobbyID}`).onDisconnect().set({
                null: null,
              });

              db.ref(`games/${lobbyID}`).onDisconnect().set({
                null: null,
              });
            }
          } else {
            //if user disconnects, disconnect user
            db.ref(`lobbies/${lobbyID}/players`)
              .onDisconnect()
              .update({
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
          setGameMapId(data.gameMapId);
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
      createGame(
        joinedUsers,
        currentUser.uid,
        lobbyID,
        rounds,
        timeLimit,
        gameMapId
      );
    }
  };
  const handleRoundsChange = (e) => {
    db.ref(`lobbies/${lobbyID}`).update({ rounds: e });
  };
  const handleTimeLimitChange = (e) => {
    db.ref(`lobbies/${lobbyID}`).update({ timeLimit: e * 60 });
  };
  const handleChangeMap = (e) => {
    if (e != gameMapId) {
      db.ref(`lobbies/${lobbyID}`).update({ gameMapId: e });
    }
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
          minHeight: "500px",
          minWidth: "800px",
          backgroundColor: "#2B2E33",
        }}
        header="Lobby Setup"
        shaded
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "50%",
              minHeight: "380px",
              backgroundColor: "rgb(30, 32, 36)",
              borderRadius: "15px",
              padding: "10px",
            }}
          >
            {joinedUsers.length > 0 ? (
              joinedUsers.map((singleUser) => {
                return (
                  <User
                    key={singleUser.uid}
                    user={singleUser}
                    hostId={hostId}
                  />
                );
              })
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <GameMapPreview gameMapId={gameMapId} />
            {isHost ? (
              <>
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Rounds :{" "}
                  <InputNumber
                    style={{
                      display: "inline-flex",
                      width: "80px",
                      marginLeft: "5px",
                    }}
                    value={rounds}
                    onChange={(e) => handleRoundsChange(e)}
                    min={2}
                    max={20}
                    step={1}
                  />
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Time limit per round:{" "}
                  <InputNumber
                    style={{
                      display: "inline-flex",
                      width: "80px",
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                    onChange={(e) => handleTimeLimitChange(e)}
                    value={timeLimit / 60}
                    min={1}
                    max={20}
                    step={1}
                  />
                  minutes
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <GameMapSelectorModal
                    currentMap={gameMapId}
                    handleChangeMap={handleChangeMap}
                    gamemodes={gamemodes}
                  />
                  <Button
                    style={{ height: "40px" }}
                    appearance="primary"
                    color="green"
                    onClick={handleStartGame}
                  >
                    Start Game
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "1.2em" }}>
                  Rounds : {rounds}
                  <br />
                  Time limit per round: {timeLimit / 60} minutes
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Button disabled color="yellow">
                    Change Map
                  </Button>
                  <Button
                    style={{ height: "40px" }}
                    disabled
                    color="green"
                    onClick={handleStartGame}
                  >
                    Start Game
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
