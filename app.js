const puppeteer = require('puppeteer');

(async () => {
    try {
        // Launch a headless Chrome browser
        const browser = await puppeteer.launch({ headless: false, slowMo: 5 });

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
        const sections = ['Woche', 'Heute', 'Vorverkauf', 'TOP 10', 'Events', 'Vorschau'];

        // Scrape the movie titles and genres for each section
        const movies = [];
        for (const section of sections) {
            const [element] = await page.$x(`//span[contains(text(), "${section}")]`);
            if (element) {
                await element.click();
                await page.waitForSelector('.ShowTile');
                const sectionMovies = await page.$$eval('.ShowTile', elements => {
                    return elements.map(element => {
                        const titleElement = element.querySelector('.title');
                        const genreElement = element.querySelector('small');
                        const title = titleElement ? titleElement.textContent.trim() : '';
                        const genre = genreElement ? genreElement.textContent.trim() : '';
                        return { title, genre };
                    });
                });
                movies.push(...sectionMovies);
            } else {
                console.log(`Section "${section}" not found`);
            }
        }

        // Filter movies by specific genres
        const specificGenres = ['Event', 'Live-Übertragung', 'Sondervorstellung', 'Vorpremiere'];
        const filteredMovies = movies.filter(movie => !specificGenres.includes(movie.genre));

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

        console.log(`Found ${uniqueTitles.length} unique movie titles:\n${JSON.stringify(uniqueTitles, null, 2)}`);
        //console.log(uniqueTitles);

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error(error);
    }
})();
