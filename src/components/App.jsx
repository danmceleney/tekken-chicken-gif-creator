import React, { Component } from 'react';
import gifCutter from '../util/gyfcatMaker/gyfcatMaker.js';
import fetch from 'whatwg-fetch';
import authConfig from '../util/FBauth/authConfig.js';

class App extends Component {
  constructor(){
    super();

    this.state = {}
  }

  handleSubmit(event) {
    event.preventDefault();
    const { url, title, minutes, seconds } = event.target;
    gifCutter(url.value, title.value, minutes.value, seconds.value);
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            URL: <input type="text" name="url" />
          </label>
          <label>
            title: <input type="text" name="title" />
          </label>
          <label>
            minutes: <input type="text" name="minutes" />
          </label>
          <label>
            seconds: <input type="text" name="seconds" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default App;
