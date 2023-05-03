const puppeteer = require('puppeteer');
const {ConsoleMessage} = require("puppeteer");

(async () => {
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch();

    // Open a new tab
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.cinestar.de/kino-rostock-capitol');

    // Try to get the buttons "Woche", "Heute", "Top10", ...
    const elements = await page.$$('.swiper-slide');

    const movieTitles = []
    for (let i = 0; i < elements.length; i++) {
        await elements[i].click(); // Button click does not seem to work
        await page.waitForSelector('.title');

        // Get the movie titles
        const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
        movieTitles.push(...currentMovies);
        console.log(currentMovies);
    }

//    async function processMovieTitles(page) {
//        // Find all div elements with the class "swiper-slide"
//        const divElements = await page.$$eval('div.swiper-slide', elements => {
//            return elements.filter(element => {
//                // Check if the div element has only one child element which is a span element
//                if (element.childNodes.length === 1 && element.childNodes[0].nodeName.toLowerCase() === 'span'){
//                    console.log(element)
//                }
//                return element.childNodes.length === 1 && element.childNodes[0].nodeName.toLowerCase() === 'span';
//            }).map(element => element.outerHTML);
//        });
//
//
//        // Loop through each div element and click on it
//        for (const divElement of divElements) {
//            console.log(`Clicking on "${divElement}"`)
//            const parentDivElement = await divElement.$('..');
//            await parentDivElement.click();
//            await page.waitForSelector('.title');
//
//            // Get the movie titles
//            const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
//            movieTitles.push(...currentMovies);
//            console.log(currentMovies);
//        }
//    }

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
    console.log("Cleaned Movie Titles:")
    console.log(uniqueTitles);
    console.log(uniqueTitles.length)

    // Close the browser
    await browser.close();
})();