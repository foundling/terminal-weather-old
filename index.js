const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configFilename = '.terminal-weather.json';
const configPath = `${homedir}/${configFilename}`;
const args = process.argv;

global.configPath = configPath;

module.exports = function() {

    let config;
    try {
        config = require(configPath);
    } catch(err) {
        if (err.code === 'MODULE_NOT_FOUND')
            return require('./cli/install')(configPath);
        else
            throw err;
    }

    const argsPassed = args.length > 2;
    const promptFlagThrown = (args[2] === '-p' || args[2] === '--prompt');
    const updateCache = (args[2] === '-n' || args[2] === '--nocache');
    const cacheExists = Boolean(config && config.cache);
    const currentTimeMS = (new Date()).getTime();

    if (cacheExists && promptFlagThrown) 
        process.stdout.write(config.cache.weather);
    else if (cacheExists && !argsPassed) 
        console.log(config.cache.weather);
    else
        require('./cli')(args);

};
