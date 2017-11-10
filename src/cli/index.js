const cli = require('neodoc');
const delayedRequire = path => (...args) => require(path).main(...args);
const logToConsole = process.stdout.write.bind(process.stdout);
const installConfig = delayedRequire('./install');
const uninstallTW = delayedRequire('./uninstall');
const getWeather = delayedRequire('./weather');
const setUnitType = delayedRequire('./units');
const setDisplayMode = delayedRequire('./display');
const setFormatString = delayedRequire('./format');
const showConfig = delayedRequire('./show');
const listWeatherCodes = delayedRequire('./list');
const parseOptions = { smartOptions: true };
const spec = `

    terminal-weather

    Usage: terminal-weather
       or: terminal-weather         [options] 
       or: terminal-weather         configure 
       or: terminal-weather         show (display | config) 
       or: terminal-weather         uninstall

    Options:
        -h, --help                  print this usage page
        -n, --no-cache invalidate   cache before printing weather string  
        -p, --prompt  print weather string with no trailing new line. Useful for embedding in your terminal prompt.
        -d, --display=DISPLAY_MODE  get or set display mode.
        -f, --format=FORMAT_STRING  get or set the format string determining the weather string output.
        -u, --units=UNIT_TYPE       get or set temp unit type.

`;

function main() {
    const parsedInput = cli.run(spec, parseOptions);
    route(parsedInput);
};

function route(parsedInput) {

    // MUTUALLY EXCLUSIVE COMMANDS 

    const {

        configure,
        uninstall,
        show,
        config,
        display

    } = parsedInput;

    if (!Object.keys(parsedInput).length)
        return getWeather().then(weatherString => logToConsole(weatherString + '\n'));

    if (configure)
        return installConfig()

    if (uninstall)
        return uninstallTW();

    if (show) {

        if (config) 
            return showConfig()

        if (display)
            return listWeatherCodes()

    }

    // THESE ARE OPTIONS, AND ARE NOT MUTUALLY EXCLUSIVE

    // update formatString in config.json
    if (parsedInput['--format'])
        setFormatString(parsedInput['--format']);
    
    // update displayMode in config.json
    if (parsedInput['--display'])
        setDisplayMode(parsedInput['--display']);

    // update unitType in config.json
    if (parsedInput['--units'])
        setUnitType(parsedInput['--units']);

    // handle -np, -n and -p options
    if (parsedInput['--no-cache'] && parsedInput['--prompt'])
        getWeather().then(weatherString => logToConsole(weatherString));

    else if (parsedInput['--no-cache'])
        getWeather().then(weatherString => logToConsole(weatherString  + '\n'));

    else if (parsedInput['--prompt'])
        getWeather().then(weatherString => logToConsole(weatherString));
}

module.exports = main;
