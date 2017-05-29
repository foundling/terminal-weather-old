#!/usr/bin/env node

var http; 
const querystring = require('querystring');
const path = require('path');
const symbols = require('./symbols');
const config = require('./config.json');

const WEATHER_API_KEY = require('./config').API_KEY; 
const CACHE_INTERVAL = config.cacheInterval; // 1000;// * 60 * 10;// cache for 10 min according to openweathermap policy.

module.exports = exports = function() {
    checkCacheAndMaybeRun(config.cache, main);
};

function checkCacheAndMaybeRun(cache,fn) {

    let now = new Date();

    // no cache or cache out of date  
    if (!cache || cache && (now.getTime() - cache.lastRequestDate > CACHE_INTERVAL)) {
        return fn()
    }

    // cache exists and is still valid
    process.stdout.write(cache.weather);

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

        const weatherString = buildWeatherString(weatherData, symbols);
        cacheWeatherData(weatherString);
        process.stdout.write(weatherString);

    })
    .catch(e => {
        throw e;
    });
}

function getLocation() {

    return new Promise((resolve, reject) => {

        let rawData = '';
        http = http || require('http');
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

function KToF(K) {
    return parseInt( ((parseFloat(K)*9)/5) - 459.67);
};

function buildWeatherString(weatherData, symbols) {

    let { temp, temp_min, temp_max } = weatherData.main;
    //let { description } = weatherData.weather[0];
    let description = 'clouds';

    let matchingDescriptions = Object.keys(symbols.icons).filter(key => description.includes(key));
    let symbol = matchingDescriptions ? symbols.icons[ matchingDescriptions[0] ] : description;
    
    let formattedString = `l:${ KToF(temp_min) }° h:${ KToF(temp_max) }° | ${ KToF(temp) }° ${ symbol }. `;
    return formattedString;
}

function cacheWeatherData(weather) {

    let lastRequestDate = new Date().getTime();

    config.cache = {
        weather,
        lastRequestDate
    };

    require('fs').writeFile(path.join(__dirname,'config.json'), JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

}


