import React, { Component } from 'react';
import gifCutter from '../util/gyfcatMaker/gyfcatMaker.js';
import fetch from 'whatwg-fetch';
import authConfig from '../util/FBauth/authConfig.js';

class App extends Component {
  constructor(){
    super();

    this.state = {}
  }
  getToken() {
    console.log('test');
    //  const payload = {
    //    'grant_type': 'client_credentials',
    //    'client_id': authConfig.client_id,
    //    'client_secret': authConfig.client_secret
    //   }
    //   fetch('https://api.gfycat.com/v1/oauth/token', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       payload
    //     }).then(response => {
    //       console.log(response.json());
    //     })
    //   })
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
