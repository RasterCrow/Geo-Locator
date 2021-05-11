import React from "react";
import { Divider } from "rsuite";

export default function User({ user, hostId }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "auto",
          marginTop: "10px",
          marginBottom: "10px",
          marginLeft: "15px",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "1.2em", fontFamily: "Montserrat" }}>
          {user.username}
        </p>
        {hostId == user.uid && (
          <p
            style={{
              backgroundColor: "red",
              borderRadius: "5px",
              padding: "5px",
              width: "50px",
              textAlign: "center",
              marginTop: "0px",
              marginRight: "10px",
            }}
          >
            Host
          </p>
        )}
      </div>
      <Divider style={{ margin: "0" }} />
    </>
  );
}
