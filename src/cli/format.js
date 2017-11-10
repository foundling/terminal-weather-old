const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname,'../../config.json'); 

// turn into util method /w error handling
const config = JSON.parse(fs.readFileSync(configPath), 'utf8');
const { toWeatherString } = require(path.join(__dirname, 'formatWeather'));

function setFormatString(config, formatString) {
    config.format = formatString;
    return config;
}

function main(formatString) {   

    //setFormatString(config, formatString);
    //const outputConfig = JSON.stringify(config, null, 4);
    const results = config.cache.collectedData;
    toWeatherString)

}

module.exports = { main, setFormatString };
