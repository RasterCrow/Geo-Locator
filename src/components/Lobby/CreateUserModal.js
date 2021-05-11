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
import { AuthContext } from "../../providers/Auth";
import {
  joinLobby,
  checkLobbyExist,
  getLobbyAPIKey,
  GameContext,
} from "../../providers/GameProvider";
import { useHistory } from "react-router-dom";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function checkData(username) {
  if (username == undefined || username.length < 2 || username.length > 25) {
    Notification["warning"]({
      title: "Warning",
      description: "Username must be between 2 and 25 letters.",
    });
    return false;
  }
  return true;
}

export default function CreateUserModal(props) {
  const { createUser } = useContext(AuthContext);

  const { setCustomAPIKey } = useContext(GameContext);
  const history = useHistory();
  const [open, setOpen] = useState(true);

  const [username, setUsername] = useState("");

  const handleCreateUser = (evt) => {
    evt.preventDefault();
    //create user
    //create random ID
    if (checkData(username)) {
      let ID = uuidv4();
      //save user on context

      checkLobbyExist(props.lobbyId).then((res) => {
        if (res == 1) {
          getLobbyAPIKey(props.lobbyId).then((res) => {
            setCustomAPIKey(res);
            createUser(username, ID).then((user) => {
              //let user join lobby
              joinLobby(user, props.lobbyId);
            });
          });
        } else if (res == 2) {
          Notification["error"]({
            title: "Warning",
            description:
              "Game in progress, can't join now. You'll now be redirected.",
          });
          setTimeout(() => {
            history.push(`/`);
          }, 1500);
        } else {
          Notification["error"]({
            title: "Error",
            description: "Lobby doesn't exists. You'll now be redirected.",
          });
          setTimeout(() => {
            history.push(`/`);
          }, 1500);
        }
      });
    }
  };

  return (
    <Modal show={open} onHide={() => history.push(`/`)} size="xs">
      <Modal.Header>
        <Modal.Title>Choose Name</Modal.Title>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={handleCreateUser}>
          Choose Name
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
