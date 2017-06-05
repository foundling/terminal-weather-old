#!/usr/bin/env node

const path = require('path');
const symbols = require('./symbols');
const config = require('./config.json');
const WEATHER_API_KEY = config.API_KEY; 
const GEOLOCATION_ENDPOINT = 'http://ip-api.com/json';
const OPENWEATHERMAP_ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather';
const CACHE_INTERVAL = config.cacheInterval; // 10 min interval, according to openweathermap policy.

// http and querystring are used at a minimum once every 10 min
var http; 
var querystring;

// export entry point
module.exports = exports = function() {
    checkCacheAndMaybeRun(config.cache, main);
};

/*
 * Just functions after this ...
 */

function checkCacheAndMaybeRun(cache, fn) {

    let now = new Date();

    // no cache or cache out of date  
    if (!cache || (now.getTime() - cache.lastRequestDate) > CACHE_INTERVAL) {
        return fn()
    }
 
    // cache exists and is still valid
    process.stdout.write(cache.weather);

}

function main() {

    getLocation()
    .then(locationToWeather)
    .then(weatherToString)
    .then(process.stdout.write.bind(process.stdout))
    .catch(e => { throw e });

}

let locationToWeather = ({ city, countryCode }) => getWeather({ city, countryCode }); 
let weatherToString = (weatherData) => {

    const weatherString = buildWeatherString(weatherData, symbols);
    cacheWeatherData(weatherString);

    return Promise.resolve(weatherString);

};

function getLocation() {

    return new Promise((resolve, reject) => {

        let rawData = '';
        http = http || require('http');
        http.get(GEOLOCATION_ENDPOINT, response => {

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
        let qs = (querystring || require('querystring')).stringify({ 

            city, 
            countryCode, 
            units: config.units,
            APPID: WEATHER_API_KEY

        }); 

        http.get(`${ OPENWEATHERMAP_ENDPOINT }?q=${qs}`, (response) => {

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


function buildWeatherString(weatherData, symbols) {

    let { temp, temp_min, temp_max } = weatherData.main;
    //let { description } = weatherData.weather[0];
    let description = 'clouds';

    let matchingDescriptions = Object.keys(symbols.icons).filter(key => description.includes(key));
    let symbol = matchingDescriptions ? symbols.icons[ matchingDescriptions[0] ] : description;
    
    let formattedString = `${ parseInt(temp) }°F ${ symbol }. `;

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
