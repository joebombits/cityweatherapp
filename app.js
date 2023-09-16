const express = require('express');
const app = express();
const https = require('https');
const path = require('path');
require('dotenv').config();

//adding css file
app.use(express.static(__dirname + '/public'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));



app.get("/",(req,res) => {

    res.render('index');

});


app.post("/", (req,res) => {
   
    const loc = req.body.location;
    const apiKey = process.env.apikey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKey}&units=metric`;

    https.get (url, (response) => {
        
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);

            

            if(weatherData.cod !== 200){
                
                
                const errLocation = req.body.location;
                res.render('errorlocation', {errLocation});
            }else{
                
                const cityName = weatherData.name;

                const cityTemp = weatherData.main.temp;

                const weatherImg = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

                const weatherDesc = weatherData.weather[0].description.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

                res.render('weatherResult', {cityName, cityTemp, weatherImg, weatherDesc});
            }
            
        });
    });

})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});