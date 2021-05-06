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
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            paddingLeft: "10%",
            fontFamily: "Montserrat",
            color: "#FDFDFD",
            textShadow: "3px 2px 3px rgb(22, 82, 240)",
          }}
        >
          Geo Locator
        </h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
        <CreateLobbyModal />
        <JoinLobbyModal />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          marginTop: "5px",
          alignItems: "center",
          gap: "10px",
          maxWidth: "60%",
        }}
      >
        <h2
          style={{
            fontFamily: "Montserrat",
            fontSize: "2em",
          }}
        >
          Geo Locator is a free to play Geoguessr clone.
        </h2>
        <p
          style={{
            fontFamily: "Montserrat",
            fontSize: "1.6em",
          }}
        >
          Geo Locator is an open-source and free to play alternative to the game
          Geoguessr. <br /> You can view the source code on the{" "}
          <a
            href="https://github.com/RasterCrow/Geo-Locator"
            target="__noBlank"
          >
            Github page
          </a>{" "}
          or you can follow{" "}
          <a
            href="https://github.com/RasterCrow/Geo-Locator/wiki"
            target="__noBlank"
          >
            this tutorial{" "}
          </a>{" "}
          on the wiki, for setting up a lobby and getting a Google API Key.
        </p>
      </div>
    </div>
  );
}
