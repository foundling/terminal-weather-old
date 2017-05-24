#!/usr/bin/env node

const chalk = require('chalk');
const http = require('http');
const querystring = require('querystring');
const config = require('./config.json');
const WEATHER_API_KEY = require('./config').API_KEY; 
const CACHE_INTERVAL = 1000 * 60;

/*
const weatherToColorMap = {

    rain: 'blue',
    Drizzle: 'blue',
    Snow: 'white',
    Clear: 'yellow',
    Clouds: 'yellow'

};
*/

function checkCacheAndMaybeRun(cb) {

    // cache out of date  
    if (!config.cache || config.cache && new Date().getTime() - config.cache.lastRequestDate > CACHE_INTERVAL) {
        return cb()
    }

    // cache still good
    process.stdout.write(chalk.red(config.cache.weather));

}

function cacheWeatherData(weather, color) {

    config.cache = {
        lastRequestDate: new Date().getTime(),
        weather: weather
    };

    require('fs').writeFile('./config.json', JSON.stringify(config), function(err) {
        if (err) throw err; 
    });

}

function main() {

    getLocation().then(locationData => {

        const { city, countryCode } = locationData;

        return getWeather({

            city,
            countryCode

        });


    })
    .then(weatherData => {

        const { 

            temp, 
            temp_min,
            temp_max

        } = weatherData.main;

        const description = weatherData.weather[0].description;
        const fontColor = weatherToColorMap[description];

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

checkCacheAndMaybeRun(main);
