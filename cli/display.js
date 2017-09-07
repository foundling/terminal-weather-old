const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
const config = require(configPath);
const toJSON = (o) => JSON.stringify(o, null, 4);
const setDisplay = (config, displayMode) => Object.assign({}, config, { displayMode });
const validate = (displayMode) => ['text','icon'].includes(displayMode);
const errorMsg = (displayMode) => console.log(`Error: display argument must be either text or icon. ${ displayMode } is not a valid display mode.`);

function main({ displayMode }) {   

    if (!validate(displayMode)) { 
        errorMsg(displayMode);
        process.exit(1);
    }

    const newConfig = setDisplay(config, displayMode);
    const outputConfig = toJSON(newConfig);

    fs.writeFile(configPath, outputConfig, 'utf8', err => {
        if (err) throw err;
    });

}

module.exports = {
    main,
    setDisplay
};
