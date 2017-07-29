const path = require('path');
const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;

try {

    /* Handle writing out cached data. Usual case. */
    let config = require(path.join(homedir,'.terminal-weather.json'));
    if (!config.cache || (new Date()).getTime() - config.cache.lastRequestDate > config.cacheInterval)
       return require('./index')(config);

    process.stdout.write(config.cache.weather);

} catch(err) {

    let configPath;
    /* Handle config install. */
    if (err.code === 'MODULE_NOT_FOUND') {
        configPath = `${homedir}/.terminal-weather.json`;
        require('./install')(configPath);
    }
    else
        throw err;

}
