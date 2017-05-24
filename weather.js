#!/usr/bin/env node

const http = require('http');
const querystring = require('querystring');
const WEATHER_API_KEY = require('./config').API_KEY; 

function getLocation() {

    return new Promise((resolve, reject) => {

        let rawData = '';
        http.get('http://ip-api.com/json', (response) => {

            response.on('data', function(data) {
                rawData += data;
            });

            response.on('end', function() {
                resolve(JSON.parse(rawData));
            });

            response.on('error', function(data) {
                reject(data);
            });

        }).end();

    });

}

function getWeather({ city, countryCode }) {

    return new Promise((resolve, reject) => {

        let rawData = '';

        let qs = querystring.stringify({ 

            city, 
            countryCode, 
            APPID: WEATHER_API_KEY

        }); 

        http.get(`http://api.openweathermap.org/data/2.5/weather?q=${qs}`, (response) => {

            response.on('data', function(data) {
                rawData += data;
            });

            response.on('end', function() {
                resolve( JSON.parse(rawData) );
            });

            response.on('error', function(data) {
                reject(data);
            });

        }).end();

    });

}

getLocation().then(data => {

    const { city, countryCode } = data;

    return getWeather({

        city,
        countryCode

    });


})
.then(data => {

    const { temp_min, temp_max, temp } = data.main;
    console.log(`temp: ${ temp }`);
    console.log(`min: ${ temp_min}\nmax: ${ temp_max }`);

})
.catch(e => {
    throw e;
});
