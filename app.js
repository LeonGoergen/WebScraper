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

// Webscraper
const puppeteer = require('puppeteer');

async function launchBrowser() {
    // Launch a headless Chrome browser
    return await puppeteer.launch({headless: false, slowMo: 5});
}

async function openPage(browser) {
    // Open a new tab
    return await browser.newPage();
}

async function navigateToWebsite(page) {
    // Navigate to the website
    await page.goto('https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm');
}

async function clickCookieButton(page) {
    // Click on Cookie button
    await page.waitForSelector('.mmcm-btn.mmcm-btn-save-all');
    const cookieButton = await page.$('.mmcm-btn.mmcm-btn-save-all');
    await cookieButton.click();
    await page.waitForNavigation();
}

async function scrapeMovieTitles(page) {
    const sections = ['Woche', 'Heute', 'Vorverkauf', 'TOP 10', 'Events', 'Vorschau'];
    const movies = [];

    for (const section of sections) {
        const element = await findSectionElement(page, section);

        if (element) {
            await element.click();
            await page.waitForSelector('.ShowTile');
            const sectionMovies = await scrapeSectionMovies(page);
            movies.push(...sectionMovies);
        } else {
            console.log(`Section "${section}" not found`);
        }
    }

    return movies;
}

async function findSectionElement(page, section) {
    const [element] = await page.$x(`//span[contains(text(), "${section}")]`);
    return element;
}

async function scrapeSectionMovies(page) {
    return await page.$$eval('.ShowTile', elements => {
        return elements.map(element => {
            const titleElement = element.querySelector('.title');
            const genreElement = element.querySelector('small');
            const title = titleElement ? titleElement.textContent.trim() : '';
            const genre = genreElement ? genreElement.textContent.trim() : '';
            return {title, genre};
        });
    });
}


async function filterMoviesByGenre(movies) {
    // Filter movies by specific genres
    const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
    return movies.filter(movie => !specificGenres.includes(movie.genre));
}

async function extractUniqueTitles(filteredMovies) {
    // Extract unique movie titles after cleaning
    const uniqueTitles = [...new Set(filteredMovies.map(movie => {
        let title = movie.title.trim();
        // Remove leading numbers and spaces
        title = title.replace(/^\d+\s*/, '');
        // Clean the titles from "Neu:"
        title = title.replace(/^Neu:\s*/, '');
        return title;
    }))];

    // Sort the clean titles
    uniqueTitles.sort();

    return uniqueTitles;
}

(async () => {
    try {
        const browser = await launchBrowser();
        const page = await openPage(browser);
        await navigateToWebsite(page);
        await clickCookieButton(page);
        const movies = await scrapeMovieTitles(page);
        const filteredMovies = await filterMoviesByGenre(movies);
        const uniqueTitles = await extractUniqueTitles(filteredMovies);

        console.log(`Found ${uniqueTitles.length} unique movie titles:\n${JSON.stringify(uniqueTitles, null, 2)}`);
        // console.log(uniqueTitles);

        await browser.close();
    } catch (error) {
        console.error(error);
    }
})();
