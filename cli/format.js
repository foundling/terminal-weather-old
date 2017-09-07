const fs = require('fs');

function setFormatString(config, formatString) {
    config.format = formatString;
    return config;
}

function main({ formatString, configPath }) {   
    const config = require(configPath);
    const outputConfig = JSON.stringify(setFormatString(config, formatString), null, 2);
    fs.writeFile(configPath, outputConfig, err => {
        if (err) throw err;
    })
}

module.exports = {
    main,
    setFormatString
};
