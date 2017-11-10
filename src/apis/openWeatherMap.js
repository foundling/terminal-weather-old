const http = require('http');
const path = require('path');
const querystring = require('querystring');
const configPath = path.join(__dirname, '../../config.json');
const config = require(configPath);
const unitToQueryParam = {
    fahrenheit: 'imperial',
    celcius: 'metric',
    kelvin: ''
};

function getWeather(results) {

    const { city, countryCode } = results.location;

    return new Promise((resolve, reject) => {

        const data = {
            city, 
            countryCode, 
            units: unitToQueryParam[config.units],
            APPID: config.API_KEY
        };

        // Kelvin is the default value for openweathermap
        // so no need to pass anything for it.
        if (!config.units)
            delete(data.units);

        const qs = querystring.stringify(data);

        let body = '';
        let target = {
            hostname: 'api.openweathermap.org',
            path: `/data/2.5/weather?q=${qs}`
        };

        const req = http.get(target, function responseHandler(res) {

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
