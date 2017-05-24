#!/usr/bin/env node

const http = require('http');
const querystring = require('querystring');
const config = require('./config.json');
const WEATHER_API_KEY = require('./config').API_KEY; 
const CACHE_INTERVAL = 1000 * 60;
const colorLib = require('color');

const weatherToColor = {

    rain: 'blue',
    Drizzle: 'blue',
    Snow: 'white',
    Clear: 'yellow',
    Clouds: 'yellow'

};

function cacheWeatherData(weather, color) {
    config.cache = {
        lastRequestDate: new Date().getTime(),
        weather: weather,
        color: color 
    };

    require('fs').writeFile('./config.json', JSON.stringify(config), function(err) {
        if (err) throw err; 
    });
}

function checkCache(cb) {

    // cache out of date  
    if (!config.cache || config.cache && new Date().getTime() - config.cache.lastRequestDate > CACHE_INTERVAL) {
        return cb()
    }

    // cache still good
    process.stdout.write(config.cache.weather);

}

function terminalWeather() {

    getLocation().then(data => {

        const { city, countryCode } = data;

        return getWeather({

            city,
            countryCode

        });


    })
    .then(data => {

        const { 

            temp, 
            temp_min,
            temp_max

        } = data.main;

        const description = data.weather[0].description;
        const fontColor = weatherToColor[description];

        cachedWeather = `min: ${ temp_min }  max: ${ temp_max } | ${ description }`;
        cacheWeatherData(cachedWeather, fontColor);
        process.stdout.write(cachedWeather);

    })
    .catch(e => {
        throw e;
    });
}

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

checkCache(terminalWeather);
