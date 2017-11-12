const querystring = require('querystring');
const proto = 'http';
const hostname = 'api.openweathermap.org';
const path = '/data/2.5/weather?';
const unitToQueryParam = {
    fahrenheit: 'imperial',
    celcius: 'metric',
    kelvin: ''
};

function buildRequestURL({ zipCode, countryCode, tempUnits, apiKey }) {

    const data = { 
        APPID: apiKey, 
        zip: countryCode ? `${zipCode},${countryCode}` : zipCode,
        units: tempUnits || 'Standard'
    };
    const qs = querystring.stringify(data);

    return {
        hostname,
        path: `${proto}://${path}?${qs}`
    };

}

function handleResponsePayload() {
}


module.exports = { buildRequestURL, handleResponsePayload };
