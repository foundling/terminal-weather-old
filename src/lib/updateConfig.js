const path = require('path');
const fs = require('fs');
const homedir = require('homedir')();
const configPath = fs.readFileSync(path.join(homedir,'.terminal-weather.config'));

const validators = {
    units: function(unitType) {
        const normalizedUnits = ['f','c','k','fahrenheit','celcius','kelvin'];
        return normalizedUnits.includes(unitType);
    },
    display: function(displayType) {
        return ['text','icon'].includes(displayType);
    },
    format: function(formatString) {
        return true;
    }
};

module.exports = function updateConfig(updates) {
    const config = fs.readFileSync(configPath);
    for (let key in updates) {
        if (updates[key] && validateChange(key, updates[key]) ) 
            config[key] = updates[key];
    }
    // recompute weather string
    // write to config path
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
}


