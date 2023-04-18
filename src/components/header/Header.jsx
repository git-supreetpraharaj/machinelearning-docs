import React, { useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = ({ query, updateQuery }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    updateQuery(searchTerm);
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Link className="navbar-brand" to="/">
          Machine Learning
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex me-auto" onSubmit={handleOnSubmit}>
            <Button className="me-2" variant="outline-success" type="submit">
              Search
            </Button>
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
          <Nav>
            <Nav.Link href="#home">Home</Nav.Link>
            <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
