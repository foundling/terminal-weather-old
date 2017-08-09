const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configFilename = '.terminal-weather.json';
const configPath = `${homedir}/${configFilename}`;
global.configPath = configPath;
const args = process.argv;

module.exports = function() {

    let config;
    const argsPassed = args.length > 2;
    const promptFlagThrown = (args[2] === '--prompt' || args[2] === '-p');
    const currentTimeMS = (new Date()).getTime();

    try {
        config = require(configPath);
    } catch(err) {
        if (err.code === 'MODULE_NOT_FOUND')
            require('./cli/install')(configPath);
        else
            throw err;
    }

    /* cache needs to be populated */
    if (!config.cache || (currentTimeMS - config.cache.lastRequestDate) > config.CACHE_INTERVAL_MS)
        require('./cli')(args);
    else if (promptFlagThrown) 
        process.stdout.write(config.cache.weather);
    else if (!argsPassed && config.cache)
        console.log(config.cache.weather);
    else 
        require('./cli')(args);

};
