const path = require('path');
const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configPath = path.join(homedir,'.terminal-weather.json');

try {

    /* Handle writing out cached data. Usual case. */
    let config = require(configPath);
    let currentTime = (new Date()).getTime();

    if (!config.cache || currentTime - config.cache.lastRequestDate > config.cacheInterval)
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
