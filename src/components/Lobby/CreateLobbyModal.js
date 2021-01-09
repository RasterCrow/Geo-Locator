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
import { createLobby } from "../../providers/GameProvider";
import { AuthContext } from "../../providers/Auth";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function checkData(username, timeLimit, rounds) {
  if (username == undefined || username.length < 2 || username.length > 25) {
    Notification["warning"]({
      title: "Warning",
      description: "Username must be between 2 and 25 letters.",
    });
    return false;
  }

  if (rounds < 2 || rounds == undefined || rounds > 20) {
    Notification["warning"]({
      title: "Warning",
      description: "Rounds must be between 2 and 20.",
    });
    return false;
  }
  if (timeLimit < 1 || timeLimit == undefined || timeLimit > 60) {
    Notification["warning"]({
      title: "Warning",
      description: "Time limit must be between 1 and 60 minutes.",
    });
    return false;
  }
  return true;
}

export default function CreateLobbyModal(props) {
  const { createUser } = useContext(AuthContext);
  const history = useHistory();

  const [timeLimit, setTimeLimit] = useState(60);
  const [open, setOpen] = useState(false);
  const [rounds, setRounds] = useState(5);
  const [username, setUsername] = useState("gando");

  const handleOpen = (open) => {
    setOpen(open);
  };

  const handleCreateLobby = (evt) => {
    evt.preventDefault();
    //create user
    //create random ID
    let ID = uuidv4();
    //save user on context
    if (checkData(username, timeLimit / 60, rounds)) {
      createUser(username, ID).then((user) => {
        //create lobby
        createLobby(user, parseInt(rounds), parseInt(timeLimit)).then((res) => {
          history.push(`/lobby/${res}`);
        });
      });
    }
  };

  return (
    <div>
      <Modal show={open} onHide={() => handleOpen(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Crea Lobby</Modal.Title>
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
              <ControlLabel>Rounds</ControlLabel>
              <FormControl
                name="rounds"
                type="number"
                value={rounds}
                min={2}
                max={20}
                step={1}
                onChange={(e) => setRounds(e)}
              />
              <HelpBlock>Required</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Time Limit ( min )</ControlLabel>
              <FormControl
                name="time_limit"
                type="number"
                value={timeLimit / 60}
                onChange={(e) => setTimeLimit(e * 60)}
                min={1}
                max={10}
                step={1}
              />
              <HelpBlock>Required</HelpBlock>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleCreateLobby}>
            Create
          </Button>
          <Button onClick={() => handleOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={() => handleOpen(true)}>Create Lobby</Button>
    </div>
  );
}
