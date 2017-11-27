const path = require('path');
const fs = require('fs');
const homedir = require('homedir')();
const display = require(path.join(__dirname,'display'));
const { computeDisplay, findSymbol } = require(path.join(__dirname,'formatWeather'));
const { normalize, convertTemp } = require(path.join(__dirname,'utils'));
const configPath = path.join(homedir, '.terminal-weather.json');
const singular = (s) => s.slice(0,-1);

function updateConfig(updates) {

    /* 
         Use existing and updated format settings to recompute 
         display string from cached values. 
     */ 
    const config = JSON.parse(fs.readFileSync(configPath));
    const preupdateUnits = config.units;

    const validators = {
        units: unitType => ['f','c','k','fahrenheit','celcius','kelvin'].includes(unitType.toLowerCase().trim()),
        display: displayType => ['text','icon'].includes(displayType),
        format: formatString => true
    };

    for (let key in updates) {

        let update = updates[key];
        let updateValid = validators[key](update);

        if (!update)
            continue;

        if (!updateValid) {
            console.log(`${update} is not a valid ${singular(key)}`);
            process.exit(1);
        }

        config[key] = update;

    }

    config.cache.temp = convertTemp(config.cache.temp).from(preupdateUnits).to(normalize.toConfig[config.units]); 
    config.cache.symbol = findSymbol(config.cache.description, config.display, display[config.display], config.sunHasSet);

    const weatherData = {
        temp: config.cache.temp,
        units: normalize.toConfig[config.units], 
        symbol: config.cache.symbol
    };

    config.cache.weatherString = computeDisplay(config.format, weatherData); 
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');

}

module.exports = updateConfig;
