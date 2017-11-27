const fs = require('fs');
const path = require('path');
const homedir = require('homedir')();
const configPath = path.join(homedir, '.terminal-weather.json');

// turn into util method /w error handling
const config = JSON.parse(fs.readFileSync(configPath), 'utf8');

function setFormatString(config, formatString) {
    config.format = formatString;
    return config;
}

function main(formatString) {   
    const newConfig = setFormatString(config, formatString);
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4), 'utf8'); 
}

module.exports = { main, setFormatString };
