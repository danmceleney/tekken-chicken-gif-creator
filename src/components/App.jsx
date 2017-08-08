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
  getToken(client_id, client_secret, username, password) {
    //credentials to send with POST request to get auth token from API
    const payload = {
        'grant_type': 'password',
        'client_id': client_id,
        'client_secret': client_secret,
        'username': username,
        'password': password,
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
      this.getToken(config.client_id, config.client_secret, config.username, config.password);
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
      gfyName: "",
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
          return response.json();
      }).then(json => {
        this.setState({
          gfyName: json.gfyname
        })
        this.statusCheck(json.gfyname);
      })
  }

  //function that checks the status of the gif I created, whether it exists or not
  statusCheck(name) {
    
    fetch(`https://api.gfycat.com/v1/gfycats/fetch/status/${name}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        return response.json();
      }).then(json => {
        if(json.task == 'encoding') {
          this.setState({
            gfyStatus: 'Working on it!',
          });
          setTimeout(this.statusCheck(name), 5000);
        } else if (json.task == 'complete') {
          this.setState({
          gfyStatus: 'gif complete!'
        })
        }
      }).catch(err => {
        this.setState({
          gfyStatus: 'Something broke x_x'
        });
        console.log(err);
      })
    }

  //handle the data that's submitted by input
  handleSubmit(event) {
    event.preventDefault();
    const token = this.props.token;
    const { url, title, startMinutes, startSeconds, endMinutes, endSeconds, length } = event.target;

    let totalStartSeconds = parseInt(startMinutes.value) * 60 + parseInt(startSeconds.value);
    let totalEndSeconds = parseInt(endMinutes.value) * 60 + parseInt(endSeconds.value);

    let timeLength = totalEndSeconds - totalStartSeconds;

    this.gifCutter(url.value,
      title.value,
      startMinutes.value,
      startSeconds.value,
      timeLength,
      token);
  }

  //create album for TC
  albumCreate(auth) {

    const albumName = 'testing a thing';
    fetch(`https://api.gfycat.com/v1/me/folders/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
      },
        body: JSON.stringify({
          folderName: albumName,
        })
      }).then(response => {
          return response.json();
      }).then(json => {
      })
  }
  

  render() {
    return(
    <div>
      <GifCuttingForm handleSubmit={e => this.handleSubmit(e)}/>
      <StatusPanel
        gfyName={this.state.gfyName}
        historyList={this.state.gfyNameHistory}
        status={this.state.gfyStatus}
        link={this.state.gfyLink}
      />
    </div>
    )
  }
}

//export the gycatAuthorization component, but pass in App
export default GyfcatAuthToken(App);
