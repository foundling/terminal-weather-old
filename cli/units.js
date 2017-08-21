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

function main(unitType) {   
    
    const normalizedUnitType = unitType.toLowerCase();
    if (!normalizedUnits[normalizedUnitType]) {
        console.log('Invalid unit type:', unitType);
        process.exit(1);
    }
    setUnits(config, normalizedUnits[normalizedUnitType]);
}

module.exports = { 
    main
};
