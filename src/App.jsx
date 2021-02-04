import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Panel from './Panel';
import Create from './Create';
import Dashboard from './Dashboard';
import Mint from './Mint';
import ManageTokens from './ManageTokens';
import Setting from './Setting';
import Extensions from './Extensions';
import Admin from './Admin';

import './App.css';

export default function App() {
  return (
    <Router>
      <Panel>
        <Switch>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/:id/dashboard">
            <Dashboard />
          </Route>
          <Route path="/:id/mint">
            <Mint />
          </Route>
          <Route path="/:id/manage-tokens">
            <ManageTokens />
          </Route>
          <Route path="/:id/setting">
            <Setting />
          </Route>
          <Route path="/:id/extensions">
            <Extensions />
          </Route>
          <Route path="/:id/:extension">
            <Admin />
          </Route>
          <Route path="/">
            <Redirect to="/1/dashboard" />
          </Route>
        </Switch>
      </Panel>
    </Router>
  );
}
