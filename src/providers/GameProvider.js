//This file provides context and functions for lobby and game start data
import React, { createContext, useState } from "react";
import { db } from "../services/firebase.js";
import locations from "../utilities/locations.json";
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [lonGuessed, setLonGuessed] = useState(0);
  const [latGuessed, setLatGuessed] = useState(0);
  const [googleApiKey, setGoogleApiKey] = useState(null);

  const setLocationGuessed = (lat, lon) => {
    setLonGuessed(lon);
    setLatGuessed(lat);
  };

  const setCustomAPIKey = (key) => {
    setGoogleApiKey(key);
  };

  return (
    <GameContext.Provider
      value={{
        lonGuessed,
        latGuessed,
        googleApiKey,
        setLocationGuessed,
        setCustomAPIKey,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function createLobby(user, rounds, timeLimit, APIKey, gameMap) {
  //create
  let lobbyRef = db.ref("/lobbies/");
  var newLobby = lobbyRef.push({
    gameStarted: false,
    host: user.uid,
    timeLimit: timeLimit,
    rounds: rounds,
    lobbyKey: APIKey,
    gameMapId: gameMap,
    players: {
      [user.uid]: {
        uid: user.uid,
        username: user.username,
        inLobby: true,
      },
    },
  });

  let lobbyId = newLobby.key;
  return Promise.resolve(lobbyId);
}

export function getLobbyAPIKey(lobbyId) {
  return db
    .ref(`/lobbies/${lobbyId}`)
    .once("value")
    .then((snapshot) => {
      return Promise.resolve(snapshot.val().lobbyKey);
    });
}

export function checkLobbyExist(lobbyId) {
  return db
    .ref(`/lobbies/${lobbyId}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        //lobby exists
        if (snapshot.val().gameStarted) {
          //game started, user cannot join
          return Promise.resolve(2);
        } else {
          //game not started
          return Promise.resolve(1);
        }
      } else {
        return Promise.resolve(0);
      }
    });
}

export function setIsUserInLobby(lobbyId, user, value) {
  let lobbyRef = db.ref(`/lobbies/${lobbyId}/players`);
  if (lobbyRef) {
    lobbyRef.update({
      [user.uid]: {
        inLobby: value,
      },
    });
    return Promise.resolve(1);
  } else {
    return Promise.resolve(0);
  }
}

export function joinLobby(user, lobbyId) {
  //join

  let lobbyRef = db.ref(`/lobbies/${lobbyId}/players`);
  if (lobbyRef) {
    lobbyRef.update({
      [user.uid]: {
        uid: user.uid,
        username: user.username,
        inLobby: true,
      },
    });
    return Promise.resolve(1);
  } else {
    return Promise.resolve(0);
  }
}

//used to add guessed player location on db after each round. Since I don't keep track of users, I need to save their username in each section, so other users can see their name
export function addGuessedLoc(uid, username, lobbyID, round, lat, lon, points) {
  db.ref(`games/${lobbyID}/rounds/${round}/results/${uid}`).set({
    username: username,
    lat: lat,
    lon: lon,
    points: points,
  });
}

//add final result after n rounds.
export function addFinalResult(uid, username, lobbyID, points) {
  db.ref(`games/${lobbyID}/total/${uid}`).set({
    username: username,
    points: points,
  });
}
//after game is finished delete game ( maybe after host closes game, or everyone returned to lobby)
export function deleteGame(lobbyID) {
  db.ref(`games/${lobbyID}`).set({
    deleted: null,
  });
}

//creates a game session
export function createGame(
  users,
  uid_host,
  lobbyID,
  rounds,
  timeLimit,
  gameMapId
) {
  //create game data
  // let gameId = '_' + Math.random().toString(36).substr(2, 9);
  let gameLoc = getRandomLocations(rounds, gameMapId);
  //set host and timeLimit
  db.ref(`games/${lobbyID}`).update({
    host: uid_host,
    timeLimit: timeLimit,
    maxRounds: rounds,
    lobby: lobbyID,
    redirect: false,
  });
  //add partecipants
  users.forEach((user) => {
    db.ref(`games/${lobbyID}/partecipants`).update({
      [user.uid]: user.username,
    });
  });
  //create rounds
  db.ref(`games/${lobbyID}/rounds`).set({
    null: null,
  });
  for (let index = 0; index < rounds; index++) {
    let resultsTemplate = {};
    users.forEach((user) => {
      resultsTemplate[user.uid] = {
        finished: false,
        lat: null,
        lon: null,
        points: null,
      };
    });
    let roundData = {
      lat: gameLoc[index].lat,
      lon: gameLoc[index].lon,
      results: resultsTemplate,
    };

    db.ref(`games/${lobbyID}/rounds`).update({
      [index + 1]: roundData,
    });
  }
  //set start so people get redirected
  db.ref(`lobbies/${lobbyID}`).update({
    gameStarted: true,
    gameID: lobbyID,
  });
}

//retrieve n locations from locations array
function getRandomLocations(nRounds, gameMapId) {
  let loc = [];
  for (let index = 0; index < nRounds; index++) {
    //get random location
    let location;
    //if game map is all the world, select randmoly from all the locations.
    if (gameMapId == "01") {
      let randomId = Math.floor(Math.random() * Object.keys(locations).length);
      location =
        locations[Object.keys(locations)[randomId]][
          Math.floor(
            Math.random() * locations[Object.keys(locations)[randomId]].length
          )
        ];
    } else {
      location =
        locations[gameMapId][
          Math.floor(Math.random() * locations[gameMapId].length)
        ];
    }

    let data = {
      lat: parseFloat(location.split(",")[0]),
      lon: parseFloat(location.split(",")[1]),
    };
    loc.push(data);
  }
  return loc;
}
