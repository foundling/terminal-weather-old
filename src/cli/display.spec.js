const test = require('tape');
const { setDisplay } = require('./display');
const config = require('../data/config');

test('display mode test', function(t) {

    t.plan(3);

    t.equal(config.displayMode, 'text');

    setDisplay(config, 'text');
    t.equal(config.displayMode, 'text');

    setDisplay(config, 'icon');
    t.equal(config.displayMode, 'icon');

    t.end();

});
