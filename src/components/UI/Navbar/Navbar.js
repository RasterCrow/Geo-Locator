import React from "react";
import { Navbar, Nav, Icon, Dropdown } from "rsuite";
export default function CustomNavbar(props) {
  return (

    <Navbar style={{
      width: "100%",
      height: "5vh",
    }}   >
      <Navbar.Body>
        <Nav>
          <Nav.Item href="/" eventKey="1" >
            <img
              style={{ width: "auto", height: "100%" }}
              src="/assets/logo.svg"
              alt="Site Logo"

            />
          </Nav.Item>
          <Nav.Item href="/account" eventKey="2" icon={<Icon icon="group" />}>
            Profile
            </Nav.Item>
          <Nav.Item href="/lobby" eventKey="3" icon={<Icon icon="magic" />}>
            Lobby
            </Nav.Item>
          {props.authenticated ? (
            <Nav.Item href="/" eventKey="4" icon={<Icon icon="magic" />}>
              Sign Out
            </Nav.Item>
          ) : (
              <Nav.Item href="/login" eventKey="4" icon={<Icon icon="magic" />}>
                Sign In
              </Nav.Item>
            )}
          <Dropdown
            eventKey="5"
            title="Settings"
            icon={<Icon icon="gear-circle" />}
          >
            <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
            <Dropdown.Item eventKey="4-2">Channels</Dropdown.Item>
            <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
            <Dropdown.Menu eventKey="4-5" title="Custom Action">
              <Dropdown.Item eventKey="4-5-1">Action Name</Dropdown.Item>
              <Dropdown.Item eventKey="4-5-2">Action Params</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}
