const path = require('path');
const { ansiColors } = require(path.join(__dirname,'src','data','display'));
const configPath = path.join(__dirname,'config.json');
const args = process.argv.slice(2);
const passThroughArgs = [
    '-h',
    '--help',
    'configure',
    'uninstall'
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
        const invalidateCache = (args.includes('-n') || args.includes('--no-cache'));
 
        // if cache needs to be populated, call cli 
        if (invalidateCache || !config.cache || currentTimeMS - config.cache.lastCached > config.CACHE_INTERVAL_MS)
            return require('./src/cli')();

        // print cached string with no newline, ideal for embedding in prompt  
        if (promptFlagThrown)
            return process.stdout.write(config.cache.weatherString);

        // basic usage, prompt string with newline
        if (!args.length) {
            return console.log(config.cache.weatherString);
        }

        return require('./src/cli')();

    } 

    // let these commands through regardless of whether terminal-weather config is installed or not.
    if ( passThroughArgs.some(arg => args.includes(arg)) ) 
       return require('./src/cli')(); 

    console.log(`${ ansiColors.fgBlue }no terminal-weather configuration file exists. Run ${ansiColors.reset}${ansiColors.bgBlack}"terminal-weather configure"${ansiColors.reset}${ansiColors.fgBlue} to set one up.${ansiColors.reset}`); 
    process.exit(1);

};
