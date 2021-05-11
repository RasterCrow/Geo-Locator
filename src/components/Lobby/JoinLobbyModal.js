import React, { useState, useContext } from "react";

import {
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Modal,
  Notification,
} from "rsuite";
import { useHistory } from "react-router-dom";
import {
  joinLobby,
  checkLobbyExist,
  getLobbyAPIKey,
  GameContext,
} from "../../providers/GameProvider";
import { AuthContext } from "../../providers/Auth";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function checkData(username, lobbyId) {
  if (username == undefined || username.length < 2 || username.length > 25) {
    Notification["warning"]({
      title: "Warning",
      description: "Username must be between 2 and 25 letters.",
    });
    return false;
  }

  if (lobbyId.length < 0 || lobbyId == undefined || lobbyId == "") {
    console.log("error");
    Notification["warning"]({
      title: "Warning",
      description: "Insert a Lobby ID",
    });
    return false;
  }
  return true;
}

export default function JoinLobbyModal() {
  const { createUser } = useContext(AuthContext);

  const { setCustomAPIKey } = useContext(GameContext);
  const history = useHistory();

  const [lobbyId, setLobbyId] = useState("");
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const handleOpen = (open) => {
    setOpen(open);
  };
  const handleJoinLobby = (evt) => {
    evt.preventDefault();
    //create user
    if (checkData(username, lobbyId)) {
      //create random ID
      let ID = uuidv4();
      checkLobbyExist(lobbyId).then((res) => {
        if (res == 1) {
          getLobbyAPIKey(lobbyId).then((res) => {
            setCustomAPIKey(res);
            createUser(username, ID).then((user) => {
              //let user join lobby
              joinLobby(user, lobbyId).then((user) => {
                history.push(`/lobby/${lobbyId}`);
              });
            });
          });
        } else if (res == 2) {
          Notification["error"]({
            title: "Warning",
            description: "Game in progress, can't join now.",
          });
        } else {
          Notification["error"]({
            title: "Error",
            description: "Lobby doesn't exists.",
          });
        }
      });
    }
  };

  return (
    <div>
      <Modal show={open} onHide={() => handleOpen(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Join Lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off" fluid>
            <FormGroup>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                name="username"
                type="text"
                value={username}
                min={2}
                max={25}
                onChange={(e) => setUsername(e)}
              />
              <HelpBlock>Required</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Lobby ID</ControlLabel>
              <FormControl
                name="lobbyId"
                type="text"
                value={lobbyId}
                min={5}
                max={25}
                onChange={(e) => setLobbyId(e)}
              />
              <HelpBlock>Required</HelpBlock>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleJoinLobby}>
            Join
          </Button>
          <Button onClick={() => handleOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Button style={{ fontSize: "1.3em" }} onClick={() => handleOpen(true)}>
        Join Lobby
      </Button>
    </div>
  );
}
