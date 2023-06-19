import {WebScraper} from "./WebScraper.js";
import {MovieListHandler} from "./MovieListHandler.js";
import {SocialMediaManager} from "./SocialMediaManager.js";

(async () => {
    try {
        const sections = ['Woche', 'Heute', 'Vorverkauf',  'Events', 'Vorschau'];
        const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
        const url = 'https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm';

        const scraper = new WebScraper(url, false, 0);
        const movies = await scraper.getMoviesFromWebsite(sections, specificGenres);

        const movieListHandler = new MovieListHandler();
        const newMovies = await movieListHandler.handleMovieList(movies);

        //const apiKey = "k_3nmeydf9";
        //const apiKey = "k_x53sp327";
        //const apiKey = "k_esxidu8j";
        //const apiKey = "k_yd9yt8yz";
        const apiKey = "k_r5zmhtbn";
        const moviesWithRatings = await scraper.getMovieRatings(newMovies, apiKey, "de");

        const socialMediaManager = new SocialMediaManager();
        await socialMediaManager.postToSocialMedia(moviesWithRatings);
    } catch (error) {
        console.error(error);
    }
})();