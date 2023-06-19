import fs from 'fs';

export class MovieListHandler {
    constructor() {
    }

    async getOldMovies() {
        try {
            const oldMoviesData = fs.readFileSync("movie_list.json");
            return JSON.parse(oldMoviesData);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async saveCurrentMovies(movies) {
        fs.writeFileSync("movie_list.json", JSON.stringify(movies, null, 2));
    }

    async getNewMovies(currentMovies, oldMovies) {
        const currentMovieList = currentMovies.map(m => m.title);
        const oldMovieList = oldMovies.map(m => m.title);

        return currentMovieList.filter(movie => !oldMovieList.includes(movie));
    }

    async handleMovieList(movies) {
        const oldMovies = await this.getOldMovies();
        const newMovies = await this.getNewMovies(movies, oldMovies);
        await this.saveCurrentMovies(movies);
        return newMovies;
    }
}