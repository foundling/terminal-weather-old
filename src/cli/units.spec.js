const test = require('tape');
const { setUnits } = require('./units');
const config = require('../data/config');

test('updating units in config', (t) => {

    t.plan(3);

    t.equal(config.units, null);

    config.units = 'fahrenheit';
    t.equal(config.units, 'fahrenheit');

    setUnits(config, 'kelvin');
    t.equal(config.units, 'kelvin');

    t.end();

});



