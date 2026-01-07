import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-custom">
          <Headphones size={28} className="me-2" />
          Listen with Abi Podcast
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            
            <Nav.Link as={Link} to="/spotify-fire" className="nav-link-custom">
              Spotify Fire
            </Nav.Link>
            <Nav.Link as={Link} to="/thoughts" className="nav-link-custom">
              Thoughts
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;