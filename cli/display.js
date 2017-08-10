const fs = require('fs');
const config = require(global.configPath);

function setDisplay(config, displayMode) {
    config.displayMode = displayMode;
    const outputConfig = JSON.stringify(config, null, 2);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    })
}

function cliHandler(displayMode) {   
    setDisplay(config, displayMode);
}

module.exports = cliHandler;
