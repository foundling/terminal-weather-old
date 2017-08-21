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
        const helpFlagThrown = (args.includes('-h') || args.includes('--help'));

        // cache not initialized yet or cache out of date 
        if (!config.cache || currentTimeMS - config.cache.lastCached > config.CACHE_INTERVAL_MS)
            return require('./cli')(args);

        // print cached string with no newline  
        if (promptFlagThrown)
            return process.stdout.write(config.cache.weather);

        // basic usage, prompt string with newline
        if (!args.length)
            return console.log(config.cache.weather);

        return require('./cli')(args);

    } 

    // let these commands through regardless of whether terminal-weather config is installed or not.
    if ( ['-h','--help','install','list'].some(arg => args.includes(arg)) )
       return require('./cli')(args);

    // request installation first.
    return console.log('No configuration file exists. Run "terminal-weather configure" to set one up.'); 

};
