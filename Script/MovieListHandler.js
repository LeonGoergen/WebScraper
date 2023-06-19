import fs from 'fs';

export class MovieListHandler {
    constructor() {
        this.pathToFile = './movie_list.json';
    }

    filterMoviesByGenre(movies, genresToExclude) {
        let filteredMovies = movies.filter(movie => !genresToExclude.includes(movie.genre));
        console.log(`Filtered ${movies.length} movies to ${filteredMovies.length} movies\n`);
        return filteredMovies;
    }

    extractUniqueTitlesAndGenres(filteredMovies) {
        const uniqueMovies = filteredMovies.reduce((acc, movie) => {
            let title = movie.title.trim().replace(/^\d+\s*/, '').replace(/^Neu:\s*/, '');

            const existingMovie = acc.find(m => m.title === title);
            if (!existingMovie) {
                acc.push({ title, genre: movie.genre });
            }
            return acc;
        },[]);

        uniqueMovies.sort((a, b) => a.title.localeCompare(b.title));
        console.log(`Extracted ${uniqueMovies.length} unique movies\n`);

        return uniqueMovies;
    }

    readOldMovieList() {
        try {
            let data = fs.readFileSync(this.pathToFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    writeNewMovieList(movieList) {
        try {
            let data = JSON.stringify(movieList, null, 2);
            fs.writeFileSync(this.pathToFile, data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    findNewMovies(currentMovies, oldMovies) {
        let newMovies = [];
        for (let movie of currentMovies) {
            if (!oldMovies.find(oldMovie => oldMovie.title === movie.title)) {
                newMovies.push(movie);
            }
        }
        console.log(`Found ${newMovies.length} new movies\n`);
        return newMovies;
    }

    async handleMovieList(movies, specificGenres) {
        if (movies.length === 0) {
            console.log('No movies found');
            return [];
        } else {
            const filteredMovies = this.filterMoviesByGenre(movies, specificGenres);
            const uniqueTitlesAndGenres = this.extractUniqueTitlesAndGenres(filteredMovies);

            let oldMovies = this.readOldMovieList();
            let newMovies = this.findNewMovies(uniqueTitlesAndGenres, oldMovies);

            this.writeNewMovieList(uniqueTitlesAndGenres);

            return newMovies;
        }
    }
}