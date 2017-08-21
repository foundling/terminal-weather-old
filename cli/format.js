const fs = require('fs');

function setFormatString(config, formatString) {
    config.format = formatString;
    return config;
}

function main(formatString) {   
    const config = require(global.configPath);
    const outputConfig = JSON.stringify(setFormatString(config, formatString), null, 2);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    })
}

module.exports = {
    main,
    setFormatString
};
