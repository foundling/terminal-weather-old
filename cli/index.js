const cli = require('commander');
const delayedRequire = path => (...args) => require(path)(...args);

const uninstall = delayedRequire('./uninstall');
const installConfig = delayedRequire('./install');
const listWeatherCodes = delayedRequire('./list');
const getWeather = delayedRequire('./weather');
const updateConfig = delayedRequire('./update');
const setUnits = delayedRequire('./units');
const setDisplay = delayedRequire('./display');
const showConfig = delayedRequire('./show');
const setFormatString = delayedRequire('./format');
const showHelp = delayedRequire('./help');

cli
    .option('-p, --prompt','Print output without a newline.')
    .option('-n, --nocache','Invalidate cached weather string, make a new request for the weather.');

cli
    .command('configure')
    .description(`Create a configuration file at ${global.configPath}. Required to use terminal-weather.`)
    .action(installConfig);

cli
    .command('uninstall')
    .description('Uninstall terminal weather. Equivalent to "npm uninstall -g terminal-weather".')
    .action(uninstall);

cli
    .command('list')
    .description('Print the weather codes for icon and text.')
    .action(listWeatherCodes);

cli
    .command('display <display-mode>')
    .description('Set display mode to "icon" or "text".')
    .action(setDisplay);

cli
    .command('units <unit-type>')
    .description('Set unit type in config to <fahrenheit | celcius | kelvin>. Shorthand is supported, e.g. "f" for fahrenheit.')
    .action(setUnits);

cli
    .command('show')
    .description('Show your configuration file')
    .action(showConfig);

cli
    .command('format <format-string>')
    .description('Set the format string used to configure the display of the terminal-weather output.')
    .action(setFormatString);

// add extra space after help output
cli.on('--help', console.log);

module.exports = function(args) {

    cli.parse(process.argv);

    if (args.includes('-h') || args.includes('--help'))
        return cli.outputHelp(text => 'a\n' + text + '\nb');

    if (!args.length || cli.nocache ) 
        return getWeather({ outputInterface: console.log, city: cli.city }); 

};
