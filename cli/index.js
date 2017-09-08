const cli = require('neodoc');
const delayedRequire = path => (...args) => require(path).main(...args);
const installConfig = delayedRequire('./install');
const uninstall = delayedRequire('./uninstall');
const getWeather = delayedRequire('./weather');
const setUnits = delayedRequire('./units');
const setDisplay = delayedRequire('./display');
const setFormatString = delayedRequire('./format');
const showConfig = delayedRequire('./show');
const listWeatherCodes = delayedRequire('./list');
const spec = `

    terminal-weather

    Usage: terminal-weather
       or: terminal-weather [options] 
       or: terminal-weather configure
       or: terminal-weather show (display | config)
       or: terminal-weather uninstall

    Options:
        -h, --help      print this usage page
        -n, --no-cache  invalidate cache before printing weather string  
        -p, --prompt    print weather string with no trailing new line. Useful for embedding in your terminal prompt.
        -d, --display=DISPLAY_MODE  get or set display mode.
        -f, --format=FORMAT_STRING  get or set the format string determining the weather string output.
        -u, --units=UNIT_TYPE   get or set temp unit type.

`;
const parseOptions = { smartOptions: true };

function main() {
    const parsedInput = cli.run(spec, parseOptions);
    route(parsedInput);
};

function route(parsedInput) {

    // COMMANDS 

    if (!Object.keys(parsedInput).length)
        return getWeather().then(weatherString => process.stdout.write(weatherString + '\n'));

    if (parsedInput.configure)
        return installConfig()

    if (parsedInput.uninstall)
        return uninstall();

    if (parsedInput.show) {

        if (parsedInput.config) 
            return showConfig()

        if (parsedInput.display)
            return listWeatherCodes()

    }

    // OPTIONS

    if (parsedInput['--format'] || parsedInput['--display'] || parsedInput['--units']) {

        // update formatString in config.json
        if (parsedInput['--format']) 
            setFormatString({ formatString: parsedInput['--format'] });
        
        // update displayMode in config.json
        if (parsedInput['--display']) {
            console.log(parsedInput['--display']);
            setDisplay({ displayMode: parsedInput['--display'] });
        }

        // update unitType in config.json
        if (parsedInput['--units']) 
            setUnits({ unitType: parsedInput['--units'] });

        if (parsedInput['--no-cache'])
            return getWeather().then(weatherString => process.stdout.write(weatherString + '\n'));
    }

    // decide whether a newline should be printed 
    if (parsedInput['--prompt'])
        getWeather().then(weatherString => process.stdout.write(weatherString));
    else 
        getWeather().then(weatherString => process.stdout.write(weatherString + '\n'));

};

module.exports = main;
