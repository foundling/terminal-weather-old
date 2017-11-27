const cli = require('neodoc');
const path = require('path');
const { delayedRequire, logToConsole } = require(path.join(__dirname, '..','lib','utils'));
const installConfig = delayedRequire(path.join(__dirname,'install'));
const uninstallTW = delayedRequire(path.join(__dirname,'uninstall'));
const getWeather = delayedRequire(path.join(__dirname,'weather'));
const updateConfig = delayedRequire(path.join(__dirname,'update'));
const showConfig = delayedRequire(path.join(__dirname,'show'));
const listWeatherCodes = delayedRequire(path.join(__dirname,'list'));
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

    // MUTUALLY EXCLUSIVE COMMANDS, THEY RETURN 

    const {

        configure,
        uninstall,
        show,
        config,
        display

    } = parsedInput;

    const noSubCmds = Object.keys(parsedInput).length === 0; 
    const updateFormat = parsedInput['--format'];
    const updateDisplay = parsedInput['--display'];
    const updateUnits = parsedInput['--units']; 
    const invalidateCache = parsedInput['--no-cache'];
    const skipNewline = parsedInput['--prompt'];


    if (noSubCmds)
        return getWeather().then(weatherString => console.log(weatherString));

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
    if (updateFormat || updateDisplay || updateUnits) {
        updateConfig({ 
            format: updateFormat, 
            units: updateUnits, 
            display: updateDisplay 
        });
    }
    
    // handle -np, -n and -p options
    if (invalidateCache && skipNewline)
        getWeather().then(weatherString => logToConsole(weatherString));

    else if (invalidateCache)
        getWeather().then(weatherString => logToConsole(weatherString  + '\n'));

    else if (skipNewline)
        getWeather().then(weatherString => logToConsole(weatherString));
}

module.exports = main;
