import React, { useContext, useEffect, useState } from 'react';

import {
  Container,
  Form,
  Button,
  Row,
} from 'react-bootstrap';
import { Formik } from 'formik';

import fs from '../fs';

import AppContext from '../context';

import './Setting.css';

export default function Setting() {
  const { ctx, collection, setCtx } = useContext(AppContext);
  const [ form, setForm ] = useState({
    'collection-name': '',
    'collection-base-uri': 'https://',
    'collection-description': '',
    'collection-image': '',
    'collection-external-link': '',
  });
  const contract = ctx.contracts.ZubiterClonableERC721.attach(collection.address);
  useEffect(() => {
    let unmount = false;
    fs.readFile(`/${collection.address}/collection`, (err, content) => {
      if (err) throw err;

      let data;
      try {
        data = JSON.parse(content);
      } catch (_) {
        data = {};
      }

      if (!unmount) setForm(prev => ({
        ...prev,
        'collection-name': data.name || '',
        'collection-description': data.description || '',
        'collection-image': data.image || '',
        'collection-external-link': data.external_link || '',
      }));
    });
    contract.baseURI().then(uri => {
      if (!unmount) setForm(prev => ({...prev, 'collection-base-uri': uri}));
    });

    return () => unmount = true;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [collection.address]);
  const [ stage, setStage ] = useState(0);
  const [ totalStage, setTotalStage ] = useState(1);

  function updateCollection(values, { setSubmitting }) {
    setStage(0);
    setTotalStage(1);
    let updateBaseUri;
    if (values['collection-base-uri'] !== form['collection-base-uri']) {
      setTotalStage(2);
      updateBaseUri = contract.setBaseURI(values['collection-base-uri'])
      .then(tx => tx.wait().then(() => {
        setStage(prev => prev + 1);
      }));
    }

    const updateFile = (() => new Promise((res, rej) => {
      fs.exists(`/${collection.address}`, async exists => {
        if (!exists) {
          await new Promise((res_, rej_) => {
            fs.mkdir(`/${collection.address}`, err => {
              if (err) return rej_(err);
              res_(true);
            });
          });
        }

        localStorage.setItem(`collection-${collection.address}`, values['collection-name']);
        fs.writeFile(`/${collection.address}/collection`, JSON.stringify({
          name: values['collection-name'],
          description: values['collection-description'],
          image: values['collection-image'],
          external_link: values['collection-external-link'],
          address: collection.address,
        }), err => {
          if (err) return rej(err);
          setStage(prev => prev + 1);
          res(true)
        });
      })
    }))();

    Promise.all([updateBaseUri, updateFile])
    .then(() => {
      setSubmitting(false);
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'success',
        content: 'Collection update successed',
      }]})
    })
    .catch(err => {
      setSubmitting(false);
      setCtx({ alerts: [...ctx.alerts, {
        variant: 'danger',
        content: 'Failed to update collection, error message: ' + err,
      }]})
    });
  }

  return (
    <Container className="setting">
      <h2>Setting</h2>
      {/* <p className="text-muted">If no NFT and data will be minted or updated in this collection, migrate it to IPFS and renounce ownership might be a good idea.</p> */}
      <h4>Export Files</h4>
      <Button variant="primary" type="button">
        Save as ZIP
      </Button>
      <p className="small text-muted">If you use Netlify to serve files, you can upload the zip in <a href="https://app.netlify.com/" target="_blank" rel="noreferrer">App</a> &gt; Site &gt; Deploys.</p>
      {/*
      <h4>Import Files</h4>
      <Button variant="primary" type="button">
        Import ZIP
      </Button> &nbsp;
      <Button variant="outline-primary" type="button">
        Sync with Base URL
      </Button>
      <p className="small text-muted">All data are stored in browser, after cleared data, you will need to import.</p>
      */}
      <h4>Collection Setting</h4>
      <Formik
        onSubmit={updateCollection}
        enableReinitialize
        initialValues={{ ...form }}
      >
        {({values, handleSubmit, handleChange, isSubmitting}) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="collection-name">
              <Form.Label>Collection Name</Form.Label>
              <Form.Control value={values['collection-name']} onChange={handleChange} type="text" placeholder="Enter Collection Name, such as &quot;My Awesome NFTs&quot;" disabled />
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
              { isSubmitting ? `Processing (${stage}/${totalStage})` : 'Submit' }
            </Button>
          </Form>
        )}
      </Formik>
      {/* <h4>File Provider Setting</h4>
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
      </Form> */}
      <Container className="p-0">
        <h4>Danger Zone</h4>
        <Row className="m-0">
          <Button variant="danger" type="button">
            Renounce Collection
          </Button>&nbsp;
          {/* <Button variant="outline-danger" type="button">
            Transfer Ownership
          </Button> */}
        </Row>
      </Container>
    </Container>
  );
}