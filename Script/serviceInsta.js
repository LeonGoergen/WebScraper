import axios from "axios";

export class ServiceInstagram {
    constructor(){
        
        const user_id = '12345'
        const ACCESS_TOKEN = '123456789'
        const url = 'https://graph.facebook.com/v17.0/'
        const image_url = ''
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }


    makeMedia(movieObjekt){
        // Es muss ein JPEG erzeugt werden, welches den Filmtitel enthält
        //Alternativ könnte man auch ein Standard Bild nehmen und der Filmtitel ist in der Caption des Instaposts 
        // Das Bild muss über eine URL verfügbar sein.
        if (movieObjekt.genre==""){
            var caption = JSON.stringify({
                "text": `Jetzt neu zu sehen: ${movieObjekt.title}! \nDas sagen Andere: \nImdb: ${movieObjekt.imdbRating} \nRottenTomatoes: ${movieObjekt.rottenTomatoesRating}\n #test`
            });
            return {"image-url": image_url, "caption": caption}
        }
        else {
            var caption = JSON.stringify({
                "text": `Ein neuer ${movieObjekt.genre}-Film für dich: ${movieObjekt.title}! \nDas sagen Andere:\nImdb: ${movieObjekt.imdbRating}\nRottenTomatoes: ${movieObjekt.rottenTomatoesRating}\n #test`
            });
            return {"image-url": image_url, "caption": caption}
        }
    }

    async uploadMedia(movieObjekt){
        try {
            var response = await this.axiosInstance.post(url + user_id + '/media', this.makeMedia(movieObjekt))
            return {"access_token": ACCESS_TOKEN, "creation_id": response} // response ist key value paar; value muss noch extrahiert werden 
        }
        catch (err) {
            return err
        }
    }

    async publishMedia(movieObjekt){
        try {
            return await this.axiosInstance.post(url + user_id + '/media_publish', this.uploadMedia(movieObjekt))
        }
        catch (err) {
            return err
        }
    }

}