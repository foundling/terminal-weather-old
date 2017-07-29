const unitMap = {
    f: 'fahrenheit',
    c: 'celcius',
    k: 'kelvin'
};

module.exports = exports = [
    {
        text: 'Api Key: ',
        configKey: 'API_KEY',
        isValid: input => (input.length === 32),
        process: (input) => input,
        invalidMsg: 'not a valid api key'
    },
    {
        text: 'Temperature units [ (c) for Celcius, (f) for Fahrenheit, (k) for Kelvin ]: ',
        configKey: 'units',
        isValid: input => ['f', 'c', 'k'].includes((input.toLowerCase())),
        process: (input) => unitMap[input],
        invalidMsg: 'not a valid temperature unit'
    }
];
