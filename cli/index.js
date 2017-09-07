const cli = require('neodoc');
const delayedRequire = path => (...args) => require(path).main(...args);
const installConfig = delayedRequire('./install');
const uninstall = delayedRequire('./uninstall');
const listWeatherCodes = delayedRequire('./list');
const getWeather = delayedRequire('./weather');
const updateConfig = delayedRequire('./update');
const setUnits = delayedRequire('./units');
const setDisplay = delayedRequire('./display');
const showConfig = delayedRequire('./show');
const setFormatString = delayedRequire('./format');

const spec = `
    terminal-weather

    Usage: terminal-weather
       or: terminal-weather [options] 
       or: terminal-weather configure
       or: terminal-weather show (display|config)
       or: terminal-weather uninstall

    Options:
        -h, --help      print this usage page
        -n, --no-cache  invalidate cache before printing weather string  
        -p, --prompt    print weather string with no trailing new line. Useful for embedding in your terminal prompt.
        -d,--display=DISPLAY_MODE   get or set display mode.
        -f, --format=FORMAT_STRING  get or set the format string determining the weather string output.
        -u, --units=UNIT_TYPE       get or set temp unit type.

`;

const options = {
    smartOptions: false
};

function route(parsed) {
    console.log(parsed);
};

const parsed = cli.run(spec, options);
route(parsed);
