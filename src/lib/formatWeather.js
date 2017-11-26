const fs = require('fs');
const path = require('path');
const homedir = require('homedir')();
const configPath = path.join(homedir, '.terminal-weather.json');
const display = require(path.join(__dirname,'display'));
const { normalize } = require(path.join(__dirname,'utils'));
const colors = require(path.join(__dirname,'colors'));
const weatherAPIs = require(path.join(__dirname, 'api'));
const metricToLabel = {
    fahrenheit: 'F',
    celcius: 'C',
    kelvin: 'K'
};

function toWeatherString(results) {

    const config = JSON.parse(fs.readFileSync(configPath));
    const weatherAPI = weatherAPIs[config.API];
    const { temp, description, sunHasSet } = weatherAPI.handleWeatherPayload(results.weather);
    const symbol = findSymbol(description, config.displayMode, display[config.displayMode], sunHasSet); 

    const formatData = {
        units: normalize.toConfig[config.units],
        temp: parseInt(temp),
        symbol: symbol
    };

    results.weatherString = computeDisplay(config.format, formatData);
    results.symbol = symbol;
    results.temp = parseInt(temp);
    return results;

}

function findSymbol(description, mode, options, sunHasSet) {

    const descriptions = Object.keys(options);
    const matches = descriptions.filter(key => description.includes(key));
    const match = matches[0];

    if (!match)
        throw new Error(`Formatting Error: No matching description for display mode '${mode}', description: '${description}'.`); 

    return (mode === 'text') ? options[match] : options[match][sunHasSet ? 'night' : 'day'];

}

function computeDisplay(format, data) {

    // map display token to display data.
    // e.g. 'T D' -> '75° ☀️ ' 
    const formatFuncs = {

        // temperature text, e.g. 43° F 
        T: function buildTempString({ temp, units }) {
            let tempColor = getTempColor(temp, units);
            return `${ tempColor }${ parseInt(temp) }°${ metricToLabel[ units ] }${ colors.reset }`;
        },
  
        // display text/icon, e.g.  'clear' or ☀️  
        D: function buildDisplayString({ symbol }) {
            return `${ symbol } `;
        }, 

        // range, eg, hi: 76, lo: 72
        R: function buildRangeString() {
            return '';
        }, 

        // humidity, e.g 89%
        H: function buildHumidityString() {
            return '';
        }, 

        // atmopsheric presure, e.g. 1020 hPa
        P: function buildPressureString() {
            return '';
        }

    };

    function transform(char) {
        return typeof formatFuncs[char] === 'function' ? formatFuncs[char](data) : char;
    }

    return Array.prototype.map.call(format, transform).join('');

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
    const { fgWhite, fgLightGray, fgBlue, fgLightBlue, fgRed, fgLightRed, reset } = colors;

    if (temp >= reallyHot) return fgRed;
    if (temp >= hot && temp < reallyHot) return fgLightRed;
    if (temp < hot && temp >= cool) return fgLightBlue;
    if (temp < cool && temp >= cold) return fgBlue;
    if (temp < cold && temp >= freezing) return fgLightGray;
    if (temp < freezing) return fgWhite;

}

function cacheWeatherData(results) {

    const config = JSON.parse(fs.readFileSync(configPath));
    config.cache = {
        symbol: results.symbol,
        temp: results.temp,
        weatherString: results.weatherString,
        lastCached: new Date().getTime()
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    return results.weatherString;

}

module.exports = {
    toWeatherString,
    getTempColor,
    computeDisplay,
    cacheWeatherData
};
