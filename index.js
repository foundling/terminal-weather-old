const path = require('path');
const configPath = path.join(__dirname,'config.json');
const args = process.argv.slice(2);
const passThroughArgs = [
    '-h',
    '--help',
    'configure',
    'list'
]; 

module.exports = function() {

    let config;

    try {

        config = require(configPath);

    } catch(err) {

        // catch any errors other than missing config file
        if (err.code !== 'MODULE_NOT_FOUND') 
            throw err;

    }

    if (config) {

        const currentTimeMS = (new Date()).getTime();
        const promptFlagThrown = (args.includes('-p') || args.includes('--prompt'));

        // cache not initialized yet or cache out of date 
        if (!config.cache || currentTimeMS - config.cache.lastCached > config.CACHE_INTERVAL_MS)
            return require('./cli')();

        // print cached string with no newline  
        if (promptFlagThrown)
            return process.stdout.write(config.cache.weather);

        // basic usage, prompt string with newline
        if (!args.length)
            return console.log(config.cache.weather);

        return require('./cli')();

    } 

    // let these commands through regardless of whether terminal-weather config is installed or not.
    else if ( passThroughArgs.some(arg => args.includes(arg)) ) 
       return require('./cli')(); 

    // request installation first.
    return console.log('No configuration file exists. Run "terminal-weather configure" to set one up.'); 

};
