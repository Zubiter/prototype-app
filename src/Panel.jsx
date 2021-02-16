import React from 'react';

import {
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Button,
  NavDropdown,
  Alert,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
  BsPlusCircle,
  BsCollection,
} from 'react-icons/bs';
import {
  AiOutlineDollarCircle,
  AiOutlineDashboard,
  AiOutlineSetting,
} from 'react-icons/ai';

import AppContext from './context';
import * as Contract from './Contracts';

import './Panel.css';

export default class Panel extends React.Component {
  static contextType = AppContext;

  connectToWallet () {
    const { ctx, setCtx, setCollection } = this.context;

    ctx.ethers.provider.send('eth_requestAccounts')
    .then(async addrs => {
      const signer = ctx.ethers.provider.getSigner(addrs[0]);
      const contracts = Contract.initContracts({signer});

      const ownTokensFilter = contracts.Zubiter.filters.CreateToken(addrs[0]);
      const ownTokens = (await contracts.Zubiter.queryFilter(ownTokensFilter)).map(evt => evt.args.token);

      setCtx({
        address: addrs[0],
        ethers: {
          signer,
          provider: ctx.ethers.provider
        },
        contracts,
        collections: ownTokens,
      })
      setCollection({address: ownTokens[0]})
    })
    .catch(err => {
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'danger',
        content: 'Failed to Connect to wallet, error message: ' + err.message,
      }]})
      console.error(err)
    })
  }

  closeAlert (key) {
    const { ctx, setCtx } = this.context;
    setCtx({ alerts: ctx.alerts.filter((_, index) => index !== key)})
  }

  render () {
    const { ctx, collection } = this.context;
    return (
      <Container fluid>
        <Navbar className="shadow-sm row" sticky="top" expand="lg" bg="white">
          <LinkContainer to="/">
            <Navbar.Brand>Zubiter</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="sm-top-navbar" />
          <Navbar.Collapse id="sm-top-navbar">
            <Nav className="mr-auto d-lg-none" variant="pills">
              <NavDropdown title={collection.address || 'Select Collection'}>
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
              <LinkContainer to="/1/mint">
                <Nav.Link><AiOutlineDollarCircle />Mint</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/manage-tokens">
                <Nav.Link><BsCollection />Manage Tokens</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/setting">
                <Nav.Link><AiOutlineSetting />Setting</Nav.Link>
              </LinkContainer>
              {/* <LinkContainer to="/1/extensions">
                <Nav.Link><BsPuzzle />Extensions</Nav.Link>
              </LinkContainer>
              <div className="divider" />
              <LinkContainer to="/1/:extension">
                <Nav.Link><BsPuzzle />Redeem</Nav.Link>
              </LinkContainer> */}
            </Nav>
            <Col className="text-lg-right px-0">
              { ctx.address
                ? <span>{ctx.address}</span>
                : <Button onClick={this.connectToWallet.bind(this)}>Connect Wallet</Button>
              }
            </Col>
          </Navbar.Collapse>
        </Navbar>
        <Row>
          <Col md="2" className="d-none d-lg-block shadow sidenav sticky-top px-1">
            <Nav className="flex-column pt-2" variant="pills">
              <NavDropdown title={collection.address || 'Select Collection'}>
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
              <LinkContainer to="/1/mint">
                <Nav.Link><AiOutlineDollarCircle />Mint</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/manage-tokens">
                <Nav.Link><BsCollection />Manage Tokens</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/1/setting">
                <Nav.Link><AiOutlineSetting />Setting</Nav.Link>
              </LinkContainer>
              {/* <LinkContainer to="/1/extensions">
                <Nav.Link><BsPuzzle />Extensions</Nav.Link>
              </LinkContainer>
              <div className="divider" />
              <LinkContainer to="/1/redeem">
                <Nav.Link><BsPuzzle />Redeem</Nav.Link>
              </LinkContainer> */}
            </Nav>
          </Col>
          <Col xs="12" lg="10" className="page">
            { ctx.alerts.map((alert, index) => 
              <Alert key={index} variant={alert.variant} dismissible onClose={this.closeAlert.bind(this, index)}>{alert.content}</Alert>
            )}
            {this.props.children}
          </Col>
        </Row>
      </Container>
    );
  }
}
