const querystring = require('querystring');
const proto = 'http';
const hostname = 'api.openweathermap.org';
const path = '/data/2.5/weather';
const unitToQueryParam = {
    fahrenheit: 'imperial',
    celcius: 'metric',
    kelvin: 'Standard'
};

function buildRequestURL({ zip='', countryCode='', tempUnits='', apiKey='' }) {

    // you can use autoip, too
    const data = { 
        zip: countryCode ? `${zip},${countryCode}` : zip,
        units: unitToQueryParam[tempUnits],
        APPID: apiKey, 
    };

    const qs = querystring.stringify(data);

    return `${proto}://${hostname}${path}?${qs}`;

}

function handleWeatherPayload(weather) {
    return {
        tempo: weather.main.temp,
        description: weather.weather[0].main.toLowerCase(),
        sunHasSet: new Date() > weather.sys.sunset * 1000 
    };
}

module.exports = { buildRequestURL, handleWeatherPayload };
