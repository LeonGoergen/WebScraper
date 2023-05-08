const puppeteer = require('puppeteer');
const {ConsoleMessage} = require("puppeteer");

(async () => {
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch();

    // Open a new tab
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm');

    // Try to get the buttons "Woche", "Heute", "Top10", ...
    const [element] = await page.$x("//span[contains(text(), 'TOP 10')]");
    if (element) {
        console.log(element);
        await element.click();
        const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
        console.log(currentMovies);
    } else {
        console.log("element not found");
    }

    const movieTitles = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));

    // Clean the titles from "Neu:"
    const cleanTitles = movieTitles.map(title => title.replace('Neu:', ''));

    // Sort out duplicates
    const uniqueTitles = cleanTitles.filter((title, index) => {
        return (
            title !== 'MEINE CineStarCARD' &&
            title !== 'Passwort wiederherstellen' &&
            index === cleanTitles.indexOf(title)
        );
    });

    // Sort out empty strings
    if (uniqueTitles[uniqueTitles.length - 1] === '') {
        uniqueTitles.pop();
    }

    console.log("Cleaned Movie Titles:")
    console.log(uniqueTitles);
    console.log(uniqueTitles.length)

    // Close the browser
    await browser.close();
})();