import axios from "axios";
import Oauth1Helper from "./oauth1helper.js";

export class ServiceTwitter {
    constructor(){
        const request = {
            url: 'https://api.twitter.com/2/tweets',
            method: 'POST',
            body: {
                "text" : ""
            }
        };

        const authHeader =Oauth1Helper.getAuthHeaderForRequest(request);
        const Authorization=authHeader.Authorization;
        this.axiosInstance =axios.create({
            headers:{
                Authorization, 
                'Content-Type': 'application/json',  
            },
        })
    }
    async postTweet(movie){
        try{
            return await this.axiosInstance.post(this.getUrl(),this.makeTweet(movie))
        }
        catch(err){
            return err
        }
    }
    makeTweet(movie){
        var data = JSON.stringify({
            "text": `Jetzt neu zu sehen: ${movie}! \n #test`
        });
        return data
    }
    getUrl(){
        return "https://api.twitter.com/2/tweets"
    }
}