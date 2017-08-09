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
        text: 'Api Key: ',
        configKey: 'API_KEY',
        isValid: input => (input.length === 32),
        process: (input) => input,
        invalidMsg: 'not a valid api key'
    },
    {
        text: 'Temperature units [ (c) for Celcius, (f) for Fahrenheit, (k) for Kelvin ]: ',
        configKey: 'units',
        isValid: input => Object.keys(unitMap).includes(input.toLowerCase().trim()),
        process: (input) => unitMap[input],
        invalidMsg: 'not a valid temperature unit'
    }
];
