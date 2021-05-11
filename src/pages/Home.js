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
          minHeight: "300px",
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
          width: "80%",
          maxWidth: "1000px",
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
            fontSize: "1.4em",
          }}
        >
          Geo Locator is an open-source and free to play alternative to the game
          Geoguessr.
          <br />
          To play you need a Google api key, which you can either create by
          yourself following{" "}
          <a
            href="https://github.com/RasterCrow/Geo-Locator/wiki"
            target="__noBlank"
          >
            this tutorial{" "}
          </a>{" "}
          or you can use the one I provide, which has daily limits on the number
          of games you can play.
          <br /> You can view the source code on the{" "}
          <a
            href="https://github.com/RasterCrow/Geo-Locator"
            target="__noBlank"
          >
            Github page
          </a>
          , and if you want you can buy me a{" "}
          <a href="https://www.buymeacoffee.com/rastercrow" target="__noBlank">
            slice of pizza 🍕
          </a>{" "}
          to support the website.
        </p>
      </div>
      <div>
        <hr style={{ width: "70%", color: "white" }} />
        <p
          style={{
            textAlign: "center",
            fontSize: "1.3em",
            marginBottom: "10px",
            marginTop: "5px",
          }}
        >
          Made with 💖 by{" "}
          <a href="https://rastercrow.me/" target="__noBlank">
            {" "}
            RasterCrow{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
