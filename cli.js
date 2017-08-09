const cli = require('commander');
const installConfig = require('./cli/install');
const listWeatherCodes = require('./cli/list')
const getWeather = require('./cli/weather');
const updateConfig = require('./cli/update');
const setUnits = require('./cli/setUnits');
const setDisplay = require('./cli/setDisplay');

cli
    .option('-n, --nocache','Invalidate cached weather string, make a new request for the weather.');

cli
    .command('install').alias('i')
    .description(`Install (or re-install) terminal-weather configuration file to ${global.configPath}.`)
    .action(installConfig);

cli
    .command('list').alias('l')
    .description('Print the weather codes for icon and text.')
    .action(listWeatherCodes);

cli
    .command('display <display-type>').alias('d')
    .description('Set display type to "icon" or "text".')
    .action(setDisplay);

cli
    .command('units <unit-type>').alias('u')
    .description('Set unit type in config to <fahrenheit | celcius | kelvin>. Shorthand is supported, e.g. "f" for fahrenheit.')
    .action(setUnits);

module.exports = function(args) {
    cli.parse(args);
    if (args.length === 2 || cli.nocache ) getWeather({ outputInterface: console.log, city: cli.city }); 
};
