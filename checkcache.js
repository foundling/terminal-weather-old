const path = require('path');
const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOMEDIR;

try {

    /* Handle writing out cached data. Usual case. */
    let config = require(path.join(homedir,'.terminal-weather.json'));
    let firstRun = !config.cache;
    let cacheExpired = (new Date()).getTime() - cache.lastRequestDate > config.cacheInterval;

    if (firstRun || cacheExpired)
        return require('./index')();

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
