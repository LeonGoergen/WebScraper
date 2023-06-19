import {ServiceTwitter} from "./serviceTwitter.js";
import {errorHandler} from "./errorHandler.js";
import {ServiceInstagram} from "./serviceInsta.js";

export class SocialMediaManager {
    constructor() {}

    async postToTwitter(movie) {
        try {
            const Tweet = new ServiceTwitter;
            await Tweet.postTweet(movie)
            console.log("posted to twitter");
        } catch (error) {
            errorHandler(error,"error at twitter");
        }
    }

    async postToInsta(movie) {
        try {
            const InstaPost = new ServiceInstagram();
            await InstaPost.uploadMedia(movie)
            console.log("posted to instagram");
        } catch (error) {
            errorHandler(error,"error at instagram");
        }
    }

    async postToSocialMedia(moviesWithRatings) {
        for (let movie of moviesWithRatings) {
            console.log(`Try to post new movie "${movie.title}" with IMDB rating: ${movie.imdb}, Rotten Tomatoes rating: ${movie.rotten}`);
            await this.postToTwitter(movie);
            //await this.postToInsta(movie);
        }
    }
}
