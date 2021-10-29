import './App.css';
import Table from './components/Table';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {

  const [searchTerm, setSearchTerm] = useState("");
  const [songID, setSongID] = useState(0);

  return (
  <Router>
    <div className="App">
      <div className="sidebar">
        <Sidebar onSearch={(text) => setSearchTerm(text)} searchTerm={searchTerm}/>
      </div>
      <div className="header">
        <Header onSearch={(text) => setSearchTerm(text)} searchTerm={searchTerm}/>
      </div>
      <div className="body">
        <Switch>
          <Route path="/search">
            <Table onSearch={(text) => setSearchTerm(text)} songID={songID} searchTerm={searchTerm} onPlay={(songID) => setSongID(songID)}/>
          </Route>
          <Route path="/">
            <Home onArtistSelect={(artist) => setSearchTerm(artist)}/>
          </Route>
        </Switch>
      </div>
      <div className="footer">
        <Footer setSong={(songID) => setSongID(songID)} songID={songID}/>
      </div>
    </div>
  </Router>
  )
}

export default App;
