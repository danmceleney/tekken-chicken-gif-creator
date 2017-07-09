import config from './authConfig';

export function fbauth(e) {
    const postData = {
        grant_type: 'convert_code',
        provider: 'facebook',
        client_id: config.client_id,
        client_secret: config.client_secret,
        auth_code: config.auth_code
    }
}