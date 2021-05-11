import React, { useState, useEffect } from "react";
import { Divider } from "rsuite";

import { db } from "../../services/firebase";
export default function User(props) {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    db.ref(`games/${props.lobbyId}`).once("value", (snapshot) => {
      if (snapshot.exists()) {
        //retrieve aprtecipants once.
        snapshot.child("partecipants").forEach((element) => {
          if (element.key == props.user[0]) {
            let data = {
              points: props.user[1],
              name: element.val(),
            };
            setUserData(data);
          }
        });
      }
    });
  }, [props]);
  return userData != null ? (
    <>
      {userData.points == undefined || isNaN(userData.points) ? (
        <p
          style={{
            fontSize: "1.1em",
            fontFamily: "Montserrat",
            margin: "5px",
          }}
        >
          {userData.name} is still playing.
        </p>
      ) : (
        <p
          style={{
            fontSize: "1.1em",
            fontFamily: "Montserrat",
            margin: "5px",
          }}
        >
          {userData.name} made {userData.points} points.
        </p>
      )}
      <Divider style={{ margin: "0" }} />
    </>
  ) : (
    <p>Loading..</p>
  );
}
