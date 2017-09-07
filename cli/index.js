const cli = require('neodoc');
const delayedRequire = path => (...args) => require(path).main(...args);
const installConfig = delayedRequire('./install');
const uninstall = delayedRequire('./uninstall');
const setUnits = delayedRequire('./units');
const setDisplay = delayedRequire('./display');
const showConfig = delayedRequire('./show');
const setFormatString = delayedRequire('./format');
const listWeatherCodes = delayedRequire('./list');
const getWeather = delayedRequire('./weather');
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
const parseOptions = { smartOptions: false };

function route(parsedInput) {

    // handle commands

    if (!Object.keys(parsedInput).length)
        return getWeather().then(weatherString => process.stdout.write(weatherString + '\n'));

    if (parsedInput.configure)
        return installConfig()

    if (parsedInput.show) {

        if (parsedInput.config) 
            return showConfig()

        if (parsedInput.display)
            return listWeatherCodes()

    }

    if (parsedInput.uninstall)
        return uninstall();


    // handle options ... more complicated
   
    // update config
    if (parsedInput['-d'] || parsedInput['-f'] || parsedInput['-u']) {
        if (parsedInput['-d'])
            setDisplay({ displayMode: parsedInput['-d'] });

        if (parsedInput['-f'] || parsedInput['--format']) 
            setFormatString({ formatString: parsedInput['-f'] });

        if (parsedInput['-u'] || parsedInput['--units']) 
            setUnits({ unitType: parsedInput['-u'] });
    }


    if (parsedInput['-n'] && !parsedInput['-p'])
        getWeather().then(weatherString => process.stdout.write(weatherString + '\n'));

    if (parsedInput['-p']) 
        getWeather().then(weatherString => process.stdout.write(weatherString));


};

function main() {
    const parsedInput = cli.run(spec, parseOptions);
    route(parsedInput);
};

module.exports = main;
