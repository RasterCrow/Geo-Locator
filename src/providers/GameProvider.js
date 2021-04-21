//This file provides context and functions for lobby and game start data
import React, { createContext, useState } from "react";
import { db } from "../services/firebase.js";

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

export function createLobby(user, rounds, timeLimit) {
  //create
  let lobbyRef = db.ref("/lobbies/");
  var newLobby = lobbyRef.push({
    gameStarted: false,
    host: user.uid,
    timeLimit: timeLimit,
    rounds: rounds,
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
export function createGame(users, uid_host, lobbyID, rounds, timeLimit) {
  //create game data
  // let gameId = '_' + Math.random().toString(36).substr(2, 9);
  let gameLoc = getRandomLocations(rounds);
  //set host and timeLimit
  db.ref(`games/${lobbyID}`).update({
    host: uid_host,
    timeLimit: timeLimit,
    maxRounds: rounds,
    lobby: lobbyID,
  });
  //add partecipants
  users.forEach((user) => {
    db.ref(`games/${lobbyID}/partecipants`).update({
      [user.uid]: user.username,
    });
  });
  //create rounds
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
function getRandomLocations(n) {
  let loc = [];
  for (let index = 0; index < n; index++) {
    //get random location
    let location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    let data = {
      lat: parseFloat(location.split(",")[0]),
      lon: parseFloat(location.split(",")[1]),
    };

    loc.push(data);
  }
  return loc;
}

const LOCATIONS = [
  "41.386151,-72.594942",
  "41.143598,-79.850821",
  "39.953833,-82.459817",
  "31.710572,-81.731586",
  "54.730097,-113.322859",
  "18.204668,98.688083",
  "41.716861,-73.444118",
  "49.773504,18.443298",
  "49.760865,18.540459",
  "45.441826,-76.482697",
  "45.048785,-81.364746",
  "46.487874,-87.341824",
  "40.48642,-8.67229",
  "-30.060433,-51.235402",
  "48.462939,-122.57806",
  "41.089282,-112.153015",
  "39.607942,-104.037314",
  "43.01766,-70.832514",
  "44.636013,-63.56979",
  "46.12368,-60.178324",
  "58.154715,-6.503611",
  "56.527054,-2.715433",
  "52.381691,4.842191",
  "52.323185,5.077737",
  "48.627318,2.414361",
  "22.158751,113.568383",
  "50.443452,30.368872",
  "46.102489,0.489836",
  "40.32928,-8.843704",
  "47.506302,-52.878399",
  "59.91132,10.704117",
  "59.324429,18.027363",
  "59.308133,18.017603",
  "61.583522,24.121818",
  "61.792067,26.09482",
  "61.153023,28.626297",
  "59.930482,30.326724",
  "55.740989,37.643505",
  "42.504454,26.778216",
  "32.047836,34.764",
  "27.85158,-15.431503",
  "28.405772,-13.851339",
  "28.136941,-14.265967",
  "-22.121892,-41.579143",
  "21.107432,-101.643071",
  "33.907164,-118.291597",
  "32.578544,-117.084322",
  "32.499614,-116.949802",
  "27.954928,-110.838017",
  "-33.627253,-70.713926",
  "-33.902864,19.156254",
  "-33.418034,19.287207",
  "-29.603402,31.162643",
  "-29.353418,31.275769",
  "44.396495,8.943227",
  "52.455897,13.315633",
  "52.399292,4.54257",
  "51.504403,-0.096115",
  "50.779741,-1.076586",
  "53.006673,-9.388301",
  "53.269908,-9.056027",
  "-36.244136,150.138252",
  "-35.910253,150.080754",
  "-35.304017,149.125024",
  "-33.852164,151.210808",
  "-33.60936,151.330671",
  "-27.276922,152.981374",
  "-16.914506,145.772079",
  "-18.414849,133.850509",
  "-12.714131,131.087205",
  "-32.375691,124.624594",
  "-33.205705,136.127483",
  "-37.809287,144.860957",
  "-38.518886,145.364938",
  "-37.881112,147.986631",
  "-45.890042,170.509817",
  "-45.732399,170.570131",
  "-44.395179,171.248557",
  "-43.352667,172.662721",
  "14.42514,-60.88696",
  "-41.528316,174.006963",
  "-41.278536,173.79653",
  "-41.296114,174.805083",
  "-39.831018,174.884594",
  "-37.097002,174.944404",
  "-36.586234,174.696246",
  "23.392954,120.167403",
  "23.434591,120.475001",
  "24.164274,120.466706",
  "25.127677,121.345888",
  "22.14233,120.895906",
  "22.068026,120.713913",
  "24.180617,121.310135",
  "22.713633,120.647938",
  "37.520159,126.965217",
  "37.605225,126.819185",
  "33.03172,133.092495",
  "33.363595,133.257364",
  "33.245564,134.175172",
  "33.9355,134.675445",
  "34.090315,134.568655",
  "34.370156,134.897461",
  "34.573761,135.483717",
  "35.036556,136.624798",
  "35.053323,136.860677",
  "37.919095,140.90102",
  "38.172184,140.890116",
  "38.302981,141.016754",
  "39.004622,141.620705",
  "40.834644,140.724153",
  "13.671031,100.453813",
  "13.794303,100.475734",
  "13.820743,100.520225",
  "15.688301,100.123802",
  "20.701626,-156.444524",
  "20.935914,-156.340622",
  "20.754721,-156.307426",
  "20.932671,-156.512269",
  "20.930665,-156.690124",
  "20.817193,-156.627544",
  "21.059255,-156.833847",
  "21.170511,-156.998919",
  "21.099857,-157.043906",
  "21.314349,-157.88783",
  "21.390764,-157.963323",
  "21.460369,-157.994817",
  "21.500828,-158.029445",
  "21.579848,-158.179746",
  "21.546209,-158.240185",
  "22.215538,-159.533002",
  "22.210937,-159.475825",
  "22.14238,-159.313348",
  "21.975743,-159.370528",
  "61.037293,-149.780767",
  "61.087325,-149.834305",
  "61.481578,-149.252417",
  "60.986285,-149.509693",
  "60.81731,-148.986377",
  "64.788119,-148.215078",
  "66.426153,19.682644",
  "66.897023,17.836021",
  "68.419404,17.38831",
  "42.041688,11.828012",
  "36.747676,-3.062242",
  "27.752501,-15.647589",
  "-42.808793,147.521977",
  "-41.188572,146.370518",
  "-41.239591,147.007891",
  "-41.564388,148.297033",
  "-42.193771,148.058178",
  "-22.539818,27.150758",
  "-22.564326,27.084064",
  "-19.988805,23.420358",
  "-19.987536,23.400586",
  "-19.97829,23.436552",
  "-2.547081,-44.303493",
  "-2.521623,-44.303452",
  "-2.496611,-44.307604",
  "-2.483738,-44.251567",
  "-4.8685,-43.359994",
  "-4.862966,-43.366505",
  "-4.856253,-43.350032",
  "61.256752,73.445459",
  "61.260159,73.255434",
  "61.223046,73.159369",
  "61.260149,73.522541",
  "61.018278,69.03807",
  "61.060151,72.611124",
  "60.161247,24.924737",
  "60.166274,24.894095",
  "60.180358,24.839546",
  "60.156709,24.61002",
  "60.443872,22.269734",
  "59.43249,24.786236",
  "59.438622,24.77217",
  "59.440308,24.739404",
  "59.428183,24.725075",
  "56.965314,23.87461",
  "56.930528,23.611445",
  "38.796784,-9.217481",
  "38.762923,-9.140635",
  "41.173086,-71.558383",
  "41.1882,-71.568413",
  "41.224204,-71.565897",
  "41.503585,-71.342547",
  "41.27875,-70.09466",
  "41.285498,-70.097395",
  "41.290028,-70.091802",
  "41.28397,-70.169894",
  "42.05567,-70.130615",
  "42.0437,-70.214552",
  "42.061555,-70.161672",
  "41.460846,-71.321621",
  "38.663682,1.583126",
  "39.067397,1.588115",
  "39.545419,2.620647",
  "39.56504,2.643499",
  "36.744034,11.989399",
  "40.846046,14.266241",
  "41.903467,12.52023",
  "41.900241,12.45591",
  "41.917006,8.736544",
  "41.931862,8.740537",
  "41.863582,-87.619196",
  "41.702427,-87.524245",
  "39.961456,-83.000494",
  "39.953099,-82.998817",
  "40.438824,-80.011528",
  "40.449676,-79.993329",
  "41.49853,-81.705368",
  "41.478657,-81.673517",
  "42.32768,-83.04662",
  "42.347674,-83.000241",
  "43.632123,-79.412226",
  "43.649058,-79.354391",
  "43.700565,-79.254752",
  "41.390699,-73.477126",
  "41.425949,-73.340598",
  "41.468883,-73.405674",
  "41.455067,-73.238091",
  "41.465248,-73.246627",
  "41.465829,-73.229696",
  "41.477619,-73.216943",
  "41.507517,-73.140724",
  "41.117671,-73.38268",
  "41.107462,-73.411",
  "41.093624,-73.419081",
  "41.09153,-73.415912",
  "41.098894,-73.416056",
  "41.576465,-73.411813",
  "41.605417,-73.404012",
  "41.592727,-73.450599",
  "41.556962,-73.387772",
  "41.550288,-73.329864",
  "41.535304,-73.279492",
  "41.550911,-73.205327",
  "41.551363,-73.055456",
  "41.518617,-72.771206",
  "44.812002,8.977338",
  "46.584218, 26.907333",
  "46.579758, 26.914089",
  "46.539462, 26.904406",
  "44.923526, 8.618716",
  "44.892666, 8.803673",
  "44.866920, 8.754369",
  "44.907880, 8.876283",
  "44.900024, 8.870430",
  "44.889385, 8.859696",
  "44.906252, 8.922186",
  "44.905676, 8.246629",
  "45.071293, 7.702904",
  "45.029374, 7.666097",
  "45.733386, 7.320527",
  "45.739196, 7.330673",
  "45.701542, 7.241700",
  "44.906459, 8.201694",
  "44.772481, 8.249405",
  "44.676805, 8.464389",
  "44.544270, 8.337562",
  "44.050798, 8.213077",
  "43.888336, 8.039040",
  "43.800961, 7.716353",
  "43.779864, 7.672528",
  "43.719929, 7.274263",
  "44.411709, 8.909342",
  "44.385214, 9.033510",
  "44.113833, 9.838787",
  "44.114226, 9.842295",
  "45.043097, 9.702997",
  "45.056529, 9.690637",
  "45.488913, 9.154092",
  "45.482900, 9.148672",
  "45.462603, 9.173818",
  "45.446660, 9.175059",
  "45.470468, 9.245390",
  "52.534565, 13.517793",
  "45.692685, 9.672314",
  "45.592547, 9.680078",
  "45.480028, 9.661714",
  "45.360323, 9.673726",
  "45.088211, 10.117886",
  "45.090574, 10.112929",
  "44.756476, 10.355880",
  "44.780088, 10.394598",
  "44.711351, 10.609975",
  "45.438131, 12.328484",
  "45.597444, 12.381135",
  "45.635066, 12.396871",
  "41.887047, 12.505144",
  "40.843854, 14.321383",
  "42.081652, 9.053715",
  "36.790659, 10.182821",
  "34.765859, 10.744840",
  "29.978419, 31.132771",
  "37.957719, 23.751739",
  "38.039283, 23.733888",
  "35.905551, 14.488064",
  "35.880404, 14.484499",
  "38.693050, 35.431370",
  "37.921583, 32.524977",
  "44.416744, 26.113744",
  "46.924771, 26.372425",
  "47.119609, 21.788205",
  "32.036447, 34.760717",
  "37.930556, 15.921767",
  "35.510478, 24.010182",
  "19.472528, -99.138216",
  "15.470898, -90.385909",
  "4.708762, -74.063673",
  "4.148331, -73.625101",
  "3.786129, -75.070519",
  "3.428771, -76.531987",
  "3.413977, -76.497587",
  "2.448845, -76.611862",
  "-17.407812, -66.164002",
  "-54.798710, -68.299622",
  "-41.490914, 147.122303",
  "-37.859556, 145.001233",
  "43.102665, 141.319303",
  "43.202983, 140.999442",
  "51.008675, -114.118249",
  "47.058144, 2.426731",
  "47.078453, 2.391468",
  "45.839674, 1.281018",
  "45.653582, 0.166480",
  "44.880769, -0.541342",
  "41.650267, -4.693044",
  "39.586151, -0.396183",
  "39.465011, -0.381169",
  "38.358061, -0.489888",
  "43.408002, 5.052852",
  "40.342480, 9.313606",
  "39.232788, 9.122335",
  "42.457366, 19.289471",
  "44.673844, 20.598685",
  "42.703940, 23.335411",
  "7.721677, 80.550167",
  "5.948396, 80.547737",
  "7.430958, 81.815389",
  "9.669626, 80.018992",
  "23.805504, 90.402882",
  "26.881783, 90.261497",
  "11.575028, 104.917683",
];
