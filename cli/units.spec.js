const test = require('tape');
const { setUnits } = require('./units');

test('updating units in config', (t) => {

    const config = {};

    config.units = 'fahrenheit';
    t.equal(config.units, 'fahrenheit');
    setUnits(config, 'kelvin');
    t.equal(config.units, 'kelvin');

    t.end();
});



