#!/usr/bin/env node

const http = require('http');
const querystring = require('querystring');
const WEATHER_API_KEY = require('./config').API_KEY; 
const weatherHost = 'api.openweathermap.org';
const weatherPath = '/data/2.5/weather';
const geolocationHost = 'ip-api.com';
const geolocationPath = '/json';

function getLocation() {

    return new Promise((resolve, reject) => {

        let result = '';

        const options = {
            host: geolocationHost,
            path: geolocationPath
        };

        http.request(options, (response) => {

            response.on('data', function(data) {
                result += data;
            });

            response.on('end', function() {
                resolve(result);
            });

            response.on('error', function(data) {
                reject(data);
            });

        }).end();

    });

}

function getWeather({ city, countryCode}) {

    console.log(city);
    return new Promise((resolve, reject) => {

        let result = '';

        let qs = querystring.stringify({ 

            city: city, 
            countryCode: countryCode, 
            APPID: WEATHER_API_KEY

        }); 

        const options = {
            host: weatherHost,
            path: `${weatherPath}?q=${qs}`
        };

        http.request(options, (response) => {

            response.on('data', function(data) {
                result += 'data';
            });

            response.on('end', function(data) {
                resolve(data);
            });

            response.on('error', function(data) {
                reject(data);
            });

        }).end();
    });
}

getLocation().then(data => {

    let { city, countryCode } = data;

    return getWeather({

        city,
        countryCode

    });

})
.then(data => {

    console.log(data);

}).catch(e => {
    throw e;
});
