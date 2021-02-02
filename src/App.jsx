import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Panel from './Panel';

import './App.css';

export default function App() {
  return (
    <Router>
      <Panel>
        <Switch>
          <Route path="/create">
            <h1>Create</h1>
          </Route>
          <Route path="/:id/mint">
            <h1>Mint</h1>
          </Route>
          <Route path="/:id/">
            <h1>Dashboard</h1>
          </Route>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Panel>
    </Router>
  );
}
