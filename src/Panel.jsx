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
  AiFillGithub,
} from 'react-icons/ai';

import AppContext from './context';
import * as Contract from './Contracts';

import './Panel.css';

const networkMap = {
  42: 'kovan',
  97: 'binance-test',
  56: 'binance-main',
}
export default class Panel extends React.Component {
  static contextType = AppContext;

  connectToWallet () {
    const { ctx, setCtx } = this.context;

    ctx.ethers.provider.send('eth_requestAccounts')
    .then(async addrs => {
      const network = networkMap[(await ctx.ethers.provider.getNetwork()).chainId];
      const signer = ctx.ethers.provider.getSigner(addrs[0]);
      const contracts = Contract.initContracts({signer}, network);

      const ownCollectionsFilter = contracts.Zubiter.filters.CreateToken(addrs[0]);
      const ownCollections = (await contracts.Zubiter.queryFilter(ownCollectionsFilter)).map(evt => evt.args.token);

      setCtx({
        address: addrs[0],
        ethers: {
          signer,
          provider: ctx.ethers.provider
        },
        contracts,
        collections: ownCollections,
      });

      if (ownCollections.length) this.switchCollection(ownCollections[0]);
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

  switchCollection(addr) {
    const { ctx, setCollection } = this.context;
    const collectionContract = ctx.contracts.ZubiterClonableERC721.attach(addr);
    collectionContract.owner().then(addr => {
      if (addr.toLowerCase() === ctx.address.toLowerCase()) setCollection({ transferred: false });
    });
    setCollection({ address: addr, transferred: true });
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
                {ctx.collections.map((addr, idx) => 
                  <NavDropdown.Item key={idx} onClick={this.switchCollection.bind(this, addr)}>{addr}</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <LinkContainer to="/create">
                  <NavDropdown.Item><BsPlusCircle />Create</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <div className="divider"/>
              <LinkContainer exact to={`/dashboard`}>
                <Nav.Link><AiOutlineDashboard />Dashboard</Nav.Link>
              </LinkContainer>
              { collection.transferred ? '' : 
                <LinkContainer to={`/mint`}>
                  <Nav.Link><AiOutlineDollarCircle />Mint</Nav.Link>
                </LinkContainer>
              }
              <LinkContainer to={`/manage-tokens`}>
                <Nav.Link><BsCollection />Manage Tokens</Nav.Link>
              </LinkContainer>
              <LinkContainer to={`/setting`}>
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
              <NavDropdown
                title={collection.address ? 
                  window.localStorage.getItem(`collection-${collection.address}`) || collection.address
                  : 'Select Collection'
                }
              >
                {ctx.collections.map((addr, idx) => 
                  <NavDropdown.Item key={idx} onClick={this.switchCollection.bind(this, addr)}>{
                    window.localStorage.getItem(`collection-${addr}`) || addr  
                  }</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <LinkContainer to="/create">
                  <NavDropdown.Item><BsPlusCircle />Create</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <div className="divider"/>
              <LinkContainer exact to={`/dashboard`}>
                <Nav.Link><AiOutlineDashboard />Dashboard</Nav.Link>
              </LinkContainer>
              { collection.transferred ? '' : 
                <LinkContainer to={`/mint`}>
                  <Nav.Link><AiOutlineDollarCircle />Mint</Nav.Link>
                </LinkContainer>
              }
              <LinkContainer to={`/manage-tokens`}>
                <Nav.Link><BsCollection />Manage Tokens</Nav.Link>
              </LinkContainer>
              <LinkContainer to={`/setting`}>
                <Nav.Link><AiOutlineSetting />Setting</Nav.Link>
              </LinkContainer>
              <div className="divider" />
              <Nav.Link href="https://github.com/flyinglimao/zubiter-app" target="_blnak" rel="noreferrer" active={false}><AiFillGithub />GitHub</Nav.Link>
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
