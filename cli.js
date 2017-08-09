const cli = require('commander');
const installConfig = require('./cli/install');
const listWeatherCodes = require('./cli/list')
const getWeather = require('./cli/weather');
const updateConfig = require('./cli/update');
const setUnits = require('./cli/setUnits');
const setDisplay = require('./cli/setDisplay');

cli
    .option('-c,--city <city name>','get weather output for specific city.')
    .option('-n,--no-cache','Invalidate cache for terminal weather.')

cli
    .command('install').alias('i')
    .description('install (or re-install) terminal-weather configuration file to $HOME/.terminal-weather.json')
    .action(installConfig);

cli
    .command('list').alias('l')
    .description('print the weather codes for icon and text')
    .action(listWeatherCodes);

cli
    .command('display <display-type>').alias('d')
    .description('set display type to "icon" or "text"')
    .action(setDisplay);

cli
    .command('units <unit-type>').alias('u')
    .description('set unit type in your config file to (f) fahrenheit, (c) celcius or (k) kelvin')
    .action(setUnits);

module.exports = function(args) {
    cli.parse(args);
    if (args.length == 2) 
        getWeather(console.log);
};
