const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
const config = JSON.parse(fs.readFileSync(configPath));
const display = require(path.join(__dirname,'../data/display'));
const sunHasSet = (nowDT, sunsetDT) => nowDT > sunsetDT;

// rename to main, top level functionality. aka, glue
function toWeatherString(results) {

    const { 

        temp, 
        temp_min, 
        temp_max 

    } = results.weather.main;

    //const weatherDescription = results.weather.weather[0].main;

    const descriptionKey = results.weather.weather[0].main.toLowerCase();
    const matchingDescriptions = Object.keys(display[config.displayMode]).filter(key => descriptionKey.includes(key));
    const isNightTime = sunHasSet(new Date(), results.weather.sys.sunset * 1000); 
    let symbol, formatData, outputString;

    if (config.displayMode === 'text') 
        symbol = display[config.displayMode][ matchingDescriptions[0] ];
    else 
        symbol = display[config.displayMode][ matchingDescriptions[0] ][isNightTime ? 'night' : 'day'];

    formatData = {
        units: config.units,
        temp: parseInt(temp),
        symbol
    };

    results.weatherString = buildDisplayFromFormatString(config.format, formatData);
    return results;
}

function buildDisplayFromFormatString(formatString, weatherData) {

    const metricToLabel = {
        fahrenheit: 'F',
        celcius: 'C',
        kelvin: 'K'
    };

    // map symbol placeholder ('T', 'D', etc.) to output, eg. ('clear', ☀️ )
    const formatFuncs = {

        // temperature text, e.g. 43° F 
        T: function buildTempString({ temp, units }) {
            let tempColor = getTempColor(temp, units);
            return `${ tempColor }${ temp }°${ metricToLabel[ units ] }${ display.ansiColors.reset }`;
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
        },
    };
    const tokens = Object.keys(formatFuncs);
    const parseOrKeep = c => (typeof formatFuncs[c] === 'function') ? formatFuncs[c](weatherData) : c;

    return Array.prototype.map.call(formatString, parseOrKeep).join('');

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
    const { fgWhite, fgLightGray, fgBlue, fgLightBlue, fgRed, fgLightRed, reset } = display.ansiColors;

    if (temp >= reallyHot) return fgRed;
    if (temp >= hot && temp < reallyHot) return fgLightRed;
    if (temp < hot && temp >= cool) return fgLightBlue;
    if (temp < cool && temp >= cold) return fgBlue;
    if (temp < cold && temp >= freezing) return fgLightGray;
    if (temp < freezing) return fgWhite;

}

function cacheWeatherData(results) {

    config.cache = {
        collectedData: results,
        weatherString: results.weatherString,
        lastCached: new Date().getTime()
    };

    fs.writeFile(configPath, JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

    return results.weatherString;

}

module.exports = {
    toWeatherString, // rename to main
    getTempColor,
    buildDisplayFromFormatString,
    cacheWeatherData
};
