const test = require('tape');
const path = require('path');
const { setDisplay } = require(path.join(__dirname,'display'));
const config = require(path.join(__dirname,'../config/default');

test('display mode test', function(t) {

    t.plan(3);

    t.equal(config.display, 'text');

    setDisplay(config, 'text');
    t.equal(config.display, 'text');

    setDisplay(config, 'icon');
    t.equal(config.display, 'icon');

    t.end();

});
