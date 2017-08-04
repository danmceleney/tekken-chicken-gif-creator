import React, { Component } from 'react';
import config from '../util/FBauth/authConfig';
import GifCuttingForm from './GifCuttingForm';
import StatusCheckForm from './StatusCheckForm';
import StatusPanel from './StatusPanel';



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

    constructor() {
    super();
    //setting state with token and status to be updated
    this.state = {
      gfyName: null,
      gfyStatus: null,
      lastChecked: null,
      gfyNameHistory: [],
    }
  }

  // function that makes gif making request
  //parameters are self explanitory, auth comes from the HOC
  gifCutter(url, title, minutes, seconds, length, auth) {

    fetch('https://api.gfycat.com/v1/gfycats', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
      },
      body: JSON.stringify({
          fetchUrl: url,
          title,
          fetchMinutes: minutes,
          fetchSeconds: seconds,
          fetchLength: length,
      })
      }).then(response => {
        console.log('fetch response', response);
          return response.json();
      }).then(json => {
        console.log('whole json', json);
        this.setState({
          gfyName: json.gfyname,
        })
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
        if(json.task == 'encoding') {
          this.setState({
            gfyStatus: 'Working on it!',
          })
        } else if (json.task == 'complete') {
          this.setState({
          gfyNameHistory: [...this.state.gfyNameHistory, json.gfyname],
          gfyStatus: 'gif complete!'
        })
        }
      }).catch(err => console.log('Something bad happened :('))
    }

  //handle the data that's submitted by input
  handleSubmit(event) {
    event.preventDefault();
    const token = this.props.token;
    const { url, title, minutes, seconds, caption, length } = event.target;

    this.gifCutter(url.value,
      title.value,
      minutes.value,
      seconds.value,
      length.value,
      token);
  }


  render() {
    console.log(this.state);
    return(
    <div>
      <GifCuttingForm handleSubmit={e => this.handleSubmit(e)}/>
      <StatusPanel
        gfyName={this.state.gfyName}
        historyList={this.state.gfyNameHistory}
        status={this.state.gfyStatus}
      />
      <StatusCheckForm statusCheck={e => this.statusCheck(e)}/>
    </div>
    )
  }
}

//export the gycatAuthorization component, but pass in App
export default GyfcatAuthToken(App);
