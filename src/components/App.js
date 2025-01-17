import React, { Component } from 'react';
import './App.css';
import NFTs from './NFTs'
import Memes from './Memes'
import Mint from './Mint'
import Creator from './Creator'
import Home from './Home'
import Docs from './Docs'
import Details from './Details'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {

  async componentDidMount() {

  }

  render() {
    return (
      <div>
      <Router>
      <Switch>
          <Route path="/nfts">
            <NFTs />
          </Route>
          <Route path="/create">
            <Home />
          </Route>
          <Route path="/mint">
            <Mint />
          </Route>
          <Route path="/kulfys">
            <Memes />
          </Route>
          <Route path="/creator">
            <Creator />
          </Route>
          <Route path="/kulfy" >
            <Details />
          </Route>
          <Route path="/docs" >
            <Docs />
          </Route>
          <Route path="/">
            <Memes />
          </Route>
    
        </Switch>
      
    </Router>
        


      </div>
    );
  }
}

export default App;