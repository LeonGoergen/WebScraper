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
            return await this.axiosInstance.post(this.getUrl(), this.makeTweet(movieObjekt))
        }
        catch (err) {
            return err
        }
    }
    makeTweet(movieObjekt) {
        if (movieObjekt.genre==""){
            var data = JSON.stringify({
                "text": `Jetzt neu zu sehen: ${movieObjekt.title}! \nDas sagen Andere: \nImdb: ${movieObjekt.imdbRating} \nRottenTomatoes: ${movieObjekt.rottenTomatoesRating}\n #test`
            });
            return data
        }
        else {
            var data = JSON.stringify({
                "text": `Ein neuer ${movieObjekt.genre}-Film für dich: ${movieObjekt.title}! \nDas sagen Andere:\nImdb: ${movieObjekt.imdbRating}\nRottenTomatoes: ${movieObjekt.rottenTomatoesRating}\n #test`
            });
            return data
        }
    }
    getUrl() {
        return "https://api.twitter.com/2/tweets"
    }
}
