import React from 'react';

import {
  Container,
  Form,
  Button,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';

import AppContext from '../context';

import fs from '../fs';

import './Create.css';

export default class Create extends React.Component {
  static contextType = AppContext;

  constructor (props) {
    super(props);
    this.state = {
      stage: 0,
      finished: false
    };
  }

  submitForm(values, { setSubmitting }) {
    const { ctx, setCtx, setCollection } = this.context;

    const createToken = ctx.contracts.Zubiter.createToken(values['collection-name'], values['collection-symbol'])
    .then(tx => 
      tx.wait().then(result => {
        this.setState(prev => Object.assign({}, { ...this.state, stage: prev.stage + 1 }))
        return result.events.find(evt => evt.event === 'CreateToken').args.token
      })
    );

    createToken.then(token => setCtx({collections: [...ctx.collections, token]}));
    createToken.then(token => setCollection({address: token}));

    const setBaseURI = createToken.then(token =>
      ctx.contracts.ZubiterClonableERC721.attach(token).setBaseURI(values['collection-base-uri'])
      .then(tx => tx.wait().then(() => this.setState(prev => Object.assign({}, { ...this.state, stage: prev.stage + 1 }))))
    );

    const createFile = createToken.then(token => new Promise((res, rej) => {
      fs.mkdir(`/${token}`, err => {
        if (err) return rej(err);

        localStorage.setItem(`collection-${token}`, values['collection-name']);
        fs.writeFile(`/${token}/collection`, JSON.stringify({
          name: values['collection-name'],
          description: values['collection-description'],
          image: values['collection-image'],
          external_link: values['collection-external-link'],
          address: token,
        }), err => {
          if (err) return rej(err);
          this.setState(prev => Object.assign({}, { ...this.state, stage: prev.stage + 1 }))
          res(true)
        })
      })
    }));

    return Promise.all([createToken, setBaseURI, createFile])
    .then(() => {
      setSubmitting(false);
      this.setState({ finished: true });
    })
    .catch(err => {
      setSubmitting(false);
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'danger',
        content: 'Failed to Create token, error message: ' + err,
      }]})
    });
  }

  render () {
    const { collection } = this.context;
    return (
      <Container>
        { this.state.finished ? <Redirect to={`/${collection.address}/dashboard`} /> : ''}
        <h2 className="page-title">Create a New Collection</h2>
        {/* <section className={this.state.step === 1 ? '' : 'd-none'}>
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
        </section> */}
        <section>
          {/* <h3>Create Collection</h3> */}
          <Formik
            onSubmit={this.submitForm.bind(this)}
            initialValues={{
              'collection-name': '',
              'collection-symbol': '',
              'collection-base-uri': 'https://',
              'collection-description': '',
              'collection-image': '',
              'collection-external-link': '',
            }}
          >
            {({values, handleSubmit, handleChange, isSubmitting}) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="collection-name">
                  <Form.Label>Collection Name</Form.Label>
                  <Form.Control value={values['collection-name']} onChange={handleChange} type="text" placeholder="Enter Collection Name, such as &quot;My Awesome NFTs&quot;" required />
                </Form.Group>
                <Form.Group controlId="collection-symbol">
                  <Form.Label>Collection Symbol</Form.Label>
                  <Form.Control value={values['collection-symbol']} onChange={handleChange} type="text" placeholder="Enter Collection Symbol, such as &quot;MAN&quot;" required />
                </Form.Group>
                <Form.Group controlId="collection-base-uri">
                  <Form.Label>Collection Base URI</Form.Label>
                  <Form.Control value={values['collection-base-uri']} onChange={handleChange} type="url" placeholder="https://" required />
                  <Form.Text className="text-muted">You can use <a href="https://netlify.com" target="_blank" rel="noreferrer">Netlify</a>.</Form.Text>
                </Form.Group>
                <Form.Group controlId="collection-description">
                  <Form.Label>Collection Description</Form.Label>
                  <Form.Control value={values['collection-description']} onChange={handleChange} as="textarea" placeholder="(Optional) Enter Collection Description" />
                </Form.Group>
                <Form.Group controlId="collection-external-link">
                  <Form.Label>Collection Link</Form.Label>
                  <Form.Control value={values['collection-external-link']} onChange={handleChange} type="url" placeholder="(Optional) Enter Collection Link" />
                </Form.Group>
                <Form.Group controlId="collection-image">
                  <Form.Label>Collection Image</Form.Label>
                  <Form.Control value={values['collection-image']} onChange={handleChange} type="url" placeholder="(Optional) Enter Collection Image URL" />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  { isSubmitting ? `Processing (${this.state.stage}/3)` : 'Submit' }
                </Button>
              </Form>
            )}
          </Formik>
        </section>
      </Container>
    );
  }
}