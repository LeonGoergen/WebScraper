import axios from "axios";

export class ServiceInstagram {
    constructor(){
        
        const user_id = '12345'
        const ACCESS_TOKEN = '123456789'
        const url = 'https://graph.facebook.com/v17.0/'
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }


    makeMedia(movie){
        // Es muss ein JPG erzeugt werden, welches den Filmtitel enthält
        //Alternativ könnte man auch ein Standard Bild nehmen und der Filmtitel ist in der Caption des Instaposts 
    }

    async uploadMedia(){
        try {
            const response = await this.axiosInstance.post(url + user_id + '/media', this.makeMedia(movie))
            return {"access_token": ACCESS_TOKEN, "creation_id": response} // response ist key value paar; value muss noch extrahiert werden 
        }
        catch (err) {
            return err
        }
    }

    async publishMedia(){
        try {
            return await this.axiosInstance.post(url + user_id + '/media_publish', this.uploadMedia())
        }
        catch (err) {
            return err
        }
    }

}