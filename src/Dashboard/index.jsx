import React from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Pagination,
} from 'react-bootstrap';

import AppContext from '../context';

import './Dashboard.css';

export default class Dashboard extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      totalSupply: null,
      totalTxs: null,
      txs: [],
      transactionPage: 1,
      tokenOwnerPage: 1,
      showingAddress: null
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  async componentDidUpdate() {
    const { ctx, collection } = this.context;
    if (this.state.showingAddress !== collection.address) {
      const contract = ctx.contracts.ZubiterClonableERC721.attach(collection.address);
      const transferTxFilter = contract.filters.Transfer(null);
      const txs = (await contract.queryFilter(transferTxFilter));

      this.setState({
        totalSupply: (await contract.totalSupply()).toNumber(),
        totalTxs: txs.length,
        txs,
        showingAddress: collection.address,
      });
    }
  }

  render () {
    const { collection } = this.context;
    return (
      <Container className="dashboard">
        <h2>Dashboard</h2>
        <Row>
          <Col xs="12" sm="12" md="6" lg="6" className="mb-3 mb-md-0">
            <Card>
              <Card.Body>
                <Card.Title>Collection Address</Card.Title>
                <Card.Text>{ collection.address || 'Loading...' }</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="3" lg="3" className="mb-3 mb-md-0">
            <Card>
              <Card.Body>
                <Card.Title>Total Supply</Card.Title>
                <Card.Text>{ this.state.totalSupply === null ? 'Loading...' : this.state.totalSupply.toLocaleString() }</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col xs="12" sm="6" md="3" lg="3">
            <Card>
              <Card.Body>
                <Card.Title>Total Owners</Card.Title>
                <Card.Text>9,132</Card.Text>
              </Card.Body>
            </Card>
          </Col> */}
          <Col xs="12" sm="6" md="3" lg="3">
            <Card>
              <Card.Body>
                <Card.Title>Total Transactions</Card.Title>
                <Card.Text>{ this.state.totalTxs === null ? 'Loading...' : this.state.totalTxs.toLocaleString() }</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col xs="12" sm="12" md="4" lg="4">
            <Card>
              <Card.Body>
                <Card.Title>Yesterday Transactions</Card.Title>
                <Card.Text>{ this.state.yesterdayTxs === null ? 'Loading...' : this.state.yesterdayTxs.toLocaleString() }</Card.Text>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
        <Row>
          <Col xs="12" className="mt-4">
            <Card>
              <Card.Header>Transactions</Card.Header>
              <Card.Body className="p-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Block Number</th>
                      <th>Token ID</th>
                      <th>From</th>
                      <th>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.txs.slice((this.state.transactionPage - 1) * 5, this.state.transactionPage* 5).map(tx => (
                      <tr key={tx.args.tokenId.toNumber()}>
                        <td>{tx.blockNumber}</td>
                        <td>{tx.args.tokenId.toNumber()}</td>
                        <td>{tx.args.from.toString()}</td>
                        <td>{tx.args.to.toString()}</td>
                      </tr>
                    )) }
                  </tbody>
                </Table>
                <Row className="justify-content-between px-3 pb-2">
                  <Col>Showing {this.state.transactionPage * 5 - 4} to {this.state.transactionPage * 5} of {this.state.totalTxs} transactions</Col>
                  <Col>
                    <Pagination className="justify-content-end">
                      { this.state.transactionPage !== 1 ? 
                      <>
                        <Pagination.First onClick={() => this.setState({transactionPage: 1})}/>
                        <Pagination.Prev onClick={() => this.setState(prev => ({transactionPage: Math.max(1, prev.transactionPage - 1)}))} />
                      </>
                      : ''}
                      <Pagination.Item active>{this.state.transactionPage}</Pagination.Item>
                      { this.state.transactionPage !== Math.ceil(this.state.totalTxs / 5) ? 
                      <>
                        <Pagination.Next onClick={() => this.setState(prev => ({transactionPage: Math.min(Math.ceil(this.state.totalTxs / 5), prev.transactionPage + 1)}))} />
                        <Pagination.Last  onClick={() => this.setState({transactionPage: Math.ceil(this.state.totalTxs / 5)})}/>
                      </>
                      : ''}
                    </Pagination>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col xs="12" className="mt-4">
            <Card>
              <Card.Header>Token Owners</Card.Header>
              <Card.Body className="p-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Token ID</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>186</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>186</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>186</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>186</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>186</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>186</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                  </tbody>
                </Table>
                <Row className="justify-content-between px-3 pb-2">
                  <Col>Showing 1 to 5 of 12,541 transactions</Col>
                  <Col>
                    <Pagination className="justify-content-end">
                      <Pagination.First />
                      <Pagination.Prev />
                      <Pagination.Item active>{1}</Pagination.Item>
                      <Pagination.Item>{2}</Pagination.Item>
                      <Pagination.Item>{3}</Pagination.Item>
                      <Pagination.Next />
                      <Pagination.Last />
                    </Pagination>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
    );
  }
}