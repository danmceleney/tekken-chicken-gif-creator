import React, { Component } from 'react';
import { fbauth } from '../util/FBauth/fbauth.js';



class App extends Component {
  constructor(){
    super();

    this.state = {}
  }

  handleClick(e) {
    e.preventDefault();
    fbauth('testing')
  }

  render() {
    return(
      <div>
        <button onClick={this.handleClick}>Test</button>
      </div>
    )
  }
}

export default App;
