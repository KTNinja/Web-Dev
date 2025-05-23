const express = require('express');
const app = express();
const axios = require('axios');


const options = {
    method: "GET",
    url: 'https://youtube138.p.rapidapi.com/auto-complete/',
    params: {
        q: 'desp',
        hl: 'en',
        gl: 'US'
    },
    headers: {
        'x-rapidapi-host': 'youtube138.p.rapidapi.com'
    }
}

const getYoutubeVideos = async() =>{
    try{
        const response = await axios.request(options);
        console.log(response.data);
    } catch(error){
        console.error(error);
    }
}

app.get("/", (req, res) => {
    getYoutubeVideos();
})

app.listen("3001", () => {
    console.log("PORT listening at 3001");
})