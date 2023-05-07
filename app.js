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

    try {
    // Click on each selection button and wait for the HTML to become visible
    const selectionTypes = ['Woche', 'Heute', 'Vorverkauf', 'Top 10', 'Events', 'Vorschau'];
    const swiperSlides = await page.$$('.ShowFilterView .swiper-slide');
    for (let i = 0; i < swiperSlides.length; i++) {
        const span = await swiperSlides[i].$('span');
        const spanText = await page.evaluate(el => el.textContent, span);
        console.log(spanText);
        if (selectionTypes.includes(spanText)) {
            await page.waitForTimeout(2000);
            console.log(`Clicking on ${swiperSlides[i]} button`);
            await swiperSlides[i].click();
            console.log(`Clicked on ${swiperSlides[i]} button`);
            await page.waitForSelector(`.ShowFilterView.${spanText}`, { visible: true, timeout: 5000 });

            const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
            console.log(currentMovies);
        }
    }
    } catch (error) {
        console.error(error);
    }

    const movieTitles = []
    for (let i = 0; i < elements.length; i++) {
        await elements[i].click(); // Button click does not seem to work
        await page.waitForSelector('.title');

        // Get the movie titles
        const currentMovies = await page.$$eval('.title', elements => elements.map(element => element.textContent.trim()));
        movieTitles.push(...currentMovies);
        //console.log(currentMovies);
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
    console.log("Cleaned Movie Titles:")
    console.log(uniqueTitles);
    console.log(uniqueTitles.length)

    // Close the browser
    await browser.close();
})();