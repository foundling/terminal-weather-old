const fs = require('fs');

function setDisplay(config, displayMode) {
    config.displayMode = displayMode;
    return JSON.stringify(config, null, 2);
}

function main(displayMode) {   
    const config = require(global.configPath);
    const outputConfig = setDisplay(config, displayMode);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    });
}

module.exports = {
    main,
    setDisplay
};
