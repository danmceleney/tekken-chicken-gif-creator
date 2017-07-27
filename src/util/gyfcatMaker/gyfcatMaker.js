//importing config file for authentication, you can only get this if I send it to you
import config from '../FBauth/authConfig'

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

export default gifCutter;