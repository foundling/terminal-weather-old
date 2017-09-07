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
const options = {
    smartOptions: false
};

function route(parsedInput, configPath) {
    console.log(parsedInput);

    if (!Object.keys(parsedInput).length)
        getWeather({ configPath });

    if (parsedInput.configure)
        installConfig({ configPath })

    if (parsedInput.show) {

        if (parsedInput.config) 
            showConfig({ configPath })

        if (parsedInput.display)
            listWeatherCodes()

    }

    if (parsedInput.uninstall)
        uninstall({ configPath });

    if (parsedInput['-p'] || parsedInput['--prompt'])
        getWeather({ configPath, outputInterface: process.sdtout });

    if (parsedInput['-f'] || parsedInput['--format']) 
        setFormatString({ configPath });

    if (parsedInput['-u'] || parsedInput['--units']) 
        setUnits({ configPath });

    if (parsedInput['-d'] || parsedInput['--display']) 
        setDisplay({ configPath });

};

function main({ args, configPath }) {
    const parsedInput = cli.run(spec, options);
    route(parsedInput, configPath);
};

module.exports = main;
