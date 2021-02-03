import React from 'react';

import {
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Button,
  NavDropdown,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
  BsPlusCircle,
  BsPuzzle,
} from 'react-icons/bs';
import {
  AiOutlineDollarCircle,
  AiOutlineDashboard,
  AiOutlineBarChart,
  AiOutlineSetting,
} from 'react-icons/ai';

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
            <Nav className="mr-auto d-lg-none" variant="pills">
              <NavDropdown title="Select Collection">
                <NavDropdown.Item>Collection 1</NavDropdown.Item>
                <NavDropdown.Divider />
                <LinkContainer to="/create">
                  <NavDropdown.Item><BsPlusCircle />Create</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <div className="divider"/>
              <LinkContainer to="/1/dashboard">
                <Nav.Link><AiOutlineDashboard />Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/events">
                <Nav.Link><AiOutlineBarChart />Events</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/mint">
                <Nav.Link><AiOutlineDollarCircle />Mint</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/setting">
                <Nav.Link><AiOutlineSetting />Setting</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/extensions">
                <Nav.Link><BsPuzzle />Extensions</Nav.Link>
              </LinkContainer>
              <div className="divider" />
              <LinkContainer to="/1/:extension">
                <Nav.Link><BsPuzzle />Redeem</Nav.Link>
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
              <NavDropdown title="Select Collection">
                <NavDropdown.Item>Collection 1</NavDropdown.Item>
                <NavDropdown.Divider />
                <LinkContainer to="/create">
                  <NavDropdown.Item><BsPlusCircle />Create</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <div className="divider"/>
              <LinkContainer exact to="/1/dashboard">
                <Nav.Link><AiOutlineDashboard />Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/events">
                <Nav.Link><AiOutlineBarChart />Events</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/mint">
                <Nav.Link><AiOutlineDollarCircle />Mint</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/setting">
                <Nav.Link><AiOutlineSetting />Setting</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/extensions">
                <Nav.Link><BsPuzzle />Extensions</Nav.Link>
              </LinkContainer>
              <div className="divider" />
              <LinkContainer to="/1/redeem">
                <Nav.Link><BsPuzzle />Redeem</Nav.Link>
              </LinkContainer>
            </Nav>
          </Col>
          <Col xs="9" md="10" className="page">
            {this.props.children}
          </Col>
        </Row>
      </Container>
    );
  }
}
