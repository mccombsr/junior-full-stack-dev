import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GetQuote from './Components/GetQuote';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GetQuote/>
      </div>
    );
  }
}

export default App;
