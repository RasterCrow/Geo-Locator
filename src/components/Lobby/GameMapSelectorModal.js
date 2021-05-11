import React, { useState, useContext } from "react";

import { Button, Form, ButtonGroup, Modal } from "rsuite";
import GameModeMap from "../Lobby/GameModeMap";

export default function GameMapSelectorModal(props) {
  const [open, setOpen] = useState(false);
  const [mapSelectedId, setMapSelectedId] = useState(props.currentMap);
  const handleOpen = (open) => {
    setOpen(open);
  };

  const saveMapAndClose = () => {
    props.handleChangeMap(mapSelectedId);
    setOpen(false);
  };
  return (
    <>
      <Modal show={open} onHide={() => handleOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>Select Game Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off" fluid>
            <div style={{ width: "100%" }}>
              <ButtonGroup
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  maxHeight: "500px",
                  gap: "10px",
                  overflowY: "auto",
                }}
              >
                {Object.values(props.gamemodes).map((gamemode) => {
                  return (
                    <GameModeMap
                      selected={mapSelectedId}
                      title={gamemode.title}
                      image={gamemode.image}
                      available={gamemode.available}
                      id={gamemode.id}
                      key={gamemode.id}
                      selectGameMode={setMapSelectedId}
                    />
                  );
                })}
              </ButtonGroup>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="default" onClick={() => handleOpen(false)}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={() => saveMapAndClose()}>
            Select Map
          </Button>
        </Modal.Footer>
      </Modal>
      <Button color="yellow" onClick={() => handleOpen(true)}>
        Change Map
      </Button>
    </>
  );
}
