const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const symbols = require('./symbols');

const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configPath = path.join(homedir,'.terminal-weather.json');
const config = require(configPath);
const GEOLOCATION_ENDPOINT = 'http://ip-api.com/json';
const OPENWEATHERMAP_ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather';
const writeToConsole = (s) => {
    process.stdout.write(s);
}; 

function terminalWeather() {

    getLocation()
        .then(getWeather)
        .then(weatherToString)
        .then(cacheWeatherData)
        .then(writeToConsole)
        .catch(e => { 
            throw e; 
        });

}

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

function weatherToString(weatherData) {

    return buildWeatherString(weatherData, symbols);

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

        if (data.units === 'standard')
            delete data.units; // kelvin is openweathermap's default unit, no query param needed.

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

    const configTempToLabel = {
        'imperial': 'F',
        'metric': 'C',
        'standard': 'K'
    };

    let defaultDescription = 'clear';
    
    let matchingDescriptions = Object.keys(symbols.icons).filter(key => defaultDescription.includes(key));
    let symbol = matchingDescriptions.length ? symbols.icons[ matchingDescriptions[0] ] : defaultDescription;

    return `${ parseInt(temp) }° ${configTempToLabel[config.units]} ${ symbol } `;

}

function cacheWeatherData(weatherString) {

    config.cache = {
        weather: weatherString,
        lastRequestDate: new Date().getTime()
    };

    fs.writeFile(configPath, JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

    return weatherString;

}

module.exports = exports = terminalWeather;
