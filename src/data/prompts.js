const path = require('path');
const { ansiColors } = require(path.join(__dirname, 'display'));
const unitMap = {
    c: 'celcius',
    f: 'fahrenheit',
    k: 'kelvin',
    fahrenheit: 'fahrenheit',
    celcius: 'celcius',
    kelvin: 'kelvin'
};

module.exports = exports = [
    {
        text: `${ansiColors.bgBlue}Api Key:${ansiColors.reset} `,
        configKey: 'API_KEY',
        isValid: input => (input.length === 32),
        process: (input) => input,
        invalidMsg: 'not a valid api key'
    },
    {
        text: `${ansiColors.bgBlue}Temperature units${ansiColors.reset} [ (c) for Celcius, (f) for Fahrenheit, (k) for Kelvin ]:`,
        configKey: 'units',
        isValid: input => Object.keys(unitMap).includes(input.toLowerCase().trim()),
        process: (input) => unitMap[input.trim().toLowerCase()],
        invalidMsg: 'not a valid temperature unit'
    }
];
