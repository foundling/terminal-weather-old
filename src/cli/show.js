const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
const config = require(configPath);
const { ansiColors } = require(path.join(__dirname, '../data/display'));

function main() {

    const { bgLightWhite, fgBlue, underscore, reset } = ansiColors;
    const { lastCached, weather } = config.cache;
    const lastCachedTime = new Date(lastCached).toLocaleTimeString(); 
    const lastCachedDate = new Date(lastCached).toDateString();

    let output = `
${ underscore }Your Current Terminal Weather Configuration: ${ reset }
${ underscore } ${ fgBlue }CONFIG LOCATION: ${reset} ${configPath}
${ underscore } ${ fgBlue }API KEY: ${reset} ${config.API_KEY}
${ underscore } ${ fgBlue }UNITS: ${reset} ${config.units}
${ underscore } ${ fgBlue }NETWORK TIMEOUT THRESHOLD: ${reset} ${config.NETWORK_TIMEOUT_MS/1000.0} seconds 
${ underscore } ${ fgBlue }DISPLAY MODE: ${reset} ${ config.displayMode }
`;

    if (config.cache) { 
        output += `
${ underscore } ${ fgBlue }LAST CACHED WEATHER STRING: ${ reset } ${ weather }
${ underscore } ${ fgBlue }DATE LAST CACHED: ${ reset } ${ lastCachedTime }, ${ lastCachedDate };
`;
    }

    console.log(output);

};

module.exports = { main };
