#!/usr/bin/env node

const http = require('http');
const querystring = require('querystring');
const config = require('./config.json');
const WEATHER_API_KEY = require('./config').API_KEY; 
const CACHE_INTERVAL = 1000 * 60;

const weatherToColorMap = {

    'clear sky': 'yellow',
    'few clouds': 'yellow',
    'scattered clouds': 'gray',
    'broken clouds': 'gray',
    'shower rain': 'gray',
    'rain': 'blue',
    'thunderstorm': 'gray',
    'snow': 'white',
    'default': 'green',

};

//checkCacheAndMaybeRun(config.cache, main);
function KToF(K) {
    return parseInt( ((parseFloat(K)*9)/5) - 459.67);
};

function checkCacheAndMaybeRun(cache,cb) {

    // no cache or cache out of date  
    if (!cache || cache && new Date().getTime() - cache.lastRequestDate > CACHE_INTERVAL) {
        return cb()
    }

    // cache still valid
    let currentTime = new Date();
    let weatherColor = weatherToColorMap[ config.cache.weatherColor ];
    process.stdout.write(

        `${ currentTime.getHours() }:${ currentTime.getMinutes() }:${ currentTime.getSeconds() } | ${ require('chalk')[ weatherColor ](config.cache.weather) }`

    );

}

function colorize(lib, s, dict) {
    return lib[ dict[s] ] ? lib[ dict[s] ](s) : lib[ dict[ s ]['default'];
}

function cacheWeatherData(weather, color) {

    config.cache = {
        lastRequestDate: new Date().getTime(),
        weather: weather,
        weatherColor: color
    };

    require('fs').writeFile('./config.json', JSON.stringify(config, null, 4), function(err) {
        if (err) throw err; 
    });

}

function main() {

    getLocation().then(locationData => {

        const { city, countryCode } = locationData;

        return getWeather({

            city,
            countryCode

        });


    })
    .then(weatherData => {

        const { 

            temp, 
            temp_min,
            temp_max

        } = weatherData.main;

        const description = weatherData.weather[0].description;
        const fontColor = weatherToColorMap[description];

        cachedWeather = `${ colorize(description) } | min: ${ KToF( temp_min ) }  max: ${ KToF( temp_max ) }`;
        cacheWeatherData(cachedWeather, fontColor);
        process.stdout.write(cachedWeather);

    })
    .catch(e => {
        throw e;
    });
}

function getLocation() {

    return new Promise((resolve, reject) => {

        let rawData = '';
        http.get('http://ip-api.com/json', (response) => {

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

function getWeather({ city, countryCode }) {

    return new Promise((resolve, reject) => {

        let rawData = '';

        let qs = querystring.stringify({ 

            city, 
            countryCode, 
            APPID: WEATHER_API_KEY

        }); 

        http.get(`http://api.openweathermap.org/data/2.5/weather?q=${qs}`, (response) => {

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

