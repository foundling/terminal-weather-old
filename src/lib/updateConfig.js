const path = require('path');
const fs = require('fs');
const homedir = require('homedir')();
const configPath = path.join(homedir, '.terminal-weather.json');
const { computeDisplay } = (path.join(__dirname,'formatWeather'));

function updateConfig(updates) {

    /* 
         Use existing and updated format settings to recompute 
         display string from cached values. 
     */

    const config = fs.readFileSync(configPath);
    const validators = {
        units: unitType => ['f','c','k','fahrenheit','celcius','kelvin'].includes(unitType),
        display: displayType => ['text','icon'].includes(displayType),
        format: formatString => true
    };

    for (let key in updates) {

        if (!updates[key])
            continue;

        let update = updates[key];
        let updateValid = validators[key](update);

        if (update && updateValid) 
            config[key] = updates[key];

        else if (!updateValid) { 
            console.log(`${update} is not a valid ${key}`);
            process.exit(1);
        }

    }

    const weatherData = {
        temp: config.cache.temp, 
        units: config.units, 
        symbol: config.cache.symbol
    };

    const updatedDisplay = computeDisplay(config.format, weatherData);
    console.log(updatedDisplay);
    process.exit();
    // recompute weather string
    // write to config path
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
}

module.exports = updateConfig;
