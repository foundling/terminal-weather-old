const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const symbols = require('./symbols');
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
        sunriseSunset: null

    };

    getLocation(results)
        .then(getWeather)
        .then(getSunriseSunset)
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

function getSunriseSunset(results) {

    const { lat, lon } = results.location;

    return new Promise((resolve, reject) => {

        const ONE_DAY_MS = 1000 * 60 * 60 * 24;
        const today = new Date();
        const yesterday = new Date(today - ONE_DAY_MS);
        const data = {
            lat,
            lng: lon,
            date: yesterday.toJSON().split('T')[0],
            formatted: 0
        };
        const qs = querystring.stringify(data);

        let body = '';
        const req = http.get({

            hostname: 'api.sunrise-sunset.org',
            path: `/json?${qs}`,
            port: 80,

        }, response => {

            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                results.sunriseSunset = JSON.parse(body);
                console.log(results.sunriseSunset);
                resolve(results);
                req.end();
            });

            response.on('error', function(data) {
                reject(data);
                req.end();
            });

        });

        req.on('socket', (socket) => {
            socket.setTimeout(config.TIMEOUT);
            socket.on('timeout', () => {
                writeToConsole('timeout :{');
                req.abort();
                req.end();
            });
        }); 

        req.on('error', (err) => {
            if (err.code === 'ECONNRESET') {
                process.exit(1);
            }
        });

    });

}



function toWeatherString(results) {

    const { sunrise, sunset } = results.sunriseSunset.results;
    const { temp, temp_min, temp_max } = results.weather.main;
    console.log(sunrise, sunset);
    const configTempToLabel = {
        imperial: 'F',
        metric: 'C',
    };

    let matchingDescriptions = Object.keys(symbols.icons).filter(key => defaultDescription.includes(key));
    let symbol = symbols.icons[ matchingDescriptions[0] ].day;

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
