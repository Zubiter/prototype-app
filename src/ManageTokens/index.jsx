import React, { useState, useContext, useEffect, useRef } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Pagination,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Form,
  Accordion,
} from 'react-bootstrap';
import { Formik } from 'formik';

import AppContext from '../context';

import fs from '../fs';

import './ManageTokens.css';

function Token (props) {
  const [ ownerAddress, setOwnerAddress ] = useState('Loading');
  const [ mintTo, setMintTo ] = useState('');
  const [ minting, setMinting ] = useState(false);
  const { ctx, collection, setCtx } = useContext(AppContext);

  const contract = ctx.contracts.ZubiterClonableERC721.attach(collection.address);
  useEffect(() => {
    contract.ownerOf(props.tokenId)
    .then(owner => {
      setOwnerAddress(owner.toString());
    })
    .catch(() => {
      setOwnerAddress(null);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  function sendMintTx(mintTo) {
    setOwnerAddress('Minting...');
    setMinting(false);
    contract['mint(address,uint256)'](mintTo, props.tokenId)
    .then(tx => {
      tx.wait().then(() => {
        setOwnerAddress(mintTo);
      });
    })
    .catch(err => {
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'danger',
        content: 'Failed to mint, error message: ' + err.message,
      }]});
      setOwnerAddress(null);
    })
  }

  return (
    <tr>
      <td>{props.tokenId}</td>
      <td>{ownerAddress || (
        minting ? 
          <InputGroup>
            <FormControl value={mintTo} onChange={evt => setMintTo(evt.target.value)} type="text" placeholder="An Ethereum Address, start with 0x" />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={() => setMintTo(ctx.address)}>Use Me</Button>
              <Button variant="outline-secondary" onClick={() => sendMintTx(mintTo)}>Mint</Button>
            </InputGroup.Append>
          </InputGroup>
          : <Button variant="primary" onClick={() => setMinting(true)} disabled={collection.transferred}>Mint</Button>
      )}</td>
      <td><Button variant="primary" onClick={() => props.showEditModal(props.tokenId)}>Edit</Button></td>
    </tr>
  );
}

function EditModal (props) {
  const { collection } = useContext(AppContext);
  const [ form, setForm ] = useState({
    'token-name': '',
    'token-description': '',
    'token-image': '',
    'token-background-color': '',
    'token-external-url': '',
    'token-animation': '',
    'token-youtube-url': '',
    'token-attributes': '',
  });
  const imageFileInput = useRef(null);
  const aniFileInput = useRef(null);

  useEffect(() => {
    let unmount = false;
    fs.readFile(`/${collection.address}/${props.tokenId}`, (err, content) => {
      if (err) throw err;

      let data;
      try {
        data = JSON.parse(content);
      } catch (_) {
        data = {};
      }

      if (!unmount) setForm({
        'token-name': data.name || '',
        'token-description': data.description || '',
        'token-image': data.image || '',
        'token-background-color': data.background_color || '',
        'token-external-url': data.external_url || '',
        'token-animation': data.animation_url || '',
        'token-youtube-url': data.youtube_url || '',
        'token-attributes': data.attributes ? JSON.stringify(data.attributes) : '',
      });
    });

    return () => unmount = true;
  }
  , [props.show, collection.address, props.tokenId]);

  if (!collection.address || !props.show) return null;

  function updateToken(values, { setSubmitting }) {
    const attributes = (text => {
      if (text.length === 0) return null;
      
      try {
        return JSON.parse(text);
      } catch (_) {
        return false;
      }
    })(values['token-attributes']);

    if (attributes === false) {
      setSubmitting(false)
      return alert('Failed to parse attributes, please check if is valid json');
    }
    fs.writeFile(`/${collection.address}/${props.tokenId}`, JSON.stringify({
      image: values['token-image'], 
      external_url: values['token-external-url'],
      description: values['token-description'],
      name: values['token-name'],
      attributes: attributes,
      background_color: values['token-background-color'],
      animation_url: values['token-animation'],
      youtube_url: values['token-youtube-url'],
    }), err => {
      if (err) throw err;
      [...imageFileInput.current.files, ...aniFileInput.current.files].forEach(file => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          fs.writeFile(`/${collection.address}/assets/${file.name}`, Buffer.from(fileReader.result), err => {
            if (err) throw err;
            props.onHide()
          });
        };
        fileReader.readAsArrayBuffer(file);
      });
    });
  }

  function askForFile(ref) {
    ref.current.click();    
  }

  function handleImageSelect(setValue, event) {
    if (event.target.files.length === 0) return;

    const file = event.target.files[0];
    setValue(`{base-uri}assets/${file.name}`);
  }

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Formik onSubmit={updateToken} enableReinitialize initialValues={{
        'token-id': props.tokenId,
        ...form,
      }}>
      {({values, handleSubmit, handleChange, isSubmitting, setFieldValue}) =>
      (
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Token</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group controlId="token-id">
                <Form.Label>Token ID</Form.Label>
                <Form.Control value={values['token-id']} onChange={handleChange} type="number" placeholder="Determin Token ID" disabled />
              </Form.Group>
              <Form.Group controlId="token-name">
                <Form.Label>Token Name</Form.Label>
                <Form.Control value={values['token-name']} onChange={handleChange} type="text" placeholder="An Awesome Cat" />
              </Form.Group>
              <Form.Group controlId="token-description">
                <Form.Label>Token Description</Form.Label>
                <Form.Control value={values['token-description']} onChange={handleChange} as="textarea" placeholder="A cat with colorful fur." />
              </Form.Group>
              <Form.Group controlId="token-image">
                <Form.Label>Token Image</Form.Label>
                <InputGroup>
                  <Form.Control value={values['token-image']} onChange={handleChange} type="text" placeholder="Paste URL or Upload" />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={() => askForFile(imageFileInput)}>Select File</Button>
                    <input type="file" ref={imageFileInput} onChange={evt => handleImageSelect(setFieldValue.bind(this, 'token-image'), evt)} hidden/>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Accordion>
                <Accordion.Toggle as={Button} eventKey="0" className="mb-3 float-right" size="sm" variant="secondary">Advanced Fields</Accordion.Toggle>
                <div className="clearfix"></div>
                <Accordion.Collapse eventKey="0">
                  <>
                    <Form.Group controlId="token-background-color">
                      <Form.Label>Token Background Color</Form.Label>
                      <Form.Control value={values['token-background-color']} onChange={handleChange} type="text" placeholder="#fff" />
                    </Form.Group>
                    <Form.Group controlId="token-external-url">
                      <Form.Label>Token External URL</Form.Label>
                      <Form.Control value={values['token-external-url']} onChange={handleChange} type="text" placeholder="https://zubiter.limaois.me/tokens/0xaddroftoken/tokenid" />
                    </Form.Group>
                    <Form.Group controlId="token-animation">
                      <Form.Label>Token Animation</Form.Label>
                      <InputGroup>
                        <Form.Control value={values['token-animation']} onChange={handleChange} type="text" placeholder="Paste URL" />
                        <InputGroup.Append>
                          <Button variant="outline-secondary" onClick={() => askForFile(aniFileInput)}>Select File</Button>
                          <input type="file" ref={aniFileInput} onChange={evt => handleImageSelect(setFieldValue.bind(this, 'token-animation'), evt)} hidden/>
                        </InputGroup.Append>
                      </InputGroup>
                      <Form.Text className="text-muted">A URL to a multi-media attachment for the item.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="token-youtube-url">
                      <Form.Label>Token YouTube URL</Form.Label>
                      <Form.Control value={values['token-youtube-url']} onChange={handleChange} type="text" placeholder="https://www.youtube.com/watch?v=0EX3tQWswj0" />
                      <Form.Text className="text-muted">A URL to a YouTube video.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="token-attributes">
                      <Form.Label>Token Attributes</Form.Label>
                      <Form.Control value={values['token-attributes']} onChange={handleChange} as="textarea" placeholder="[{&quot;key&quot;:&quot;value&quot;}]" />
                    </Form.Group>
                  </>
                </Accordion.Collapse>
              </Accordion>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              { isSubmitting ? `Processing` : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      )}</Formik>
    </Modal>
  );
}

export default class ManageTokens extends React.Component {
  static contextType = AppContext;

  constructor (props) {
    super(props);
    this.state = {
      viewingPage: 1,
      tokenList: [],
      showingEditModal: false,
      editingTokenId: 1,
      showingAddress: null
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { collection } = this.context;
    if (this.state.showingAddress !== collection.address) {
      fs.readdir(`/${collection.address}`, (err, list) => {
        if (err) throw err;
        this.setState({tokenList: list.filter(e => !isNaN(e)).map(e => parseInt(e))});
      });
      this.setState({showingAddress: collection.address});
    }
  }

  render () {
    const { collection } = this.context;
    return (
      <Container className="manage-tokens">
        <h2>Manage Tokens</h2>
        { collection.transferred ? <p>Collection already has been transferred ownership, mint token on chain is disabled.</p> : ''}
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
                    { this.state.tokenList.slice(5 * (this.state.viewingPage - 1), 5 * this.state.viewingPage).map(tokenId => 
                      <Token
                        tokenId={tokenId}
                        key={tokenId}
                        showEditModal={() => this.setState({showingEditModal: true, editingTokenId: tokenId})}
                      />
                    )}
                  </tbody>
                </Table>
                <Row className="justify-content-between px-3 pb-2">
                  <Col>Showing {this.state.viewingPage * 5 - 4} to {this.state.viewingPage * 5} of {this.state.tokenList.length} tokens.</Col>
                  <Col>
                    <Pagination className="justify-content-end">
                      { this.state.viewingPage !== 1 ? 
                      <>
                        <Pagination.First onClick={() => this.setState({viewingPage: 1})}/>
                        <Pagination.Prev onClick={() => this.setState(prev => ({viewingPage: Math.max(1, prev.viewingPage - 1)}))} />
                      </>
                      : ''}
                      <Pagination.Item active>{this.state.viewingPage}</Pagination.Item>
                      { this.state.viewingPage !== Math.ceil(this.state.tokenList.length / 5) ? 
                      <>
                        <Pagination.Next onClick={() => this.setState(prev => ({viewingPage: Math.min(Math.ceil(this.state.tokenList.length / 5), prev.viewingPage + 1)}))} />
                        <Pagination.Last  onClick={() => this.setState({viewingPage: Math.ceil(this.state.tokenList.length / 5)})}/>
                      </>
                      : ''}
                    </Pagination>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <EditModal
          show={this.state.showingEditModal}
          onHide={() => this.setState({showingEditModal: false})}
          tokenId={this.state.editingTokenId}
        />
      </Container>
    );
  }
}