console.log("Hallo")

const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch();

    // Open a new tab
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.cinestar.de/kino-rostock-capitol');

    async function processMovieTitles(page) {
        // Find all div elements with the class "swiper-slide"
        const divElements = await page.$$eval('div.swiper-slide', elements => {
            return elements.filter(element => {
                // Check if the div element has only one child element which is a span element
                return element.childNodes.length === 1 && element.childNodes[0].nodeName.toLowerCase() === 'span';
            }).map(element => element.outerHTML);
        });

        // Loop through each div element and click on it
        for (const divElement of divElements) {
            await page.setContent(divElement);
            await page.click('span');
            await page.waitForSelector('.title');

            // Get the movie titles
            const movieTitles = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
            console.log(movieTitles);
        }
    }

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
    console.log(uniqueTitles.length)

    // Close the browser
    await browser.close();
})();