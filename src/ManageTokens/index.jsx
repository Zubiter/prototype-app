import React from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Pagination,
  Button,
} from 'react-bootstrap';

import './ManageTokens.css';

export default class ManageTokens extends React.Component {
  render () {
    return (
      <Container className="manage-tokens">
        <h2>Manage Tokens</h2>
        <Row>
          <Col xs="12" className="mt-2">
            <Card>
              <Card.Header>Tokens</Card.Header>
              <Card.Body className="p-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Token ID</th>
                      <th>Owner</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>177</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>178</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>179</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>180</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>181</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>182</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>183</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>184</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>185</td>
                      <td>0x203ba1df1d1d322a421f070f580fbc4051a7921d</td>
                      <td><Button>Edit</Button></td>
                    </tr>
                    <tr>
                      <td>186</td>
                      <td><Button>Mint it</Button></td>
                      <td><Button>Edit</Button></td>
                    </tr>
                  </tbody>
                </Table>
                <Row className="justify-content-between px-3 pb-2">
                  <Col>Showing 1 to 10 of 12,541 tokens</Col>
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