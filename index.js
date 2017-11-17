const path = require('path');
const homedir = require('homedir')();
const args = process.argv.slice(2);
const configPath = path.join(homedir,'.terminal-weather.json');
const { reset, fgBlue, bgBlack } = require(path.join(__dirname,'src','lib','colors'));
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
        const noArgs = args.length === 0;

 
        // if cache needs to be populated, call cli 
        if (invalidateCache || !config.cache || currentTimeMS - config.cache.lastCached > config.CACHE_INTERVAL_MS) {
            return require('./src/cli')();
        }

        // print cached string with no newline, ideal for embedding in prompt  
        if (promptFlagThrown) {
            return process.stdout.write(config.cache.weatherString);
        }

        // basic usage, prompt string with newline
        if (noArgs) {
            return console.log(config.cache.weatherString);
        }

        return require('./src/cli')();

    } 

    // let these commands through regardless of whether terminal-weather config is installed or not.
    if ( passThroughArgs.some(arg => args.includes(arg)) ) { 
       return require('./src/cli')(); 
    }

    console.log(`${reset}${fgBlue}No terminal-weather configuration file can be found.\nRun ${reset}${bgBlack}terminal-weather configure${reset}${fgBlue} to set one up.${reset}`); 
    process.exit(1);

};
