import React from "react";

import User from "./User";

export default function Scoreboard(props) {
  return props.results.map((user, index) => {
    return <User lobbyId={props.lobbyId} user={user} key={index} />;
  });
}
