const fs = require('fs');
const config = require(global.configPath);

function setDisplay(config, displayType) {
    config.displayType = displayType;
    const outputConfig = JSON.stringify(config, null, 2);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    })
}

function cliHandler(displayType) {   
    setDisplay(config, displayType);
}

module.exports = cliHandler;
