import React from 'react';

import {
  Container,
  Button,
  Form,
  InputGroup,
  Accordion,
} from 'react-bootstrap';

import './Mint.css';

export default class Mint extends React.Component {
  
  render () {
    return (
      <Container className="mint">
        <h2>Mint</h2>
        <p className="text-muted">Metadata is expected to be immutable after minted, but you still can update them later. Files uploaded will be stored to Netlify site.</p>
        <Form>
          <Form.Group controlId="token-id">
            <Form.Label>Token ID</Form.Label>
            <Form.Control type="number" placeholder="Determin Token ID" disabled required value="1"/>
            <Form.Text className="text-muted">It's preset according to the collection state. If you need to set it by youself, <a href="#doc">click here</a>.</Form.Text>
          </Form.Group>
          <Form.Group controlId="mint-to">
            <Form.Label>Mint to</Form.Label>
            <InputGroup>
              <Form.Control type="text" placeholder="An Ethereum Address, start with 0x" required />
              <InputGroup.Append>
                <Button variant="outline-secondary">Use Me</Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="token-name">
            <Form.Label>Token Name</Form.Label>
            <Form.Control type="text" placeholder="An Awesome Cat" required />
          </Form.Group>
          <Form.Group controlId="token-description">
            <Form.Label>Token Description</Form.Label>
            <Form.Control as="textarea" placeholder="A cat with colorful fur." required />
          </Form.Group>
          <Form.Group controlId="token-image">
            <Form.Label>Token Image</Form.Label>
            <InputGroup>
              <Form.Control type="text" placeholder="Paste URL or Upload" required />
              <InputGroup.Append>
                <Button variant="outline-secondary">Select File</Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
          <Accordion>
            <Accordion.Toggle as={Button} eventKey="0" className="mb-3 float-right" size="sm" variant="secondary">Advanced Fields</Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <>
                <div className="advanced-fields-top"></div>
                <Form.Group controlId="token-background-color">
                  <Form.Label>Token Background Color</Form.Label>
                  <Form.Control type="text" placeholder="#fff" />
                </Form.Group>
                <Form.Group controlId="token-external-url">
                  <Form.Label>Token External URL</Form.Label>
                  <Form.Control type="text" placeholder="https://zubiter.limaois.me/tokens/0xaddroftoken/tokenid" />
                </Form.Group>
                <Form.Group controlId="token-animation">
                  <Form.Label>Token Animation</Form.Label>
                  <InputGroup>
                    <Form.Control type="text" placeholder="Paste URL or Upload" required />
                    <InputGroup.Append>
                      <Button variant="outline-secondary">Select File</Button>
                    </InputGroup.Append>
                  </InputGroup>
                  <Form.Text className="text-muted">A URL to a multi-media attachment for the item.</Form.Text>
                </Form.Group>
                <Form.Group controlId="token-youtube-url">
                  <Form.Label>Token YouTube URL</Form.Label>
                  <Form.Control type="text" placeholder="https://www.youtube.com/watch?v=0EX3tQWswj0" />
                  <Form.Text className="text-muted">A URL to a YouTube video.</Form.Text>
                </Form.Group>
                <Form.Group controlId="token-attributes">
                  <Form.Label>Token Attributes</Form.Label>
                  <Form.Control as="textarea" placeholder="[{&quot;key&quot;:&quot;value&quot;}]" />
                </Form.Group>
              </>
            </Accordion.Collapse>
          </Accordion>
          <Button variant="primary" type="button">
            Mint
          </Button>
        </Form>
      </Container>
    );
  }
}