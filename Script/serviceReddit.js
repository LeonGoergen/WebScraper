import axios from 'axios';
import qs from 'querystring';
import secrets from "./secrets.js";

export class ServiceReddit {
    constructor() {
        this.redditUsername = secrets.redditUsername;
        this.redditPassword = secrets.redditPassword;
        this.clientId = secrets.clientId;
        this.clientSecret = secrets.clientSecret;

        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'User-Agent': 'MyApp/1.0.0'
            }
        });
    }

    async postToReddit(movieObjekt) {
        try {
            // Access-Token abrufen
            const tokenResponse = await this.axiosInstance({
                url: 'https://www.reddit.com/api/v1/access_token',
                method: 'post',
                auth: {
                    username: this.clientId,
                    password: this.clientSecret,
                },
                data: qs.stringify({
                    grant_type: 'password',
                    username: this.redditUsername,
                    password: this.redditPassword,
                }),
            });

            // Der Zugriffstoken
            const token = tokenResponse.data.access_token;

            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Post erstellen
            const response = await this.axiosInstance.post(
                'https://oauth.reddit.com/api/submit',
                qs.stringify({
                    sr: 'r/cinemaSoSe23',  // Name des Subreddits
                    title: movieObjekt.title,  // Titel des Posts
                    text: `Genre: ${movieObjekt.genre}\n\nDas sagen Andere: \nImdb: ${movieObjekt.imdb} \nRottenTomatoes: ${movieObjekt.rotten}`,
                    kind: 'self',  // 'self' für Textpost, 'link' für Linkpost
                })
            );

            return `Status: ${response.status} Post created`;
        }
        catch (error) {
            throw error;
        }
    }
}