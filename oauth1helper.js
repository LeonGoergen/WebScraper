import crypto from 'crypto'
import oauth1a from 'oauth-1.0a'
import secrets from "./secrets.js";

const CONSUMERKEY = secrets.consumerKey;
const CONSUMERSECRET = secrets.consumerSecret;
const TOKENKEY = secrets.tokenKey;
const TOKENSECRET = secrets.tokenSecret;

class Oauth1Helper {
    static getAuthHeaderForRequest(request) {
        const oauth = oauth1a({
            consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto
                    .createHmac('sha1', key)
                    .update(base_string)
                    .digest('base64')
            },
        })

        const authorization = oauth.authorize(request, {
            key: TOKENKEY,
            secret: TOKENSECRET,
        });

        return oauth.toHeader(authorization);
    }
}

export default Oauth1Helper;

