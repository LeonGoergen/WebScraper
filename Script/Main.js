import {WebScraper} from "./WebScraper.js";
import {MovieHandler} from "./MovieHandler.js";
import {ApiManager} from "./ApiManager.js";

function main(){
(async () => {
    try {
        const sections = ['Woche', 'Heute', 'TOP10', 'Vorverkauf',  'Events', 'Vorschau'];
        const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
        const url = 'https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm';

        const scraper = new WebScraper(url, false, 50);
        const movies = await scraper.getMoviesFromWebsite(sections);

        const movieHandler = new MovieHandler();
        const newMovies = await movieHandler.handleMovieList(movies, specificGenres);

        if (newMovies.length === 0) {
            console.log('No new movies found');
            return;
        }

        const apiManager = new ApiManager();
        const moviesWithRatings = await apiManager.getMovieRatings(newMovies, "de");
        await apiManager.postToSocialMedia(moviesWithRatings);
        
    } catch (error) {
        console.error(error);
    }
})();
}

main();
//const server = new Server();
//server.start(main)

