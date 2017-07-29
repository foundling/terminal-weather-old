const path = require('path');
const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOMEDIR;

/* Handle only writing out cached data. Usual case. */

try {

    let config = require(path.join(homedir,'.terminal-weather.json'));

    if (!config.cache || (new Date()).getTime() - cache.lastRequestDate > config.cacheInterval)
        return require('./index')();
    process.stdout.write(config.cache.weather);

} catch(err) {

    if (err.code === 'MODULE_NOT_FOUND')
        require('./index')();
    else
        throw err;

}
