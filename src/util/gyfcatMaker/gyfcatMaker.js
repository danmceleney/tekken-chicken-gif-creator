import config from '../FBauth/authConfig'

function getToken(client_id, client_secret) {
    let token_info = {}
    const payload = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    };
    fetch('https://api.gfycat.com/v1/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            payload
        )
    }).then(response => {
        return response.json();
    }).then(json => {
        return token_info = {
            token_type: json.token_type,
            access_token: json.access_token
        }
    }).catch(err => {
        console.log('something done goofed');
    });
}

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