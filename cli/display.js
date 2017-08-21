const fs = require('fs');

function setDisplay(config, displayMode) {

    config.displayMode = displayMode;
    return config;

}

function main(displayMode) {   

    const config = require(global.configPath);
    setDisplay(config, displayMode);
    const outputConfig = JSON.stringify(config, null, 2);

    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    });

}

module.exports = {
    main,
    setDisplay
};
