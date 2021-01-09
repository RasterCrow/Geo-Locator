import React from "react";

import CreateLobbyModal from "../components/Lobby/CreateLobbyModal";

import JoinLobbyModal from "../components/Lobby/JoinLobbyModal";


export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        gap: "80px",
      }}
    >
      {/*Sezione Header */}
      <div
        id="header"
        style={{
          display: "flex",
          backgroundImage: `url('${process.env.PUBLIC_URL}/assets/home_banner.jpg')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          width: "100%",
          height: "300px",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            paddingLeft: "10%",
            fontFamily: "Montserrat",
            color: "#FDFDFD",
            textShadow: "3px 3px 5px rgb(22, 82, 240)",
          }}
        >
          Geo Locator
        </h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
        <CreateLobbyModal />
        <JoinLobbyModal />
      </div>
    </div>
  );
}
