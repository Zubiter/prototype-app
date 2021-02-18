import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
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

function Connected (props) {
  const { ctx } = useContext(AppContext);
  const location = useLocation();

  return (<>
    { ctx.address ?
      <>
        {ctx.collections.length === 0 && location.pathname !== '/create' ?  <Redirect to="/create" />: props.children }
      </>
      : <h2>Connect Wallet to Start</h2>
    }
  </>);
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
