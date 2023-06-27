import express from 'express';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export class Server {
    constructor() {
        this.app = express();
        this.hostname = "0.0.0.0";
        this.port = 3000;
        this.app.use(express.static(path.join(__dirname, 'Webseite')));
    }

    start(main) {
        this.app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname,'Webseite','index.html'));
        });

        this.app.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });

        setInterval(main, 120000)
    }
}