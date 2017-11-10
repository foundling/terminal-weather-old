const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');
const configPath = path.join(__dirname, '../../config.json');
const config = JSON.parse(fs.readFileSync(configPath));
const weatherAPIs = require(path.join(__dirname, '../apis'));
const display = require(path.join(__dirname,'../data/display'));
const { getWeather } = weatherAPIs[config.API];
const {
    toWeatherString,
    getTempColor,
    buildDisplayFromFormatString,
    cacheWeatherData
} = require(path.join(__dirname,'formatWeather.js'));

const makeReject = (msg) => (err) => {
    console.log(msg);
    throw err;
};

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

module.exports = { main, getLocation };
