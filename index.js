const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const querystring = require('querystring');
const readline = require('readline');

const symbols = require('./symbols');
const prompts = require('./prompts');
const configPath = path.join(os.homedir(),'.terminal-weather.json');
const GEOLOCATION_ENDPOINT = 'http://ip-api.com/json';
const OPENWEATHERMAP_ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather';
const defaultConfig = {
    API_KEY: '',
    units: 'imperial',
    cacheInterval: 600000, 
    cache: null
};

let config;

function terminalWeather() {

    config = checkConfigAndMaybeRun(configPath, install);
    if (!config) 
        return;

    checkCacheAndMaybeRun(config.cache, main);

};

function checkConfigAndMaybeRun(path, cb) {

    try {

        return require(path)

    } catch(err) {

        if (err.code === 'MODULE_NOT_FOUND')
            return cb();

    }

};

function install() {
    takeUserConfigData(writeConfig);
}

function takeUserConfigData(cb) { 

    function* makePrompt(prompts) {
        while (prompts.length)
            yield prompts.shift();
    }

    function repeat(prompt) {
        process.stdout.write(`invalid: ${prompt.invalidMsg}\n${prompt.text}`);
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompter = makePrompt(prompts); 

    let answers = [];
    let userConfigData = {};
    let currentPrompt = prompter.next().value;

    process.stdout.write(currentPrompt.text);

    rl.on('line', function(response) {

        const answer = response.trim() || ' ';

        // check response validity and store value if valid, or repeat question until valid
        if (currentPrompt.isValid(answer)) {
            userConfigData[currentPrompt.key] = answer;
            currentPrompt = prompter.next().value; 
        } else{
            return repeat(currentPrompt);
        }

        // check for end of prompts  
        if (currentPrompt) {
            process.stdout.write(currentPrompt.text);
        } else {
            rl.close();
            cb(userConfigData, defaultConfig);
        }
    });
}

function writeConfig(userConfig, defaultConfig) {

    const finalConfig = Object.assign(defaultConfig, userConfig);
    fs.writeFile(configPath, JSON.stringify(finalConfig, null, 4), function(err) {
        if (err) throw err;
    }); 

}

function checkCacheAndMaybeRun(cache, fn) {

    let now = new Date();

    if (!cache || (now.getTime() - cache.lastRequestDate) > config.cacheInterval)
        return fn();

    process.stdout.write(cache.weather);

}

function main() {

    getLocation()
        .then(locationToWeather)
        .then(weatherToString)
        .then(process.stdout.write.bind(process.stdout))
        .catch(e => { 
            throw e; 
        });

}

function getLocation() {

    return new Promise((resolve, reject) => {

        let rawData = '';
        http.get(GEOLOCATION_ENDPOINT, response => {

            response.on('data', function(data) {
                rawData += data;
            });

            response.on('end', function() {
                resolve(JSON.parse(rawData));
            });

            response.on('error', function(data) {
                reject(data);
            });

        }).end();

    });

}

function locationToWeather ({ city, countryCode }) {
    return getWeather({ city, countryCode }); 
}

function weatherToString(weatherData) {

    const weatherString = buildWeatherString(weatherData, symbols);
    cacheWeatherData(weatherString);
    return Promise.resolve(weatherString);

};



function getWeather({ city, countryCode }) {

    return new Promise((resolve, reject) => {

        let rawData = '';
        let data = {
            city, 
            countryCode, 
            units: config.units,
            APPID: config.API_KEY
        }; 
        let qs = querystring.stringify(data); 

        http.get(`${ OPENWEATHERMAP_ENDPOINT }?q=${qs}`, (response) => {

            response.on('data', function(data) {
                rawData += data;
            });

            response.on('end', function() {
                resolve( JSON.parse(rawData) );
            });

            response.on('error', function(data) {
                reject(data);
            });

        }).end();

    });

}

function buildWeatherString(weatherData, symbols) {

    let { 

        temp, 
        temp_min, 
        temp_max 

    } = weatherData.main;

    let defaultDescription = 'clouds';
    let matchingDescriptions = Object.keys(symbols.icons).filter(key => defaultDescription.includes(key));
    let symbol = matchingDescriptions ? symbols.icons[ matchingDescriptions[0] ] : defaultDescription;
    let formattedString = `${ parseInt(temp) }°${config.units} ${ symbol }. `;

    return formattedString;
}

function cacheWeatherData(weather) {

    let lastRequestDate = new Date().getTime();

    config.cache = {
        weather,
        lastRequestDate
    };

    fs.writeFile(configPath, JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

}

module.exports = exports = terminalWeather;
