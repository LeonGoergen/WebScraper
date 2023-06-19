import {WebScraper} from "./WebScraper.js";
import {MovieHandler} from "./MovieHandler.js";
import {ApiManager} from "./ApiManager.js";

(async () => {
    try {
        const sections = ['Woche', 'Heute', 'TOP10', 'Vorverkauf',  'Events', 'Vorschau'];
        const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
        const url = 'https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm';
        const apiKey = "k_r5zmhtbn";

        const scraper = new WebScraper(url, false, 0);
        const movies = await scraper.getMoviesFromWebsite(sections);

        const movieHandler = new MovieHandler();
        const newMovies = await movieHandler.handleMovieList(movies, specificGenres);

        if (newMovies.length === 0) {
            console.log('No new movies found');
            return;
        }
        const apiManager = new ApiManager();
        const moviesWithRatings = await apiManager.getMovieRatings(newMovies, apiKey, "de");
        await apiManager.postToSocialMedia(moviesWithRatings);
        
    } catch (error) {
        console.error(error);
    }
})();