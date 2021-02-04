import React from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Pagination,
} from 'react-bootstrap';

import './Dashboard.css';

export default class Dashboard extends React.Component {
  render () {
    return (
      <Container className="dashboard">
        <h2>Dashboard</h2>
        <Row>
          <Col xs="12" sm="6" md="3" lg="3">
            <Card>
              <Card.Body>
                <Card.Title>Total Supply</Card.Title>
                <Card.Text>10,000</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="3" lg="3">
            <Card>
              <Card.Body>
                <Card.Title>Total Owners</Card.Title>
                <Card.Text>9,132</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="3" lg="3">
            <Card>
              <Card.Body>
                <Card.Title>Total Transactions</Card.Title>
                <Card.Text>12,541</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="3" lg="3">
            <Card>
              <Card.Body>
                <Card.Title>Yesterday Transactions</Card.Title>
                <Card.Text>631</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="mt-4">
            <Card>
              <Card.Header>Transactions</Card.Header>
              <Card.Body className="p-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Token ID</th>
                      <th>From</th>
                      <th>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2021-2-5 01:03:20</td>
                      <td>186</td>
                      <td>0xacc2d82e38ba5139461b3284039be81775c5e89e</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>2021-2-5 01:03:20</td>
                      <td>186</td>
                      <td>0xacc2d82e38ba5139461b3284039be81775c5e89e</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>2021-2-5 01:03:20</td>
                      <td>186</td>
                      <td>0xacc2d82e38ba5139461b3284039be81775c5e89e</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>2021-2-5 01:03:20</td>
                      <td>186</td>
                      <td>0xacc2d82e38ba5139461b3284039be81775c5e89e</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                    </tr>
                    <tr>
                      <td>2021-2-5 01:03:20</td>
                      <td>186</td>
                      <td>0xacc2d82e38ba5139461b3284039be81775c5e89e</td>
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
          </Col>
          <Col xs="12" className="mt-4">
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
          </Col>
        </Row>
      </Container>
    );
  }
}