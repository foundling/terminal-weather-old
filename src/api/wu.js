const path = require('path');
const querystring = require('querystring');
const fs = require('fs');
const homedir = require('homedir')();
const configPath = path.join(homedir, '.terminal-weather.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const proto = 'http';
const hostname = 'api.wunderground.com';
const unitToQueryParam = {
    fahrenheit: 'imperial',
    celcius: 'metric',
    kelvin: 'Standard'
};
const { ftok, ctok } = require(path.join(__dirname,'..','cli','utils'));

function buildRequestURL({ zip='', city='', region='', countryCode='', tempUnits='', apiKey='' }) {

    const data = { 
        zip: countryCode ? `${zip},${countryCode}` : zip,
        units: unitToQueryParam[tempUnits],
    };

    const qs = querystring.stringify(data);
    return `${proto}://${hostname}/api/${apiKey}/conditions/astronomy/q/${region}/${city.replace(' ','_')}.json`;

}

function handleWeatherPayload(weather) {

    // sunHasSet is not implemented
    const now = new Date();
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();

    const fahrenheit = weather.current_observation.temp_f;
    const temp = config.units === 'kelvin' ? utils.ftok(fahrenheit) : weather.current_observation[ `temp_${config.units[0].toLowerCase()}` ];


    return {
        temp: temp, 
        description: weather.current_observation.weather.toLowerCase(),
        sunHasSet: true   
    };
}

module.exports = { buildRequestURL, handleWeatherPayload };
