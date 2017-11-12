const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const configPath = path.join(__dirname, '../../config.json');
const config = JSON.parse(fs.readFileSync(configPath));
const weatherAPIs = require(path.join(__dirname, '../apis'));
const display = require(path.join(__dirname,'../data/display'));
const weatherAPI = weatherAPIs[config.API];
const { makeReject } = require(path.join(__dirname, 'utils')); 
const {
    toWeatherString,
    getTempColor,
    buildDisplayFromFormatString,
    cacheWeatherData
} = require(path.join(__dirname,'formatWeather.js'));

function main() {

    const results = {
        location: null,
        weather: null,
    };

    return getLocation(results)
        .then(getWeather, makeReject('getLocation failed.'))
        .then(toWeatherString, makeReject('getWeather failed.'))
        .then(cacheWeatherData, makeReject('toWeatherString failed.'))
        .catch(e => { throw e; });

}

function getLocation(results) {

    return new Promise((resolve, reject) => {

        let body = ''; 
        let target = {
            hostname: 'ip-api.com',
            path: '/json',
            port: 80
        };

        const req = http.get(target, response => {

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

        req.on('socket', socket => {
            socket.setTimeout(config.NETWORK_TIMEOUT_MS);
            socket.on('timeout', () => {
                console.log('timeout :{');
                req.abort();
            });
        }); 

        req.on('error', err => {
            if (err.code === 'ECONNRESET') {
                process.exit(1);
                req.end();
            }
        });

    });

}


function getWeather(results) {

    return new Promise((resolve, reject) => {

        const targetURL = weatherApi.buildRequestURL({ 
            hostname,
            path,
            zip: results.location.zip,
            countryCode: results.location.countryCode,
            units: config.units,
            apiKey: config.API_KEY
        });

        const req = http.get(targetURL, function responseHandler(res) {
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
            socket.setTimeout(config.NETWORK_TIMEOUT_MS);
            socket.on('timeout', () => {
                console.log('timeout :{');
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

};

module.exports = { main, getLocation, getWeather };
