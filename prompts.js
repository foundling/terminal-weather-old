module.exports = exports = [
    {
        text: 'Api Key: ',
        key: 'API_KEY',
        isValid: input => (input.length === 32),
        invalidMsg: 'not a valid api key'
    },
    {
        text: 'Temperature units [ (c) for Celcius, (f) for Fahrenheit, (k) for Kelvin ]: ',
        key: 'unit',
        isValid: input => ['f', 'fahrenheit', 'c', 'celcius', 'k', 'kelvin'].some(validInput => validInput.match(input.toLowerCase())),
        invalidMsg: 'not a valid temperature unit'
    }
];
