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

(async () => {
    try {
        // Launch a headless Chrome browser
        const browser = await puppeteer.launch({ headless: false, slowMo: 20 });

        // Open a new tab
        const page = await browser.newPage();

        // Navigate to the website
        await page.goto('https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm');

        // Click on Cookie button
        await page.waitForSelector('.mmcm-btn.mmcm-btn-save-all');
        const cookieButton = await page.$('.mmcm-btn.mmcm-btn-save-all');
        await cookieButton.click();
        await page.waitForNavigation();

        // Define the sections to scrape
        const sections = ['Heute', 'Vorverkauf', 'TOP 10', 'Events', 'Vorschau'];

        // Scrape the movie titles for each section
        const movieTitles = [];
        for (const section of sections) {
            const [element] = await page.$x(`//span[contains(text(), "${section}")]`);
            if (element) {
                await element.click();
                await page.waitForSelector('.title');
                const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim().replace(/^Neu:\s*/, '')));
                movieTitles.push(...currentMovies);
            } else {
                console.log(`Section "${section}" not found`);
            }
        }

        // Filter out duplicates and empty strings
        const uniqueTitles = [...new Set(movieTitles.filter(title => title && title !== 'MEINE CineStarCARD' && title !== 'Passwort wiederherstellen'))];

        // Clean the titles from noise
        const cleanTitles = uniqueTitles.map(title => {
            // Remove leading numbers and spaces
            title = title.replace(/^\d+\s*/, '');
            // Remove Cinestar prefixes
            title = title.replace(/^Jeden \d+\.\s*/, '');
            title = title.replace(/^CineLady-Preview/, '');
            // Remove "(OV)" suffix
            title = title.replace(/\(OV\)$/, '');
            // Remove dates
            title = title.replace(/^Am \d+\.\d+\.:\s*/, '');
            // Remove other suffixes
            title = title.replace(/–.*$/, '');
            // Trim leading and trailing whitespace
            title = title.trim();
            return title;
        });

        // Sort out duplicates and empty strings
        const uniqueCleanTitles = cleanTitles.filter((title, index) => {
            return (
                title !== 'MEINE CineStarCARD' &&
                title !== 'Passwort wiederherstellen' &&
                title !== 'OV CineSneak: Surprise, Surprise!' &&
                title !== 'Montag: CineSneak - die Überraschungspreview' &&
                title !== '' &&
                index === cleanTitles.indexOf(title)
            );
        });

        uniqueCleanTitles.sort();
        console.log(`Found ${uniqueCleanTitles.length} unique movie titles:\n${JSON.stringify(uniqueCleanTitles, null, 2)}`);
        //console.log(uniqueCleanTitles);

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error(error);
    }
})();
