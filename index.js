const homedir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const configFilename = '.terminal-weather.json';
const configPath = `${homedir}/${configFilename}`;
const args = process.argv.slice(2);

global.configPath = configPath;

module.exports = function() {

    let config;

    try {
        config = require(configPath);
    } catch(err) {
        if (err.code !== 'MODULE_NOT_FOUND') 
            throw err;
    }

    if (config) {

        const currentTimeMS = (new Date()).getTime();
        const promptFlagThrown = (args.includes('-p') || args.includes('--prompt'));
        const argsPassed = Boolean(args.length);

        // cache not initialized yet or cache out of date 
        if (!config.cache || currentTimeMS - config.cache.lastCached > config.CACHE_INTERVAL_MS)
            return require('./cli')(args);

        // print cached string with no newline  
        if (promptFlagThrown)
            return process.stdout.write(config.cache.weather);

        // basic usage, prompt string with newline
        if (!argsPassed)
            return console.log(config.cache.weather);

        require('./cli')(args);

    } else {

        // let these commands through regardless of whether terminal-weather config is installed or not.
        if (args.includes('i') || args.includes('install') || args.includes('l') || args.includes('list'))
            return require('./cli')(args);

        // request installation first.
        else 
            return console.log('No configuration file exists. Run "terminal-weather install" to set one up.'); 

    }
};
