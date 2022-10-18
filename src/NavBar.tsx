import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Routes, Route, Link } from "react-router-dom";


function NavBar() {
  return (
    <>
    <Navbar bg="light" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/signup">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/schedule">Home</Nav.Link>
          <Nav.Link as={Link} to="/">Link</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  </>
  );
}

export default NavBar;
