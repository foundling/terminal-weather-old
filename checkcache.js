const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configPath = `${homedir}/.terminal-weather.json`;

try {

    /* Handle writing out cached data. Usual case. */
    let config = require(configPath);
    let currentTimeMS = (new Date()).getTime();

    if (!config.cache || currentTimeMS - config.cache.lastRequestDate > config.CACHE_INTERVAL_MS)
       require('./index')();
    else 
        process.stdout.write(config.cache.weather);

} catch(err) {

    /* Handle config install. */
    if (err.code === 'MODULE_NOT_FOUND')
        require('./install')(configPath);
    else
        throw err;

}
