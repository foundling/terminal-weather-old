#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const querystring = require('querystring');

const symbols = require('./symbols');
const configPath = path.join(os.homedir(),'.terminal-weather.json');
const installConfig = require(path.join(__dirname, 'scripts/installConfig')); 
const GEOLOCATION_ENDPOINT = 'http://ip-api.com/json';
const OPENWEATHERMAP_ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather';

let config;

module.exports = exports = function terminalWeather() {

    if (!fs.existsSync(configPath))
        return installConfig();

    config = require(configPath);
    checkCacheAndMaybeRun(config.cache, main);

};

function checkCacheAndMaybeRun(cache, fn) {

    let now = new Date();

    if (!cache || (now.getTime() - cache.lastRequestDate) > config.cacheInterval)
        return fn();

    process.stdout.write(cache.weather);

}

function main() {

    getLocation()
        .then(locationToWeather)
        .then(weatherToString)
        .then(process.stdout.write.bind(process.stdout))
        .catch(e => { 
            throw e; 
        });

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
        let data = {
            city, 
            countryCode, 
            units: config.units,
            APPID: config.API_KEY
        }; 
        let qs = querystring.stringify(data); 

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

    let { 

        temp, 
        temp_min, 
        temp_max 

    } = weatherData.main;

    let description = 'clouds';
    let matchingDescriptions = Object.keys(symbols.icons).filter(key => description.includes(key));
    let symbol = matchingDescriptions ? symbols.icons[ matchingDescriptions[0] ] : description;
    let formattedString = `${ parseInt(temp) }°${config.units} ${ symbol }. `;

    return formattedString;
}

function cacheWeatherData(weather) {

    let lastRequestDate = new Date().getTime();

    config.cache = {
        weather,
        lastRequestDate
    };

    fs.writeFile(configPath, JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

}
