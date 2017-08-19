const display = require('../data/display');
const fs = require('fs');
const http = require('http');
const path = require('path');
const config = require(global.configPath);
const querystring = require('querystring');
const readline = require('readline');
const makePrinter = (printer) => (s) => {
    printer(s);
}; 

function terminalWeather({outputInterface}) {

    const results = {
        location: null,
        weather: null,
    };

    getLocation(results)
        .then(getWeather)
        .then(toWeatherString)
        .then(cacheWeatherData)
        .then(makePrinter(outputInterface))
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
            socket.setTimeout(config.TIMEOUT_MS);
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

    const toAPIUnits = {
        fahrenheit: 'imperial',
        celcius: 'metric',
        kelvin: ''
    };

    return new Promise((resolve, reject) => {

        const data = {
            city, 
            countryCode, 
            units: toAPIUnits[config.units],
            APPID: config.API_KEY
        };

        if (!config.units)
            delete(data.units);

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
            socket.setTimeout(config.TIMEOUT_MS);
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
    const tempInt = parseInt(temp); 
    const descriptionKey = results.weather.weather[0].main.toLowerCase();
    const configTempToLabel = {
        fahrenheit: 'F',
        celcius: 'C',
        kelvin: 'K'
    };

    let matchingDescriptions = Object.keys(display[config.displayMode]).filter(key => descriptionKey.includes(key));
    let symbol;

    if (config.displayMode === 'text') 
        symbol = display[config.displayMode][ matchingDescriptions[0] ];
    else 
        symbol = display[config.displayMode][ matchingDescriptions[0] ][dayOrNight];

    let tempColor = getTempColor(tempInt, config.units); 
    return `${ tempColor } ${ tempInt }° ${configTempToLabel[config.units]} ${ display.ansiColors.reset } ${ symbol } `;

}

function getTempColor(temp, units) {

    let ranges = {
        fahrenheit: {
            freezing: 32,
            cold: 45,
            cool: 60,
            hot: 80,
            reallyHot: 95 
        },
        celcius: {
            freezing: 0,
            cold: 7,
            cool: 15,
            hot: 27,
            reallyHot: 35 
        },
        kelvin: {
            freezing: 273,
            cold: 280,
            cool: 288,
            hot: 294,
            reallyHot: 308
        }
    };

    const { freezing, cold, cool, hot, reallyHot } = ranges[units];
    const { fgWhite, fgLightGray, fgBlue, fgLightBlue, fgRed, fgLightRed, reset } = display.ansiColors;

    if (temp >= reallyHot) return fgRed;
    if (temp >= hot && temp < reallyHot) return fgLightRed;
    if (temp < hot && temp >= cool) return fgLightBlue;
    if (temp < cool && temp >= cold) return fgBlue;
    if (temp < cold && temp >= freezing) return fgLightGray;
    if (temp < freezing) return fgWhite;

}

function cacheWeatherData(weatherString) {

    config.cache = {
        weather: weatherString,
        lastCached: new Date().getTime()
    };

    fs.writeFile(configPath, JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

    return weatherString;

}

module.exports = exports = terminalWeather;
