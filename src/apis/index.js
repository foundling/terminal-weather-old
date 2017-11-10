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
const configPath = path.join(__dirname, 'openWeatherMap');
const openWeatherMap = require(configPath);

module.exports = { openWeatherMap };
