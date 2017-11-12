const http = require('http');
const path = require('path');
const querystring = require('querystring');
const configPath = path.join(__dirname, '../../config.json');
const config = require(configPath);

function getWeather(results) {
    return new Promise((resolve, reject) => {

        const data = {
            units: unitToQueryParam[config.units],
            APPID: config.API_KEY
        };

        // Kelvin is the default value for openweathermap
        // so no need to pass anything for it.
        /* openWeatherMap api v2.5 doesn't follow key/value for query params if it's city */

        let targetURL = buildRequestURL({ 
            hostname,
            path,
            zip: results.location.zip,
            units: config.units,
            apiKey: config.API_KEY
        });
        let body = '';

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

module.exports = { getWeather };
