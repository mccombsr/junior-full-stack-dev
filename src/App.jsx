import React, { Component } from 'react';
import './Styling/App.scss';
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
