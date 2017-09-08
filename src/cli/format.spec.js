const test = require('tape');
const { setFormatString } = require('./format');
const config = require('../data/defaultConfig');

test('changing format string', (t) => {

    t.plan(2);

    t.equal(config.format, 'T D ');

    setFormatString(config, 'D T ');
    t.equal(config.format, 'D T ');

    t.end();
});
