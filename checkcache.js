const args = process.argv.slice(2);
const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configFilename = '.terminal-weather.json';
const configPath = `${homedir}/${configFilename}`;

/* if there are options, pass them to main file that uses commander */
if (process.argv.length > 2)
    return require('./index')(process.argv);

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
