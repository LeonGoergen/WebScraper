import {ServiceTwitter} from "./serviceTwitter.js";
import {errorHandler} from "./errorHandler.js";
import {ServiceInstagram} from "./serviceInsta.js";
import { ServiceReddit } from './serviceReddit.js';
import axios from "axios";

export class ApiManager {
    constructor() {}

    async getMovieRatings(movies, apiKey, language) {
        let moviesWithRatings = [];
        for (let movie of movies) {
            console.log("Get Rating for: '" + movie.title + "'...");
            try {
                const searchResponse = await axios.get(`https://imdb-api.com/${language}/API/SearchMovie/${apiKey}/${encodeURIComponent(movie.title)}`);
                const searchData = searchResponse.data;
                const image = searchData.results[0].image;

                const imdbId = searchData.results[0].id;
                const ratingsResponse = await axios.get(`https://imdb-api.com/${language}/API/Ratings/${apiKey}/${imdbId}`);
                const ratingsData = ratingsResponse.data;

                let imdbRating = ratingsData.imDb;
                let rottenTomatoesRating = ratingsData.rottenTomatoes;
                moviesWithRatings.push({ title: movie.title, genre: movie.genre, imdb: imdbRating, rotten: rottenTomatoesRating, image: image });
            } catch (error) {
                console.error(`Error fetching ratings for movie "${movie.title}":`, error);
                movie.imdbRating = "N/A";
                movie.rottenTomatoesRating = "N/A";
            }
        }
        return moviesWithRatings;
    }

    async postToTwitter(movie) {
        try {
            const Tweet = new ServiceTwitter;
            await Tweet.postTweet(movie)
            console.log("posted to twitter!");
        } catch (error) {
            console.log("error at twitter:");
            console.log(error);
        }
    }

    async postToInsta(movie) {
        try {
            const InstaPost = new ServiceInstagram();
            await InstaPost.uploadMedia(movie)
            console.log("posted to instagram!");
        } catch (error) {
            console.log("error at instagram:");
            console.log(error);
        }
    }

    async postToReddit(movie) {
        try {
            const RedditPost = new ServiceReddit();
            await RedditPost.postToReddit(movie)
            console.log("posted to reddit!");
        } catch (error) {
            console.log("error at reddit:");
            console.log(error);
        }
    }

    async postToSocialMedia(moviesWithRatings) {
        console.log("\nPosting to social media...")
        for (let movie of moviesWithRatings) {
            console.log(`\nTitle: "${movie.title}"\nGenre: "${movie.genre}"\nIMDB: "${movie.imdb}"\nRottenTomatoes: "${movie.rotten}"\nImage: "${movie.image}"\n`);
            //await this.postToTwitter(movie);
            //await this.postToInsta(movie);
            await this.postToReddit(movie);
        }
    }
}