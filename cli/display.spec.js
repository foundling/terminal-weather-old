const test = require('tape');
const { setDisplay } = require('./display');


test('display mode test', function(t) {

    const config = {}; 
    t.equal(config.displayMode, undefined);

    setDisplay(config, 'text');
    t.equal(config.displayMode, 'text');

    setDisplay(config, 'icon');
    t.equal(config.displayMode, 'icon');

    t.end();

});
