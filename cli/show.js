const { ansiColors } = require('../data/display');

module.exports = {
    main() {

        const config = require(global.configPath);
        const { 

            bgLightWhite, 
            fgBlue, 
            underscore,
            reset 

        } = ansiColors;

        console.log();
        console.log(`${ underscore }Your Current Terminal Weather Configuration: ${ reset }`);
        console.log();
        console.log(`${ underscore } ${ fgBlue }CONFIG LOCATION: ${reset} ${global.configPath}`); 
        console.log(`${ underscore } ${ fgBlue }API KEY: ${reset} ${config.API_KEY}`);
        console.log(`${ underscore } ${ fgBlue }UNITS: ${reset} ${config.units} `);
        console.log(`${ underscore } ${ fgBlue }NETWORK TIMEOUT THRESHOLD: ${reset} ${config.NETWORK_TIMEOUT_MS/1000.0} seconds` ); 
        console.log(`${ underscore } ${ fgBlue }DISPLAY MODE: ${reset} ${ config.displayMode }`);

        if (!config.cache) return;

        console.log(`${ underscore } ${ fgBlue }LAST CACHED WEATHER STRING: ${ reset } ${config.cache.weather} `);
        console.log(`${ underscore } ${ fgBlue }DATE LAST CACHED: ${ reset } ${new Date(config.cache.lastCached).toLocaleTimeString()}, ${new Date(config.cache.lastCached).toDateString()}`);

        console.log();
    }

};
