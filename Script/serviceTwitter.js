import axios from "axios";
import Oauth1Helper from "./oauth1helper.js";

export class ServiceTwitter {
    constructor() {
        const request = {
            url: 'https://api.twitter.com/2/tweets',
            method: 'POST',
            body: {
                "text": ""
            }
        };

        const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);
        const Authorization = authHeader.Authorization;
        this.axiosInstance = axios.create({
            headers: {
                Authorization,
                'Content-Type': 'application/json',
            },
        })
    }
    async postTweet(movieObjekt) {
        try {
            const response= await this.axiosInstance.post(this.getUrl(), this.makeTweet(movieObjekt))
            return `Status: ${response.status} Tweet created`
        }
        catch (error) {
            throw error
        }
    }
    makeTweet(movieObjekt) {
        return JSON.stringify({
            "text": `Jetzt neu zu sehen: ${movieObjekt.title}! \nGenre: ${movieObjekt.genre}\n\nDas sagen Andere: \nImdb: ${movieObjekt.imdb} \nRottenTomatoes: ${movieObjekt.rotten}\n`
        })
    }
    getUrl() {
        return "https://api.twitter.com/2/tweets"
    }
}
