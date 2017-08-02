import React, { Component } from 'react';
import config from '../util/FBauth/authConfig';


//Higher Order Component that gets auth token as soon as the page is rendered and passes it to App
const GyfcatAuthToken = App => class GyfcatAuthToken extends Component {

  constructor() {
    super();
    //setting state with token and status to be updated
    this.state = {
      token: null,
      status: null
    }
  }
  //token getting function
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
      //actual JSON response
    }).then(json => {
      //updating state with json response values
      this.setState({
        token: json.access_token,
        status: 'SUCCESS'
      })
      return json;
    }).catch(error => {
      this.token = null;
      this.status = 'ERROR';
    });
  }
  //run this as soon as the page renders
  componentDidMount() {
    //if there is no token value, set the status to 'FETCHING'
    if(!this.token) {
      this.status = 'FETCHING';
      //then run the function that gets the token and updates the state
      this.getToken(config.client_id, config.client_secret);
    }
  }
  render() {
    //pass state values into App component as attribute
    return <App token={this.state.token} status={this.state.status}/>;
  }
}

//Main App
class App extends Component {

  // function that makes gif making request
  //parameters are self explanitory, auth comes from the HOC
  gifCutter(url, title, minutes, seconds, captions, auth) {
    fetch('https://api.gfycat.com/v1/gfycats', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
      },
      body: JSON.stringify({
          fetchUrl: url,
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
      })
  }

  //function that checks the status of the gif I created, whether it exists or not
  statusCheck(event) {
    event.preventDefault();
    let name = event.target.gfyname.value;

    fetch(`https://api.gfycat.com/v1/gfycats/fetch/status/${name}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log('STATUS CALL', response);
        return response.json();
      }).then(json => {
        console.log('STATUS DETAILS', json);
      })
    }

  //handle the data that's submitted by input
  handleSubmit(event, token) {
    event.preventDefault();
    const { url, title, minutes, seconds, caption } = event.target;
    const captionArray = [{text:caption.value}];
    this.gifCutter(url.value, title.value, minutes.value, seconds.value, captionArray, token);
    //this.testRequest('https://giant.gfycat.com/DetailedFearfulBangeltiger.mp4', 'Test Request', 0, 4, [{x:'whatever'}], token);
  }

  testRequest(url, title, minutes, seconds, captions, auth) {
    fetch('https://api.gfycat.com/v1/gfycats', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
      },
      body: JSON.stringify({
          fetchUrl: url,
          title,
          minutes,
          seconds
        })
      }).then(response => {
        console.log('fetch response', response);
          return response.json();
      }).then(json => {
        console.log('whole json', json);
          setTimeout(() => {
            this.statusCheck(json.gfyname);
          }, 3000);
      })
  }

  render() {
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
        <form onSubmit={(e) => {this.statusCheck(e)}}>
          <label>
            Check Status: <input type="text" name="gfyname" />
          </label>
        </form>
      </div>
    )
  }
}

//export the gycatAuthorization component, but pass in App
export default GyfcatAuthToken(App);
