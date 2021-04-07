import React, { useContext, useState, useEffect } from "react";
import MapWrapper from "../components/Map/MapWrapper";
import { db } from "../services/firebase";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../providers/Auth";
import { GameContext, addGuessedLoc } from "../providers/GameProvider";
import { Button } from "rsuite";
import ResultScreen from "../components/Result/ResultScreen";
import useSound from "use-sound";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return Promise.resolve(d);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default function GamePage(props) {
  const { currentUser } = useContext(AuthContext);
  const { setLocationGuessed, lonGuessed, latGuessed } = useContext(
    GameContext
  );

  const history = useHistory();
  const lobbyID = props.match.params.uid;
  const [timeLimit, setTimeLimit] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPartecipant, setIsPartecipant] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const [playTick] = useSound(
    process.env.PUBLIC_URL + "/assets/sounds/tick.wav",
    { volume: 0.25 }
  );

  useEffect(() => {
    //check if game exists
    if (currentUser == null) {
      history.push("/");
    } else {
      db.ref(`games/${lobbyID}`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            //check if user is partecipant
            let userFound = false;
            snapshot.child("partecipants").forEach((element) => {
              if (element.key == currentUser.uid) userFound = true;
            });
            //if user is partecipant
            if (userFound) {
              setIsPartecipant(true);
              //retrieve game data
              let data = snapshot.val();
              //setto onDisconnect magari non serve
              if (data.host == currentUser.uid) {
                //console.log("user is host");
                //if host disconnects, remove lobby completely
                var presenceRefHost = db.ref(`games/${lobbyID}`);
                presenceRefHost.onDisconnect().set({
                  null: null,
                });
              }
              setTimeLimit(data.timeLimit);
              setRounds(data.maxRounds);
              //retrieve rounds info
              let arrayData = [];
              snapshot.child("rounds").forEach((round) => {
                let data = {
                  lat: round.val().lat,
                  lon: round.val().lon,
                };
                arrayData.push(data);
              });
              setGameData(arrayData);
            } else {
              Notification["error"]({
                title: "Error",
                description:
                  "Host closed the match. You'll now be redirected...",
              });
              setTimeout(() => {
                history.push(`/`);
              }, 1500);
            }
          } else {
            history.push("/");
          }
        });
    }
  }, []);
  //countdown in game time
  useEffect(() => {
    // Code in here
    if (isGameStarted) {
      setCurrentTime(timeLimit - 1);
    } else {
      //if the game ended reset the data
      setCurrentRound(currentRound + 1);
      setLocationGuessed(0, 0);
      setCurrentTime(timeLimit);
    }
  }, [isGameStarted]);

  //countdown in game time
  useEffect(() => {
    if (isGameStarted) {
      setTimeout(() => {
        // console.log('countdown currenttime : ' + currentTime);
        // Code in here
        if (currentTime == 1) {
          //handle end round
          handleEndRound();
        } else if (currentTime <= 6 && currentTime > 1) {
          //play sound
          playTick();
          setCurrentTime(currentTime - 1);
        } else if (currentTime != timeLimit) {
          setCurrentTime(currentTime - 1);
        }
      }, 1000);
    }
  }, [currentTime]);

  const handleNextRound = () => {
    setIsGameStarted(true);
  };

  const handleEndRound = () => {
    setIsGameStarted(false);
    // setCurrentRound(currentRound + 1);
    // setLocationGuessed(0, 0);
    // setCurrentTime(timeLimit);
    //calculate points
    getDistanceFromLatLonInKm(
      parseFloat(latGuessed),
      parseFloat(lonGuessed),
      parseFloat(gameData[currentRound - 1].lat),
      parseFloat(gameData[currentRound - 1].lon)
    )
      .then((res) => {
        let distance = parseInt(res);
        let points = 0;
        //TODO Implementare time influenza valore
        let timeToAnswer = timeLimit - currentTime;

        if (distance <= 2) {
          points = 1000;
        } else if (distance <= 5 && distance > 2) {
          points = 850;
        } else if (distance <= 25 && distance > 5) {
          points = 700;
        } else if (distance <= 100 && distance > 25) {
          points = 500;
        } else if (distance <= 500 && distance > 100) {
          points = 350;
        } else if (distance <= 2500 && distance > 500) {
          points = 200;
        } else if (distance <= 7000 && distance > 2500) {
          points = 100;
        } else if (distance > 7000) {
          points = 1;
        }

        //set current data on db
        addGuessedLoc(
          currentUser.uid,
          currentUser.username,
          lobbyID,
          currentRound,
          latGuessed,
          lonGuessed,
          points
        );
      })
      .then(() => {
        //check if game is finished
        if (currentRound == rounds) {
          //game is finished, show result page.
          setIsGameFinished(true);
        }
      });
  };

  return isPartecipant ? (
    isGameFinished ? (
      <>
        <ResultScreen lobbyId={lobbyID} />
      </>
    ) : gameData.length > 0 ? (
      !isGameStarted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          {currentRound == 0 ? (
            <p style={{ fontSize: "2rem", fontFamily: "Montserrat" }}>
              When you're ready start the game.
            </p>
          ) : (
            <p style={{ fontSize: "2rem", fontFamily: "Montserrat" }}>
              Round {currentRound} out of {rounds}.
            </p>
          )}
          <Button onClick={handleNextRound}>Start Round</Button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
            }}
          >
            {/*  Game Utilities */}
            <div
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid black",
                backgroundColor: "rgba(255,255,255,0.4)",
                width: "10%",
                position: "absolute",
                bottom: "330px",
                right: "1%",
                zIndex: "2",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div
                style={{
                  fontSize: "1.3rem",
                  fontFamily: "Roboto",
                  WebkitTextStroke: "1px rgba(0,0,0,0.5)",
                  color: "rgb(22, 82, 240)",
                }}
              >
                <p> Round : {currentRound}</p>
                <p> Time remaining : {currentTime}</p>
              </div>

              {currentRound == rounds ? (
                <Button style={{ marginTop: "5px" }} onClick={handleEndRound}>
                  Finish Game
                </Button>
              ) : (
                <Button style={{ marginTop: "5px" }} onClick={handleEndRound}>
                  Next Round
                </Button>
              )}
            </div>

            {
              <MapWrapper
                lat={gameData[currentRound - 1].lat}
                lon={gameData[currentRound - 1].lon}
              />
            }
          </div>
        </>
      )
    ) : (
      <p>Loading...</p>
    )
  ) : (
    <p>Loading...</p>
  );
}
