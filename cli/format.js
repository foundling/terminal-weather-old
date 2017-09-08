const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname,'../config.json'); 
const config = require(configPath);

function setFormatString(config, formatString) {
    config.format = formatString;
    return config;
}

function main({ formatString }) {   

    const outputConfig = JSON.stringify(setFormatString(config, formatString), null, 4);

    try {
        fs.writeFileSync(configPath, outputConfig, 'utf8');
    } catch(e) {
        throw e;
    }
}

module.exports = { main, setFormatString };
