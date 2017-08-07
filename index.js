const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const display = require('./display');
const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configPath = path.join(homedir,'.terminal-weather.json');
const config = require(configPath);
const writeToConsole = (s) => {
    process.stdout.write(s);
}; 

function terminalWeather() {

    const results = {
        location: null,
        weather: null,
    };

    getLocation(results)
        .then(getWeather)
        .then(toWeatherString)
        .then(cacheWeatherData)
        .then(writeToConsole)
        .catch(e => { 
            throw e; 
        });

}

function getLocation(results) {
    return new Promise((resolve, reject) => {

        let body = '';
        const req = http.get({
            hostname: 'ip-api.com',
            path: '/json',
            port: 80,
        }, response => {

            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                results.location = JSON.parse(body);
                resolve(results);
                req.end();
            });

            response.on('error', function(err) {
                reject(err);
                req.end();
            });

        });

        req.on('socket', (socket) => {
            socket.setTimeout(config.TIMEOUT);
            socket.on('timeout', () => {
                writeToConsole('timeout :{');
                req.abort();
            });
        }); 

        req.on('error', (err) => {
            if (err.code === 'ECONNRESET') {
                process.exit(1);
            }
        });

    });

}

function getWeather(results) {

    const { city, countryCode } = results.location;

    return new Promise((resolve, reject) => {

        const data = {
            city, 
            countryCode, 
            units: config.units,
            APPID: config.API_KEY
        };
        const qs = querystring.stringify(data);

        let body = '';
        const req = http.get({

            hostname: 'api.openweathermap.org',
            path: `/data/2.5/weather?q=${qs}`

        }, function responseHandler(res) {

            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                results.weather = JSON.parse(body);
                resolve(results);
                req.end();
            });

            res.on('error', function(err) {
                reject(err);
                req.end();
            });

        });

        req.on('socket', (socket) => {
            socket.setTimeout(config.TIMEOUT);
            socket.on('timeout', () => {
                writeToConsole('timeout :{');
                req.abort();
            });
        }); 

        req.on('error', (err) => {
            if (err.code === 'ECONNRESET') {
                process.exit(1);
                req.end();
            }
        });

    });

}

function toWeatherString(results) {

    const now = new Date();
    const sunset = results.weather.sys.sunset * 1000;
    const dayOrNight = now > sunset ? 'night' : 'day';
    const { temp, temp_min, temp_max } = results.weather.main;
    const descriptionKey = results.weather.weather[0].main.toLowerCase();
    const configTempToLabel = {
        imperial: 'F',
        metric: 'C',
    };

    let matchingDescriptions = Object.keys(display[config.displayType]).filter(key => descriptionKey.includes(key));
    let symbol;

    if (config.displayType === 'text') 
        symbol = display[config.displayType][ matchingDescriptions[0] ];
    else 
        symbol = display[config.displayType][ matchingDescriptions[0] ][dayOrNight];
    

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
