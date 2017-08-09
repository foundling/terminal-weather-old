const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configFilename = '.terminal-weather.json';
const configPath = `${homedir}/${configFilename}`;
const args = process.argv;

module.exports = function() {

    let config;
    const currentTimeMS = (new Date()).getTime();
    const promptFlagThrown = args.length > 2 && (args[2] === '--prompt' || args[2] === '-p');

    try {
        config = require(configPath);
    } catch(err) {
        if (err.code === 'MODULE_NOT_FOUND')
            require('./cli/install')(configPath);
        else
            throw err;
    }

    if (!config.cache ||
        currentTimeMS - config.cache.lastRequestDate > config.CACHE_INTERVAL_MS ) {
        require('./cli')(args);
    }
    else {
        if (promptFlagThrown) 
            process.stdout.write(config.cache.weather);
        else 
            console.log(config.cache.weather);
    }


};
