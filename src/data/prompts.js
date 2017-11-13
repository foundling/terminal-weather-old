const path = require('path');
const { ansiColors } = require(path.join(__dirname, 'display'));
const { reset, fgGreen, fgBlue, fgRed, fgLightGray, bgWhite } = ansiColors;
const unitMap = {
    c: 'celcius',
    f: 'fahrenheit',
    k: 'kelvin',
    fahrenheit: 'fahrenheit',
    celcius: 'celcius',
    kelvin: 'kelvin'
};
const APIs = ['openWeatherMap','weatherUnderground'];
const keyLengths = {
    openWeatherMap: 32,
    weatherUnderground: 16
};

module.exports = exports = [
    {
        text: `${reset}${fgBlue}(1)${reset} OpenWeatherMap ${fgBlue}\n(2)${reset} Weather Underground\n${bgWhite}${fgLightGray} Choose your weather service ${reset}: ${fgGreen}`,
        configKey: 'API',
        isValid: (input, config) => Boolean(APIs[parseInt(input) - 1]),
        invalidMsg: `${fgRed}Sorry, that is not a valid API option.${reset}`, 
        process: input => APIs[parseInt(input) - 1], 
    },
    {
        text: `${reset}${bgWhite}${fgLightGray} Api Key ${reset}: ${fgGreen}`,
        configKey: 'API_KEY',
        isValid: (input, config) => input.length === keyLengths[config.API],
        invalidMsg: `${fgRed}Sorry, that is not a valid API key for this service.${reset}`,
        process: input => input
    },
    {
        text: `${reset}\n${fgBlue}'c'${reset} for Celcius\n${fgBlue}'f'${reset} for Fahrenheit\n${fgBlue}'k'${reset} for Kelvin\n${bgWhite}${fgLightGray} Temperature units [${fgBlue}f${fgLightGray}] ${reset}: ${fgGreen} `,
        configKey: 'units',
        isValid: (input, config) => Object.keys(unitMap).includes(input.toLowerCase()),
        invalidMsg: `${fgRed}Sorry, that is not a valid temperature unit. ${reset}`,
        process: input => unitMap[input.toLowerCase()]
    },
];
