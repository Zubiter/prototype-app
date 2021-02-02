import React from 'react';

import {
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './Panel.css';

export default class Panel extends React.Component {

  render () {
    return (
      <Container fluid>
        <Navbar className="shadow-sm row" sticky="top" expand="lg" bg="white">
          <LinkContainer to="/">
            <Navbar.Brand>Zubiter</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="sm-top-navbar" />
          <Navbar.Collapse id="sm-top-navbar">
            <Nav className="mr-auto d-lg-none">
              <LinkContainer exact to="/">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/create">
                <Nav.Link>Create</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/manage">
                <Nav.Link>Manage</Nav.Link>
              </LinkContainer>
            </Nav>
            <Col className="text-lg-right px-0">
              <Button>Connect Wallet</Button>
            </Col>
          </Navbar.Collapse>
        </Navbar>
        <Row>
          <Col xs="3" md="2" className="d-none d-lg-block shadow sidenav sticky-top px-1">
            <Nav className="flex-column pt-2" variant="pills">
              <LinkContainer exact to="/">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/create">
                <Nav.Link>Create</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/manage">
                <Nav.Link>Manage</Nav.Link>
              </LinkContainer>
            </Nav>
          </Col>
          <Col xs="9" md="10">
            {this.props.children}
          </Col>
        </Row>
      </Container>
    );
  }
}
