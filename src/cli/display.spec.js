const test = require('tape');
const path = require('path');
const { setDisplay } = require(path.join(__dirname,'./display'));
const config = require('../data/defaultConfig');

test('display mode test', function(t) {

    t.plan(3);

    t.equal(config.displayMode, 'text');

    setDisplay(config, 'text');
    t.equal(config.displayMode, 'text');

    setDisplay(config, 'icon');
    t.equal(config.displayMode, 'icon');

    t.end();

});
