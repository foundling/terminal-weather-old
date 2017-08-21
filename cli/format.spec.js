const test = require('tape');
const { setFormatString } = require('./format');

test('changing format string', (t) => {

    let formatStringA = 'T D ';
    let formatStringB = 'D T ';

    const config = {};
    setFormatString(config, formatStringA);
    t.equal(config.format, formatStringA);
    setFormatString(config, formatStringB);
    t.equal(config.format, formatStringB);

    t.end();
});
