const fs = require('fs');
const path = require('path');
const homedir = require('homedir')();
const configPath = path.join(homedir, '.terminal-weather.json');
const config = require(configPath);
const validate = (display) => ['text','icon'].includes(display);
const errorMsg = (display) => console.log(`Error: display argument must be either 'text' or 'icon'. ${ display } is not a valid display mode.`);

function main(display) {   

    if (!validate(display)) { 
        errorMsg(display);
        process.exit(1);
    }

    setDisplay(config, display);
    const outputConfig = JSON.stringify(config, null, 4);

    try {
        fs.writeFileSync(configPath, outputConfig, 'utf8');
    } catch(e) {
        throw e;
    } 

}

function setDisplay (config, display) {
    config.display = display;
    return config;
};

module.exports = { main, setDisplay };
