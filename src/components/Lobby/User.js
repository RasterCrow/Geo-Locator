import React from "react";
import { Divider } from "rsuite";

export default function User({ user }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "auto",
          marginTop: "10px",
          marginBottom: "10px",
          marginLeft: "15px",
        }}
      >
        <p style={{ fontSize: "1.2em", fontFamily: "Montserrat" }}>
          {user.username}
        </p>
      </div>
      <Divider style={{ margin: "0" }} />
    </>
  );
}
