const config = require(global.configPath);
const fs = require('fs');

function setUnits(config, unitType) {
    config.units = unitType;
    const outputConfig = JSON.stringify(config, null, 2);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    })
}

function setUnitsHandler(unitType) {   
    setUnits(config, unitType);
}

module.exports = setUnitsHandler;
