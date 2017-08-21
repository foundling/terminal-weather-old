const test = require('tape');
const { setDisplay } = require('./display');

const config = {
    displayMode: 'text'
} 

test('display mode test', function(t) {
    t.equal(config.displayMode, 'text');
    setDisplay(config, 'icon');
    t.equal(config.displayMode, 'icon');
    t.end();
});
