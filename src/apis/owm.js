const querystring = require('querystring');
const proto = 'http';
const hostname = 'api.openweathermap.org';
const path = '/data/2.5/weather?';
const unitToQueryParam = {
    fahrenheit: 'imperial',
    celcius: 'metric',
    kelvin: 'Standard'
};

function buildRequestURL({ zip, countryCode, tempUnits, apiKey }) {

    const data = { 
        zip: countryCode ? `${zip},${countryCode}` : zip,
        units: unitToQueryParam[tempUnits],
        APPID: apiKey, 
    };

    const qs = querystring.stringify(data);

    return {
        hostname,
        path: `${proto}://${hostname}${path}${qs}`
    };

}

function handleResponsePayload() {
}

module.exports = { buildRequestURL, handleResponsePayload };
