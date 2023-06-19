import express from 'express';

export class Server {
    constructor() {
        this.app = express();
        this.hostname = "0.0.0.0";
        this.port = 3000;
    }

    start() {
        this.app.get("/", (req, res) => {
            res.send("Cinema Notifications");
        });

        this.app.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}