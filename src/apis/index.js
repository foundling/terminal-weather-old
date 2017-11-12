/*
 *
 * Future supported weather APIs should be imported from the current 
 * directory and exported here.
 *
 * Each API should export a getWeather function that returns a promise 
 * and receives an object with a location property containing city and 
 * location properties. 
 *
 */

const path = require('path');
const openWeatherMap = require(path.join(__dirname,'owm'));

module.exports = { openWeatherMap };
