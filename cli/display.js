const fs = require('fs');
const config = require(global.configPath);

function setDisplay(config, displayMode) {
    config.displayMode = displayMode;
    return JSON.stringify(config, null, 2);
}

function main(displayMode) {   
    const outputConfig = setDisplay(config, displayMode);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    });
}

module.exports = {
    main,
    setDisplay
};
