/*
// Express Server
const express = require('express')
const app = express();
const hostname = "0.0.0.0";
const port = 3000;

app.get("/", (req, res) => {
    res.send("Cinema Notifications");
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/

// Webscraper
const puppeteer = require('puppeteer');
const axios = require('axios');

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
            console.log("Get Rating for: '" + movie.title + "'");
            try {
                const searchResponse = await axios.get(`https://imdb-api.com/${language}/API/SearchMovie/${apiKey}/${encodeURIComponent(movie.title)}`);
                const searchData = searchResponse.data;
                const imdbId = searchData.results[0].id;

                const ratingsResponse = await axios.get(`https://imdb-api.com/${language}/API/Ratings/${apiKey}/${imdbId}`);
                const ratingsData = ratingsResponse.data;
                console.log(ratingsData);

                movie.imdbRating = ratingsData.imDb;
                movie.rottenTomatoesRating = ratingsData.rottenTomatoes;
            } catch (error) {
                console.error(`Error fetching ratings for movie "${movie.title}":`, error);
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

(async () => {
    try {
        const sections = ['Woche', 'Heute', 'Vorverkauf', 'TOP 10', 'Events', 'Vorschau'];
        const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
        const url = 'https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm';

        const scraper = new WebScraper(url, false, 5);
        await scraper.launchBrowser();
        await scraper.openPage();
        await scraper.navigateToWebsite();
        await scraper.clickCookieButton();

        const movies = await scraper.scrapeMoviesFromSections(sections);
        const filteredMovies = WebScraper.filterMoviesByGenre(movies, specificGenres);
        const uniqueTitlesAndGenres = WebScraper.extractUniqueTitlesAndGenres(filteredMovies);

        // api keys erlauben nur 100 Anfragen pro Tag, habe noch einen zweiten hinzugefügt
        let apiKey = "k_3nmeydf9"
        // let apiKey = "k_x53sp327"

        const moviesWithRatings = await scraper.getMovieRatings(uniqueTitlesAndGenres, apiKey, "de");

        console.log(`Found ${moviesWithRatings.length} unique movies:\n${JSON.stringify(moviesWithRatings, null, 2)}`);

        await scraper.closeBrowser();
    } catch (error) {
        console.error(error);
    }
})();