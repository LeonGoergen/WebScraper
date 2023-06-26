import axios from "axios";

export class ServiceInstagram {
    constructor(){
        
        this.user_id = '12345';
        this.ACCESS_TOKEN = '123456789';
        this.url = 'https://graph.facebook.com/v17.0/'
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    makeMedia(movieObjekt){
        let caption = JSON.stringify({
            "text": `Ein neuer ${movieObjekt.genre}-Film für dich: ${movieObjekt.title}! \nDas sagen Andere:\nImdb: ${movieObjekt.imdbRating}\nRottenTomatoes: ${movieObjekt.rottenTomatoesRating}\n`
        });
        return {"image-url": movieObjekt.image, "caption": caption}
    }

    async uploadMedia(movieObjekt){
        try {
            let response = await this.axiosInstance.post(this.url + this.user_id + '/media', this.makeMedia(movieObjekt))
            return {"access_token": this.ACCESS_TOKEN, "creation_id": response} // response ist key value paar; value muss noch extrahiert werden
        }
        catch (err) {
            return err
        }
    }
}