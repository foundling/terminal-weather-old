const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configFilename = '.terminal-weather.json';
const configPath = `${homedir}/${configFilename}`;
const args = process.argv.slice();

global.configPath = configPath;

module.exports = function() {

    let config;

    try {
        config = require(configPath);
    } catch(err) {
        if (err.code === 'MODULE_NOT_FOUND')
            return require('./cli/install')(configPath);
        throw err;
    }

    const argsPassed = args.length > 2;
    const promptFlagThrown = (args.includes('-p') || args.includes('--prompt'));
    const cacheExists = Boolean(config && config.cache);
    const currentTimeMS = (new Date()).getTime();

    // if there is no cache, run app and process args
    if (!cacheExists) 
        return require('./cli')(args);

    // if cache is out of date, run app and respect args
    if (currentTimeMS - config.cache.lastCached > config.CACHE_INTERVAL_MS)
        return require('./cli')(args);

    // if cache is current and a prompt flag is thrown, use stdout to write weather string 
    if (promptFlagThrown)
        return process.stdout.write(config.cache.weather);

    // default invocation just prints weather using console.log on a newline 
    if (!argsPassed) 
        return console.log(config.cache.weather);

    require('./cli')(args);

};
