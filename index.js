const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const symbols = require('./symbols');

const GEOLOCATION_ENDPOINT = 'http://ip-api.com/json';
const OPENWEATHERMAP_ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather';
const configPath = path.join(os.homedir(),'.terminal-weather.json');

let config;

function terminalWeather(conf) {
    config = conf;

    getLocation()
        .then(getWeather, makeReject('getWeather'))
        .then(weatherToString, makeReject('weatherToString'))
        .then(process.stdout.write.bind(process.stdout), makeReject('process.stdout.write'))
        .catch(e => { 
            throw e; 
        });

}

function makeReject(fnName) {
    return function(e) {
        console.log(`error in function ${fnName}!`);
        throw e;
    };
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

    const weatherString = buildWeatherString(weatherData, symbols);
    cacheWeatherData(weatherString);
    return Promise.resolve(weatherString);

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

    let defaultDescription = 'clouds';
    let matchingDescriptions = Object.keys(symbols.icons).filter(key => defaultDescription.includes(key));
    let symbol = matchingDescriptions ? symbols.icons[ matchingDescriptions[0] ] : defaultDescription;
    let formattedString = `${ parseInt(temp) }° ${configTempToLabel[config.units]} ${ symbol }. `;

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

module.exports = exports = terminalWeather;
