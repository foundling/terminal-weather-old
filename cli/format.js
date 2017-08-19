const fs = require('fs');
const config = require(global.configPath);

function setFormatString(config, formatString) {
    console.log(formatString);
    config.format = formatString;
    const outputConfig = JSON.stringify(config, null, 2);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    })
}

function formatHandler(formatString) {   
    setFormatString(config, formatString);
}

module.exports = formatHandler;
