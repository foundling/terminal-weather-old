const fs = require('fs');
const path = require('path');
const homedir = require('homedir')();
const configPath = path.join(homedir, '.terminal-weather.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const normalizedUnits = {
    k: 'kelvin',
    c: 'celcius',
    f: 'fahrenheit',
    kelvin: 'kelvin',
    celcius: 'celcius',
    fahrenheit: 'fahrenheit'
}; 

function main(unitType) {   
    
    const normalizedUnitType = unitType.trim().toLowerCase();
    if (!normalizedUnits[normalizedUnitType]) {
        console.log('Invalid unit type:', unitType);
        process.exit(1);
    }

    const newConfig = setUnits(config, normalizedUnits[normalizedUnitType]);
    const outputConfig = JSON.stringify(newConfig, null, 4);

    try {
        fs.writeFileSync(configPath, outputConfig, 'utf8');
    } catch(e) {
        throw e;
    }

}

function setUnits(config, unitType) {
    config.units = unitType;
    return config;
};

module.exports = { main, setUnits };
