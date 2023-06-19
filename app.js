import { createRequire } from 'module';
import { ServiceTwitter } from "./service-twitter.js"
import { errorHandler } from './errorhandler.js';
import { ServiceInstagram } from './service-insta.js';
const require = createRequire(import.meta.url);

// Express Server
const express = require('express')
const app = express();
const hostname = "0.0.0.0";
const port = 3000;

// Twitter API


app.get("/", (req, res) => {
    res.send("Cinema Notifications");
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


// Webscraper
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require("fs");


class WebScraper {
    constructor(url, headless = true, slowMo = 0) {
        this.url = url;
        this.browser = null;
        this.page = null;
        this.headless = headless;
        this.slowMo = slowMo;
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({ headless: this.headless, slowMo: this.slowMo });
    }

    async openPage() {
        this.page = await this.browser.newPage();
    }

    async navigateToWebsite() {
        await this.page.goto(this.url);
    }

    async clickCookieButton() {
        await this.page.waitForSelector('.mmcm-btn.mmcm-btn-save-all');
        const cookieButton = await this.page.$('.mmcm-btn.mmcm-btn-save-all');
        await cookieButton.click();
        await this.page.waitForNavigation();
    }

    async scrapeMoviesFromSections(sections) {
        let movies = [];
        for (const section of sections) {
            const element = await this.findSectionElement(section);
            if (element) {
                await element.click();
                await this.page.waitForSelector('.ShowTile');
                const sectionMovies = await this.scrapeMoviesFromSection();
                movies.push(...sectionMovies);
            } else {
                console.log(`Section "${section}" not found`);
            }
        }
        return movies;
    }

    async findSectionElement(section) {
        const [element] = await this.page.$x(`//span[contains(text(), "${section}")]`);
        return element;
    }

    async scrapeMoviesFromSection() {
        return await this.page.$$eval('.ShowTile', elements => {
            return elements.map(element => {
                const titleElement = element.querySelector('.title');
                const genreElement = element.querySelector('small');
                const additionalInfoElement = element.querySelector('.subline .date');
                const title = titleElement ? titleElement.textContent.trim() : '';
                const genre = genreElement ? genreElement.textContent.trim() : '';
                const date = additionalInfoElement ? additionalInfoElement.textContent.trim() : '';
                return { title, genre, date };
            });
        });
    }

    static filterMoviesByGenre(movies, genresToExclude) {
        return movies.filter(movie => !genresToExclude.includes(movie.genre));
    }

    static extractUniqueTitlesAndGenres(filteredMovies) {
        const uniqueMovies = filteredMovies.reduce((acc, movie) => {
            let title = movie.title.trim().replace(/^\d+\s*/, '').replace(/^Neu:\s*/, '');

            const existingMovie = acc.find(m => m.title === title);
            if (!existingMovie) {
                acc.push({ title, genre: movie.genre });
            }
            return acc;
        }, []);

        uniqueMovies.sort((a, b) => a.title.localeCompare(b.title));

        return uniqueMovies;
    }

    async getMovieRatings(movies, apiKey, language) {
        for (let movie of movies) {
            console.log("Get Rating for: '" + movie + "'");
            try {
                const searchResponse = await axios.get(`https://imdb-api.com/${language}/API/SearchMovie/${apiKey}/${encodeURIComponent(movie)}`);
                const searchData = searchResponse.data;
                console.log(searchData)
                const imdbId = searchData.results[0].id;

                const ratingsResponse = await axios.get(`https://imdb-api.com/${language}/API/Ratings/${apiKey}/${imdbId}`);
                const ratingsData = ratingsResponse.data;
                console.log(ratingsData);

                movie.imdbRating = ratingsData.imDb;
                movie.rottenTomatoesRating = ratingsData.rottenTomatoes;
            } catch (error) {
                console.error(`Error fetching ratings for movie "${movie}":`, error);
                movie.imdbRating = "N/A";
                movie.rottenTomatoesRating = "N/A";
            }
        }

        return movies;
    }

    async closeBrowser() {
        await this.browser.close();
    }
}

function getnewMovies(currentMovies) {
    var newMovies = [];
    try {
        var oldMovies = fs.readFileSync("movie_list.json");
    } catch (error) {
        console.error(error);
        throw error;
    }
    oldMovies = JSON.parse(oldMovies);
    //console.log("New Movies" + typeof oldMovies)
    //console.log("Current : " + typeof currentMovies)

    try {
        if (typeof oldMovies !== 'object' || typeof currentMovies !== 'object') {
            return false;
        }   
       
        const newMovies = [];
        const currentMovieList = [];
        const oldMovieList = [];

      
        for (let i = 0; i < currentMovies.length; i++) {          
            const obj2 = currentMovies[i];
            const keys = Object.keys(obj2);

           

            for (let key of keys) {
                
                if (key != "genre") {

                    currentMovieList.push(obj2[key]);
                    // console.log("current Movie:" + obj2[key])
                }
            }
        }
        
         for (let i = 0; i < oldMovies.length; i++) {           
            const obj2 = oldMovies[i];            
            const keys = Object.keys(obj2);       

            for (let key of keys) {
                
                if (key != "genre") {

                    oldMovieList.push(obj2[key]);
                    // console.log("old Movie:" + obj2[key])
                }
            }
        }
        //console.log(currentMovieList + "+" + oldMovieList)
        for (let movie in currentMovieList ) {
            if (oldMovieList.includes(currentMovieList[movie]))
            {
                continue
            }
            else {
                newMovies.push(currentMovieList[movie]);
            }
        }

        return newMovies;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

(async () => {
    try {
        //const sections = ['Woche', 'Heute', 'Vorverkauf', 'TOP 10', 'Events', 'Vorschau'];
        const sections = ['Woche', 'Heute', 'Vorverkauf',  'Events', 'Vorschau'];
        const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
        const url = 'https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm';

        const scraper = new WebScraper(url, false, 0);
        await scraper.launchBrowser();
        await scraper.openPage();
        await scraper.navigateToWebsite();
        await scraper.clickCookieButton();
        

        const movies = await scraper.scrapeMoviesFromSections(sections);
        await scraper.closeBrowser();
        const filteredMovies = WebScraper.filterMoviesByGenre(movies, specificGenres);
        const uniqueTitlesAndGenres = WebScraper.extractUniqueTitlesAndGenres(filteredMovies);

        // api keys erlauben nur 100 Anfragen pro Tag, habe noch einen zweiten hinzugefügt
        
        //let apiKey = "k_3nmeydf9";
        //let apiKey = "k_x53sp327";
        let apiKey = "k_esxidu8j";


        // const moviesWithRatings = await scraper.getMovieRatings(uniqueTitlesAndGenres, apiKey, "de");



        // Compare movie_list.json and uniqueTitlesAndGenres, saved var newMovies 

        try {
            var movie_list = []
            for (let movie in uniqueTitlesAndGenres) {
                movie_list.push(uniqueTitlesAndGenres[movie])
            }
            var newMovies = getnewMovies(movie_list);
            console.log(newMovies)
            movie_list = JSON.stringify(movie_list, null, 2)
        } catch (error) {
            console.error(error);
        }

        // Only write to Json if new movies found
        if (false) {

            fs.writeFile("movie_list.json", movie_list, (error) => {
                if (error) {
                    console.error(error);
                    throw error;
                }

            });
        }


         try {
            //const moviesWithRatings = await scraper.getMovieRatings(newMovies, apiKey, "de");
            //console.log(`Found ${moviesWithRatings.length} unique movies:\n${JSON.stringify(moviesWithRatings, null, 2)}`);
         } catch (error) {
            
         }

        // Here goes the API Twitter and Instagram calls 
        // How da fck do i tweet ?
        try {
           const Tweet = new ServiceTwitter
           await Tweet.postTweet(newMovies[0])
        } catch (error) {
            errorHandler(error,"twitter");
        }
        /* 
        try {
            const InstaPost = new ServiceInstagram
            await InstaPost.uploadMedia(newMovies[0])
         } catch (error) {
             errorHandler(error,"instagram");
         }
        */

        
    } catch (error) {
        console.error(error);
    }
})();