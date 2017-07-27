import React, { Component } from 'react';
import config from '../util/FBauth/authConfig';

const GyfcatAuthToken = App => class GyfcatAuthToken extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      status: null
    }
  }
  getToken(client_id, client_secret) {
    //credentials to send with POST request to get auth token from API
    const payload = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    };
    //The actual API call to gyfcat. Passes in payload which is credentials. This is a Promise
    fetch('https://api.gfycat.com/v1/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        //initial API response that tells you the status of the POST request
    }).then(response => {
      return response.json();
    }).then(json => {
      this.setState({
        token: json.access_token,
        status: 'SUCCESS'
      })
    }).catch(error => {
      this.token = null;
      this.status = 'ERROR';
    });
  }

  componentDidMount() {
    if(!this.token) {
      this.status = 'FETCHING';
      this.getToken(config.client_id, config.client_secret);
    }
  }
  render() {
    console.log('HOC', this.state);
    return <App token={this.state.token} status={this.state.status}/>;
  }
}

class App extends Component {

gifCutter(url, title, minutes, seconds, captions, auth) {
    fetch('https://api.gfycat.com/v1/gfycats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({
            url,
            title,
            minutes,
            seconds,
            captions
        })
    }).then(response => {
      console.log('fetch response', response);
        return response.json();
    }).then(json => {
      console.log('whole json', json);
        this.statusCheck(json.gfyname);
    })
}

statusCheck(name) {
    fetch(`https://api.gfycat.com/v1/gfycats/fetch/status/${name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(json => {
        console.log('STATUS', json);
    })
}

fileDropper(secret) {
  fetch('https://filedrop.gfycat.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({secret})
  }).then(response => {
    return response.json()
  }).then(json => {
    console.log(json);
  })
}

  handleSubmit(event, token) {
    event.preventDefault();
    const { url, title, minutes, seconds, caption } = event.target;
    const captionArray = [{text:caption.value}];
    console.log(captionArray);
    this.gifCutter(url.value, title.value, minutes.value, seconds.value, captionArray, token);
  }

  render() {
    console.log('APP', this);
    return(
      <div>
        <form onSubmit={(e) => {this.handleSubmit(e, this.props.token)}}>
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
          <label>
            caption: <input type="text" name="caption" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default GyfcatAuthToken(App);
