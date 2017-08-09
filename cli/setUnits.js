const config = require(global.configPath);
const fs = require('fs');
const normalizedUnits = {
    k: 'kelvin',
    c: 'celcius',
    f: 'fahrenheit',
    kelvin: 'kelvin',
    celcius: 'celcius',
    fahrenheit: 'fahrenheit'
}; 

function setUnits(config, unitType) {
    config.units = unitType;
    const outputConfig = JSON.stringify(config, null, 2);
    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    })
}

function setUnitsHandler(unitType) {   
    
    const unitTypes = Object.keys(normalizedUnits);
    if (!unitTypes.includes(unitType.toLowerCase())) {
        console.log('Invalid unit type:', unitType);
        process.exit(1);
    }
    setUnits(config, normalizedUnits[unitType]);
}

module.exports = setUnitsHandler;
