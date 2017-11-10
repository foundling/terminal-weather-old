const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
const config = require(configPath);
const validate = (displayMode) => ['text','icon'].includes(displayMode);
const errorMsg = (displayMode) => console.log(`Error: display argument must be either 'text' or 'icon'. ${ displayMode } is not a valid display mode.`);

function main(displayMode) {   

    if (!validate(displayMode)) { 
        errorMsg(displayMode);
        process.exit(1);
    }

    setDisplay(config, displayMode);
    const outputConfig = JSON.stringify(config, null, 4);

    try {
        fs.writeFileSync(configPath, outputConfig, 'utf8');
    } catch(e) {
        throw e;
    } 

}

function setDisplay (config, displayMode) {
    config.displayMode = displayMode;
    return config;
};

module.exports = { main, setDisplay };
