//importing config file for authentication, you can only get this if I send it to you
import config from '../FBauth/authConfig'

//function that retrieves auth token using fetch
function getToken(client_id, client_secret) {
    let token_info = {}
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
        body: JSON.stringify(
            payload
        )
        //initial API response that tells you the status of the POST request
    }).then(response => {
        return response.json();
    }).then(json => {
        //the actual data you get after the Promise is fulfilled.
        return token_info = {
            token_type: json.token_type,
            access_token: json.access_token
        }
    }).catch(err => {
        console.log('something done goofed');
    });
}

//Check the status of the gyfcat that was created.
function statusCheck(name) {
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
//function for chopping up video URL
function gifCutter(url, title, minutes, seconds, captions) {
    fetch('https://api.gfycat.com/v1/gfycats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url,
            title,
            minutes,
            seconds
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        statusCheck(json.gfyname);
    })
}

function testFunction () {
    return 'string';
}

const access = getToken(config.client_id, config.client_secret);
console.log(getToken(config.client_id, config.client_secret));

export default gifCutter;