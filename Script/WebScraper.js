import puppeteer from 'puppeteer';
import axios from 'axios';

export class WebScraper {
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
                const title = titleElement ? titleElement.textContent.trim() : '';
                const genre = genreElement ? genreElement.textContent.trim() : '';
                return { title, genre };
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
        let moviesWithRatings = [];
        for (let movie of movies) {
            console.log("Get Rating for: '" + movie + "'");
            try {
                const searchResponse = await axios.get(`https://imdb-api.com/${language}/API/SearchMovie/${apiKey}/${encodeURIComponent(movie)}`);
                const searchData = searchResponse.data;
                const imdbId = searchData.results[0].id;
                const ratingsResponse = await axios.get(`https://imdb-api.com/${language}/API/Ratings/${apiKey}/${imdbId}`);
                const ratingsData = ratingsResponse.data;
                console.log(ratingsData);

                let imdbRating = ratingsData.imDb;
                let rottenTomatoesRating = ratingsData.rottenTomatoes;
                moviesWithRatings.push({ title: movie, imdb: imdbRating, rotten: rottenTomatoesRating });
            } catch (error) {
                console.error(`Error fetching ratings for movie "${movie}":`, error);
                movie.imdbRating = "N/A";
                movie.rottenTomatoesRating = "N/A";
            }
        }
        return moviesWithRatings;
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async getMoviesFromWebsite(sections, specificGenres) {
        await this.launchBrowser();
        await this.openPage();
        await this.navigateToWebsite();
        await this.clickCookieButton();

        const movies = await this.scrapeMoviesFromSections(sections);
        await this.closeBrowser();
        const filteredMovies = WebScraper.filterMoviesByGenre(movies, specificGenres);
        return WebScraper.extractUniqueTitlesAndGenres(filteredMovies);
    }
}