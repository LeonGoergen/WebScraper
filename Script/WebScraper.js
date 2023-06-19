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
                console.log(`Scraping section "${section}"...`);
                try {
                    await element.click();
                    await this.page.waitForSelector('.ShowTile');
                    const sectionMovies = await this.scrapeMoviesFromSection();
                    movies.push(...sectionMovies);
                    console.log(`Scraped ${sectionMovies.length} movies\n`)
                } catch (error) {
                    console.log(`Error while scraping section "${section}"\n`);
                }
            } else {
                console.log(`Section "${section}" not found\n`);
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

    async getMovieRatings(movies, apiKey, language) {
        let moviesWithRatings = [];
        for (let movie of movies) {
            console.log("Get Rating for: '" + movie.title + "'...");
            try {
                const searchResponse = await axios.get(`https://imdb-api.com/${language}/API/SearchMovie/${apiKey}/${encodeURIComponent(movie.title)}`);
                const searchData = searchResponse.data;
                const imdbId = searchData.results[0].id;
                const ratingsResponse = await axios.get(`https://imdb-api.com/${language}/API/Ratings/${apiKey}/${imdbId}`);
                const ratingsData = ratingsResponse.data;
                console.log(ratingsData);

                let imdbRating = ratingsData.imDb;
                let rottenTomatoesRating = ratingsData.rottenTomatoes;
                moviesWithRatings.push({ title: movie.title, imdb: imdbRating, rotten: rottenTomatoesRating });
            } catch (error) {
                console.error(`Error fetching ratings for movie "${movie.title}":`, error);
                movie.imdbRating = "N/A";
                movie.rottenTomatoesRating = "N/A";
            }
        }
        return moviesWithRatings;
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async getMoviesFromWebsite(sections) {
        await this.launchBrowser();
        await this.openPage();
        await this.navigateToWebsite();
        await this.clickCookieButton();

        const movies = await this.scrapeMoviesFromSections(sections);
        await this.closeBrowser();
        return movies;
    }
}