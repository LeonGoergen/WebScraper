console.log("Hallo")

const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch();

    // Open a new tab
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.cinestar.de/kino-rostock-capitol');

    // Wait for the movie titles to be loaded
    await page.waitForSelector('.title');

    // Get the movie titles
    const movieTitles = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));

    // Clean the titles from "Neu:" and empty strings
    const cleanTitles = movieTitles.map(title => title.replace('Neu:', ''));
    if (cleanTitles[cleanTitles.length - 1] === '') {
        cleanTitles.pop();
    }

    // Sort out duplicates
    const uniqueTitles = cleanTitles.filter((title, index) => {
        return (
            title !== 'MEINE CineStarCARD' &&
            title !== 'Passwort wiederherstellen' &&
            index === cleanTitles.indexOf(title)
        );
    });
    console.log(uniqueTitles);

    // Close the browser
    await browser.close();
})();