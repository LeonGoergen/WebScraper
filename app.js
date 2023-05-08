const puppeteer = require('puppeteer');
const {ConsoleMessage} = require("puppeteer");

(async () => {
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch({headless: false, slowMo: 100});

    // Open a new tab
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.cinestar.de/kino-rostock-capitol#Kinoprogramm');

    // Click on Cookie button
    await page.waitForSelector('.mmcm-btn.mmcm-btn-save-all');
    const [cookieButton] = await page.$$('.mmcm-btn.mmcm-btn-save-all');
    await cookieButton.click();
    await page.waitForNavigation();

    // Try to get the buttons "Woche", "Heute", "Top10", ...
    let sections = ["Heute", "Vorverkauf", "TOP 10", "Events", "Vorschau"]
    let movieTitles = [];
    for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        const [element] = await page.$x(`//span[contains(text(), '${section}')]`);
        if (element) {
            await element.click();
            const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
            movieTitles.push(...currentMovies);
        } else {
            console.log("element not found");
        }
    }

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