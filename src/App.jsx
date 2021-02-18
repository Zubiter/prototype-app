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

import AppContext, { ContextProvider } from './context';

import './App.css';

class Connected extends React.Component {
  static contextType = AppContext;

  render() {
    return (<>
      { this.context.ctx.address ? (
          this.context.ctx.collections.length ? (
            <>{this.props.children}</>
          ) : <Redirect to="/create" />
        ) : <h2>Connect Wallet to Start</h2>
      }
    </>);
  }
}

export default class App extends React.Component {
  render () {
    return (
      <ContextProvider>
        <Router>
          <Panel>
            <Connected>
              <Switch>
                <Route path="/create">
                  <Create />
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/mint">
                  <Mint />
                </Route>
                <Route path="/manage-tokens">
                  <ManageTokens />
                </Route>
                <Route path="/setting">
                  <Setting />
                </Route>
                <Route path="/extensions">
                  <Extensions />
                </Route>
                <Route path="/:extension">
                  <Admin />
                </Route>
                <Route path="/">
                  <Redirect to="/dashboard" />
                </Route>
              </Switch>
            </Connected>
          </Panel>
        </Router>
      </ContextProvider>
    );
  }
}
