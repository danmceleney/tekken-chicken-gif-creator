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
      moveNotation: "",
    }
  }

  // function that makes gif making request
  //parameters are self explanitory, auth comes from the HOC
  gifCutter(url, title, minutes, seconds, length, tagArray, auth) {

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
          gfyName: json.gfyname,
          moveNotation: title,
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
    const { url, title, startMinutes, startSeconds, endMinutes, endSeconds, charName } = event.target;
    let totalStartSeconds = parseInt(startMinutes.value) * 60 + parseInt(startSeconds.value);
    let totalEndSeconds = parseInt(endMinutes.value) * 60 + parseInt(endSeconds.value);
    let timeLength = totalEndSeconds - totalStartSeconds;

    if(this.state.moveNotation === title.value) {
      alert(`Don't forget to change the notation!`);
      return;
    }
    
    this.folderCheck(charName.value, token)

    const tagArray = ['T7 Chicken', 'Tekken', charName.value];

    this.gifCutter(url.value,
      title.value,
      startMinutes.value,
      startSeconds.value,
      timeLength,
      charName,
      token);
  }

  //create folder for characters
  folderCreate(folder, auth) {
    console.log('creating folder');
    fetch(`https://api.gfycat.com/v1/me/folders/1`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
      },
      body: JSON.stringify({
        folderName: folder
      })
      }).catch(err => {
        console.log(err);
      })
  }

  folderCheck(folderName, auth) {
    
    const findFolderByTitle = (title, folders) => !!folders.find(folder => folder.title === title)

    fetch(`https://api.gfycat.com/v1/me/folders`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
      }
      }).then(response => {
          return response.json();
        })
        .then(json => {
          let folderArray = json[0].nodes;
          console.log(findFolderByTitle(folderName, folderArray));
          if(findFolderByTitle(folderName, folderArray) == true) {
            return;
          } else if(findFolderByTitle(folderName, folderArray)  == false) {
            this.folderCreate(folderName, auth);
          }
      }).catch(err => console.log(err));
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
