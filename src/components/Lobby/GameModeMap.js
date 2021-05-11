import React from "react";
import { Button } from "rsuite";

export default function GameModeMap(props) {
  return props.available ? (
    <Button
      active={props.selected == props.id ? true : false}
      onClick={() => {
        props.selectGameMode(props.id);
      }}
      style={{
        borderRadius: "9px",
      }}
    >
      <img
        style={{
          borderRadius: "8px",
        }}
        src={props.image}
        width="180"
        height="110"
        alt="Game mode map location"
      />
      <p
        style={{
          textAlign: "center",
          fontSize: "1.1em",
          fontFamily: "Montserrat",
        }}
      >
        {props.title}
      </p>
    </Button>
  ) : (
    <Button
      disabled
      active={props.selected == props.id ? true : false}
      onClick={() => {
        props.selectGameMode(props.id);
      }}
      style={{
        borderRadius: "9px",
      }}
    >
      <img
        style={{
          borderRadius: "8px",
        }}
        src={props.image}
        width="180"
        height="110"
        alt="Game mode map location"
      />
      <p
        style={{
          textAlign: "center",
          fontSize: "1.1em",
          fontFamily: "Montserrat",
        }}
      >
        {props.title}
      </p>
    </Button>
  );
}
