import React from 'react';

import {
  Container,
  Form,
  InputGroup,
  Button,
  Row,
} from 'react-bootstrap';

import './Setting.css';

export default class Setting extends React.Component {
  render () {
    return (
      <Container className="setting">
        <h2>Setting</h2>
        <p className="text-muted">If no NFT and data will be minted or updated in this collection, migrate it to IPFS and renounce ownership might be a good idea.</p>
        <h4>Collection Setting</h4>
        <Form className="mb-3">
          <Form.Group controlId="collection-name">
            <Form.Label>Collection Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Collection Name, such as &quot;My Awesome NFTs&quot;" required />
          </Form.Group>
          <Form.Group controlId="collection-symbol">
            <Form.Label>Collection Symbol</Form.Label>
            <Form.Control type="text" placeholder="Enter Collection Symbol, such as &quot;MAN&quot;" required />
          </Form.Group>
          <Form.Group controlId="collection-description">
            <Form.Label>Collection Description</Form.Label>
            <Form.Control as="textarea" placeholder="(Optional) Enter Collection Description" />
          </Form.Group>
          <Form.Group controlId="collection-external-link">
            <Form.Label>Collection Link</Form.Label>
            <Form.Control type="text" placeholder="(Optional) Enter Collection Link" />
          </Form.Group>
          <Form.Group controlId="collection-image">
            <Form.Label>Collection Image</Form.Label>
            <InputGroup>
              <Form.Control type="text" placeholder="(Optional) Enter Collection Image URL or Upload File" />
              <InputGroup.Append>
                <Button variant="outline-secondary">Select File</Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
          <Button variant="primary" type="button">
            Submit
          </Button>
        </Form>
        <h4>File Provider Setting</h4>
        <Form className="mb-3">
          <Form.Group controlId="netlify-access-token">
            <Form.Label>Netlify Access Token</Form.Label>
            <Form.Control type="text" placeholder="Enter Access Token" required />
            <Form.Text className="text-muted">You can obtain it from <a href="https://app.netlify.com/user/applications" target="_blank" rel="noreferrer">here</a>. Check out <a href="#doc">document</a> if you need detailed instructions.</Form.Text>
          </Form.Group>
          <Form.Group controlId="netlify-site-name">
            <Form.Label>Netlify Site Name</Form.Label>
            <Form.Control type="text" placeholder="(Optional) Enter Site Name, will be auto-generated if not providing" />
          </Form.Group>
          <Button variant="primary" type="button">
            Submit
          </Button>&nbsp;
          <Button variant="outline-primary" type="button">
            Migrate to IPFS
          </Button>
        </Form>
        <Container className="p-0">
          <h4>Danger Zone</h4>
          <Row className="m-0">
            <Button variant="danger" type="button">
              Renounce Collection
            </Button>&nbsp;
            <Button variant="outline-danger" type="button">
              Transfer Ownership
            </Button>
          </Row>
        </Container>
      </Container>
    );
  }
}