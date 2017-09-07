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
    fs.writeFile(configPath, outputConfig, 'utf8', err => {
        if (err) throw err;
    })
}

module.exports = { main, setFormatString };
