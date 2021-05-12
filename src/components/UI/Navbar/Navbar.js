import React from "react";
import { Navbar, Nav, Icon, Dropdown } from "rsuite";
export default function CustomNavbar(props) {
  return (
    <Navbar
      style={{
        height: "60px",
        width: "100%",
      }}
    >
      <Navbar.Body>
        <Nav>
          <Nav.Item href="/" eventKey="1">
            <img
              style={{ width: "auto", height: "100%" }}
              src="/assets/logo.svg"
              alt="Site Logo"
            />
          </Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}
