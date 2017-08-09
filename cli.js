const cli = require('commander');
const installConfig = require('./cli/install');
const listWeatherCodes = require('./cli/list')
const getWeather = require('./cli/weather');
const updateConfig = require('./cli/update');

cli
    .option('-c,--city <city name>','get weather output for specific city.')
    .option('-d,--display-type <display type>','set display type to "icon" or "text"')
    .option('-n,--no-cache','Invalidate cache for terminal weather.')
    .option('-u,--units <units>','set unit type to (f) fahrenheit, (c) celcius or (k) kelvin')

cli
    .command('init').alias('i')
    .description('initialize terminal-weather config file')
    .action(installConfig);

cli
    .command('list').alias('l')
    .description('print the weather codes for icon and text')
    .action(listWeatherCodes);

module.exports = function(args) {
    cli.parse(args);
    if (args.length == 2) 
        getWeather(console.log);
};
