import React from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Pagination,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';

import './Extensions.css';

export default class Extensions extends React.Component {
  render () {
    return (
      <Container className="extensions">
        <h2>Extensions</h2>
        <Row>
          <Col xs="12" className="mt-2">
            <Card>
              <Card.Header>Installed Extensions</Card.Header>
              <Card.Body className="p-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Redeem</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button variant="danger">Remove</Button></td>
                    </tr>
                  </tbody>
                </Table>
                <Row className="justify-content-between px-3 pb-2">
                  <Col>Showing 1 to 1 of 1 extensions</Col>
                  <Col>
                    <Pagination className="justify-content-end">
                      <Pagination.First />
                      <Pagination.Item active>{1}</Pagination.Item>
                    </Pagination>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Form>
          <Form.Group controlId="add-extension">
              <Form.Label>Add Extensions</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Enter the Address of a Contract Implemented ZubiterExtension" />
                <InputGroup.Append>
                  <Button variant="outline-secondary">Submit</Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">Browser extensions from our <a href="#gp">GitHub Repo.</a></Form.Text>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}