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
  const { setLocationGuessed, lonGuessed, latGuessed } =
    useContext(GameContext);

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
                description: "You can't join this match.",
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
        let timeToAnswer = timeLimit - currentTime;
        if (distance <= 2) {
          points = 100;
        } else if (distance <= 5 && distance > 2) {
          points = 90;
        } else if (distance <= 20 && distance > 5) {
          points = 85;
        } else if (distance <= 50 && distance > 20) {
          points = 70;
        } else if (distance <= 100 && distance > 50) {
          points = 50;
        } else if (distance <= 500 && distance > 100) {
          points = 35;
        } else if (distance <= 2500 && distance > 500) {
          points = 20;
        } else if (distance <= 7000 && distance > 2500) {
          points = 10;
        } else if (distance > 7000) {
          points = 1;
        }

        points = points - parseInt(((timeToAnswer / timeLimit) * 100) / 5);
        if (points < 0) points = 1;
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
                border: "1px solid black",
                backgroundColor: "rgba(255,255,255,0.8)",
                width: "400px",
                height: "50px",
                alignItems: "center",
                position: "absolute",
                top: "60px",

                minTop: "50px",
                right: "0",
                borderRadius: "0 0  0 10px",
                zIndex: "2",
                display: "flex",
                justifyContent: "space-evenly",
                gap: "5px",
                boxShadow: "0px 0px 10px -2px black",
              }}
            >
              <p
                style={{
                  paddingLeft: "10px",
                  width: "40%",
                  fontSize: "1.2rem",
                  fontFamily: "Montserrat",
                  WebkitTextStroke: "1px rgba(0,0,0,0.5)",
                  color: "#4D96E5",
                }}
              >
                {" "}
                Round :{" "}
                <span style={{ display: "inline", color: "#FF2F12" }}>
                  {currentRound}
                </span>
              </p>
              <p
                style={{
                  paddingRight: "10px",
                  width: "60%",
                  marginTop: "0px",
                  fontSize: "1.2rem",
                  fontFamily: "Montserrat",
                  WebkitTextStroke: "1px rgba(0,0,0,0.5)",
                  color: "#4D96E5",
                }}
              >
                {" "}
                Time remaining :{" "}
                <span style={{ display: "inline", color: "#FF2F12" }}>
                  {currentTime}
                </span>
              </p>
            </div>
            <div
              style={{
                zIndex: "2",
                position: "absolute",
                right: "15px",
                bottom: "330px",
              }}
            >
              {currentRound == rounds ? (
                <Button
                  style={{
                    fontSize: "1.5em",
                    marginTop: "5px",
                    boxShadow: "0px 3px 10px  black",
                  }}
                  color="red"
                  onClick={handleEndRound}
                >
                  Finish Game
                </Button>
              ) : (
                <Button
                  style={{
                    fontSize: "1.5em",
                    marginTop: "5px",
                    boxShadow: "0px 3px 10px  black",
                  }}
                  color="blue"
                  onClick={handleEndRound}
                >
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
