import React from 'react';

import {
  Container,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';

import './Create.css';

export default class Create extends React.Component {
  constructor (props) {
    super(props);
    this.state = { step: 1 };
  }

  goStep (step) {
    return () => {
      this.setState({step})
    }
  }

  render () {
    return (
      <Container>
        <h2 className="page-title">Create a New Collection</h2>
        <section className={this.state.step === 1 ? '' : 'd-none'}>
          <h3>Step 1. Setup Netlify</h3>
          <small className="text-muted page-description">Assets for NFTs will be upload to netlify, you can upload them to IPFS with Pinata in Setting.</small>
          <Form>
            <Form.Group controlId="netlify-access-token">
              <Form.Label>Netlify Access Token</Form.Label>
              <Form.Control type="text" placeholder="Enter Access Token" required />
              <Form.Text className="text-muted">You can obtain it from <a href="https://app.netlify.com/user/applications" target="_blank" rel="noreferrer">here</a>. Check out <a href="#doc">document</a> if you need detailed instructions.</Form.Text>
            </Form.Group>
            <Form.Group controlId="netlify-site-name">
              <Form.Label>Netlify Site Name</Form.Label>
              <Form.Control type="text" placeholder="(Optional) Enter Site Name, will be auto-generated if not providing" />
            </Form.Group>
            <Button variant="primary" type="button" onClick={this.goStep(2)}>
              Next
            </Button>
          </Form>
        </section>
        <section ref="step-2" className={this.state.step === 2 ? '' : 'd-none'}>
          <h3>Step 2. Setup Collection</h3>
          <Form>
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
            </Button>&nbsp;
            <Button variant="outline-primary" type="button" onClick={this.goStep(1)}>
              Back
            </Button>
          </Form>
        </section>
      </Container>
    );
  }
}