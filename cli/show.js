module.exports = {
    main() {

        const config = require(global.configPath);

        console.log('CONFIG LOCATION:', global.configPath); 
        console.log('API KEY:', config.API_KEY);
        console.log('UNITS:', config.units);
        console.log('NETWORK TIMEOUT THRESHOLD:', `${config.NETWORK_TIMEOUT_MS/1000.0} seconds` ); 
        console.log('DISPLAY MODE:', config.displayMode);

        if (!config.cache) return;

        console.log('LAST CACHED WEATHER STRING:', config.cache.weather);
        console.log('DATE LAST CACHED:', `${new Date(config.cache.lastCached).toLocaleTimeString()}, ${new Date(config.cache.lastCached).toDateString()}`);

    }

};
