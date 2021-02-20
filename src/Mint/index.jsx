import React, { useContext } from 'react';

import {
  Container,
  Button,
  Form,
  InputGroup,
  Accordion,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';

import AppContext from '../context';

import fs from '../fs';

import './Mint.css';

// FIXME: Temp Hack for create ref
class FormInjector extends React.Component {
  render() { return <></>; }
}

function Transferred () {
  const { ctx, setCtx } = useContext(AppContext);
  setCtx({ alerts: [...ctx.alerts, {
    variant: 'danger',
    content: 'Collection already has been transferred ownership, mint token is disabled.',
  }]})
  return <Redirect to="/dashboard" />;
}
export default class Mint extends React.Component {
  static contextType = AppContext;
  
  constructor (props) {
    super(props);

    this.state = {
      stage: 0,
      totalStage: 1,
      contract: null,
    };
    this.formInjector = React.createRef();
    this.imageFileInput = React.createRef(null);
    this.aniFileInput = React.createRef(null);
  }

  async componentDidMount() {
    const { ctx, collection } = this.context;
    this.setState({contract: ctx.contracts.ZubiterClonableERC721.attach(collection.address)});
    this.autoGenerateTokenId();
  }

  setFieldValue = (field, value) => this.formInjector.current.props.setFieldValue(field, value);
  submitForm(values, { resetForm, setSubmitting }) {
    const { ctx, setCtx, collection } = this.context;

    const attributes = this.parseAttribute(values['token-attributes']);
    if (attributes === false) {
      setSubmitting(false);
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'danger',
        content: 'Failed to parse attributes, please check if is valid json',
      }]})
      return;
    }

    this.setState({stage: 0});

    let mintOnChain;
    if (values['mint-to'] !== '') { 
      this.setState({totalStage: 2});
      mintOnChain = this.state.contract['mint(address,uint256)'](values['mint-to'], values['token-id'])
      .then(tx => {
        tx.wait().then(() => {
          this.setState(prev => ({ ...this.state, stage: prev.stage + 1 }))
        });
      })
      .catch(err => {
        setCtx({ alerts: [...ctx.alerts, {
          variant: 'danger',
          content: 'Failed to mint on chain, error message: ' + err.message,
        }]});
        throw err;
      });
    }

    const createFile = (() => new Promise((res, rej) => fs.writeFile(`/${collection.address}/${values['token-id']}`, JSON.stringify({
        image: values['token-image'], 
        external_url: values['token-external-url'],
        description: values['token-description'],
        name: values['token-name'],
        attributes: attributes,
        background_color: values['token-background-color'],
        animation_url: values['token-animation'],
        youtube_url: values['token-youtube-url'],
      }), err => {
        if (err) return rej(err);
        this.setState(prev => ({ ...this.state, stage: prev.stage + 1 }))
        res(true)
      })
    ))();

    const uploadAssets = Promise.all(
      [...this.imageFileInput.current.files, ...this.aniFileInput.current.files].map(file => new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          fs.writeFile(`/${collection.address}/assets/${file.name}`, Buffer.from(fileReader.result), err => {
            if (err) return rej(false);
            setCtx({ alerts: [...ctx.alerts, {
              variant: 'danger',
              content: 'Failed to upload file, error message: ' + err,
            }]});
            res(true);
          });
        };
        fileReader.readAsArrayBuffer(file);
      })
    ));

    Promise.all([mintOnChain, createFile, uploadAssets]).then(() => {
      setSubmitting(false);
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'success',
        content: 'Mint success, you can continue to mint next token.',
      }]})
      resetForm();
      this.autoGenerateTokenId();
    })
    .catch(_ => {
      setSubmitting(false);
      console.error(_)
    });
  }
  
  parseAttribute(text) {
    if (text.length === 0) return null;
    
    try {
      return JSON.parse(text);
    } catch (_) {
      return false;
    }
  }

  autoGenerateTokenId () {
    const { collection } = this.context;
    fs.readdir(`/${collection.address}`, (err, files) => {
      if (err) throw err;
      this.setFieldValue('token-id', Math.max(0, ...files.filter(e => !isNaN(e)).map(e => parseInt(e, 10))) + 1);
    });
  }

  askForFile(ref) {
    ref.current.click();    
  }

  handleImageSelect(setValue, event) {
    if (event.target.files.length === 0) return;

    const file = event.target.files[0];
    setValue(`{base-uri}assets/${file.name}`);
  }

  render () {
    const { ctx, collection } = this.context;
    return (
      <Container className="mint">
        { collection.transferred ? 
          <Transferred />
          : ''}
        <h2>Mint</h2>
        <p className="text-muted">Metadata is expected to be immutable after minted, but you still can update them later. Files uploaded will be stored to Netlify site.</p>
        <Formik onSubmit={this.submitForm.bind(this)} enableReinitialize initialValues={{
          'token-id': 1,
          'mint-to': '',
          'token-name': '',
          'token-description': '',
          'token-image': '',
          'token-background-color': '',
          'token-external-url': '',
          'token-animation': '',
          'token-youtube-url': '',
          'token-attributes': '',
        }}>
        {({values, handleSubmit, handleChange, isSubmitting, setFieldValue}) =>
        (<Form onSubmit={handleSubmit}>
          <FormInjector ref={this.formInjector} setFieldValue={setFieldValue} />
          <Form.Group controlId="token-id">
            <Form.Label>Token ID</Form.Label>
            <Form.Control value={values['token-id']} onChange={handleChange} type="number" placeholder="Determin Token ID" required />
            <Form.Text className="text-muted">It's preset according to the collection state.</Form.Text>
          </Form.Group>
          <Form.Group controlId="mint-to">
            <Form.Label>Mint to</Form.Label>
            <InputGroup>
              <Form.Control value={values['mint-to']} onChange={handleChange} type="text" placeholder="An Ethereum Address, start with 0x" />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => setFieldValue('mint-to', ctx.address)}>Use Me</Button>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">If leave it blank, it will only create files. You can send it in Manage Tokens.</Form.Text>
          </Form.Group>
          <Form.Group controlId="token-name">
            <Form.Label>Token Name</Form.Label>
            <Form.Control value={values['token-name']} onChange={handleChange} type="text" placeholder="An Awesome Cat" required />
          </Form.Group>
          <Form.Group controlId="token-description">
            <Form.Label>Token Description</Form.Label>
            <Form.Control value={values['token-description']} onChange={handleChange} as="textarea" placeholder="A cat with colorful fur." required />
          </Form.Group>
          <Form.Group controlId="token-image">
            <Form.Label>Token Image</Form.Label>
            <InputGroup>
              <Form.Control value={values['token-image']} onChange={handleChange} type="text" placeholder="Paste URL or Upload" required />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => this.askForFile(this.imageFileInput)}>Select File</Button>
                <input type="file" ref={this.imageFileInput} onChange={evt => this.handleImageSelect(setFieldValue.bind(this, 'token-image'), evt)} hidden/>
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
                      <Button variant="outline-secondary" onClick={() => this.askForFile(this.aniFileInput)}>Select File</Button>
                      <input type="file" ref={this.aniFileInput} onChange={evt => this.handleImageSelect(setFieldValue.bind(this, 'token-animation'), evt)} hidden/>
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
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            { isSubmitting ? `Processing (${this.state.stage}/${this.state.totalStage})` : 'Mint'}
          </Button>
        </Form>)}
        </Formik>
      </Container>
    );
  }
}